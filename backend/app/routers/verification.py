from typing import Dict, Any, Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from backend.app.routers.documents import DOCUMENTS_STORE
from backend.app.schemas import ValidationCheckSchema
from backend.app.services.field_extraction import FieldExtractionService
from backend.app.services.validation_engine import ValidationEngineService

router = APIRouter(prefix="/verification", tags=["Verification"])

class VerificationRequest(BaseModel):
    documentId: str
    declaredIntake: Optional[int] = None
    declaredLandAcres: Optional[float] = None
    targetAcademicYear: Optional[str] = "2026-27"

class CrossCheckDocumentsRequest(BaseModel):
    docIdA: str
    docIdB: str

@router.post("/re-verify")
def re_verify_document(req: VerificationRequest) -> Dict[str, Any]:
    if req.documentId not in DOCUMENTS_STORE:
        raise HTTPException(status_code=404, detail="Document not found.")

    doc = DOCUMENTS_STORE[req.documentId]
    raw_text = doc.get("fullRawText", "")
    category = doc.get("category", "Regulatory")
    filename = doc.get("name", "")

    extracted_data = FieldExtractionService.extract_fields(raw_text, category, filename)
    validation_res = ValidationEngineService.evaluate_document(
        raw_text=raw_text,
        category=category,
        extracted_info=extracted_data,
        is_scanned=doc.get("isScanned", False),
        has_visual_anomaly=doc.get("hasVisualAnomaly", False),
        anomaly_details=doc.get("anomalyDetails")
    )

    return {
        "documentId": req.documentId,
        "status": validation_res["status"],
        "checks": [c.model_dump() if hasattr(c, "model_dump") else c.dict() for c in validation_res["checks"]],
        "findings": validation_res["findings"],
        "fields": [f.model_dump() if hasattr(f, "model_dump") else f.dict() for f in extracted_data["fields"]]
    }

@router.post("/cross-check-pair")
def cross_check_document_pair(req: CrossCheckDocumentsRequest) -> Dict[str, Any]:
    """
    Directly compares two documents for intake discrepancy.
    Cites both documents, their filenames, and delta.
    """
    if req.docIdA not in DOCUMENTS_STORE:
        raise HTTPException(status_code=404, detail=f"Document '{req.docIdA}' not found.")
    if req.docIdB not in DOCUMENTS_STORE:
        raise HTTPException(status_code=404, detail=f"Document '{req.docIdB}' not found.")

    docA = DOCUMENTS_STORE[req.docIdA]
    docB = DOCUMENTS_STORE[req.docIdB]

    intakeA = docA.get("extractedIntakeValue")
    intakeB = docB.get("extractedIntakeValue")

    if intakeA is None or intakeB is None:
        return {
            "hasMismatch": False,
            "intakeA": intakeA,
            "intakeB": intakeB,
            "detail": "One or both documents lack an extracted numeric intake value.",
            "checks": [
                {
                    "id": "chk-pair-intake",
                    "name": "Cross-Document Intake Parity",
                    "status": "SKIPPED",
                    "detail": "Insufficient intake evidence in one or both documents."
                }
            ],
            "findings": []
        }

    if intakeA != intakeB:
        delta = abs(intakeA - intakeB)
        check = {
            "id": "chk-pair-intake",
            "name": "Cross-Document Intake Parity",
            "status": "FAIL",
            "detail": f"Conflict detected: '{docA['name']}' ({intakeA} seats) vs '{docB['name']}' ({intakeB} seats). Delta: {delta} seats."
        }
        finding = {
            "id": f"fnd-pair-mismatch-{req.docIdA[-4:]}-{req.docIdB[-4:]}",
            "title": "Cross-Document Approved Seat Intake Mismatch",
            "category": "Academic & Seat Intake",
            "severity": "HIGH",
            "type": "INTAKE_MISMATCH",
            "status": "FLAGGED",
            "clauseRef": "APH 2024–27 Clause 3.2.4 (Cross-Document Parity)",
            "observedValue": f"'{docA['name']}': {intakeA} seats vs '{docB['name']}': {intakeB} seats (Delta: {delta} seats)",
            "expectedValue": "Exact mathematical parity between institutional declarations and affiliation orders",
            "explanation": f"Discordant intake figures extracted between '{docA['name']}' ({intakeA} seats) and '{docB['name']}' ({intakeB} seats).",
            "recommendedAction": "Reconcile with University Academic Senate and cap provisional approval at lower threshold.",
            "riskWeight": 18,
            "relatedDocumentId": req.docIdA,
        }
        return {
            "hasMismatch": True,
            "intakeA": intakeA,
            "intakeB": intakeB,
            "delta": delta,
            "checks": [check],
            "findings": [finding]
        }

    return {
        "hasMismatch": False,
        "intakeA": intakeA,
        "intakeB": intakeB,
        "delta": 0,
        "checks": [
            {
                "id": "chk-pair-intake",
                "name": "Cross-Document Intake Parity",
                "status": "PASS",
                "detail": f"Exact match: Both '{docA['name']}' and '{docB['name']}' specify {intakeA} seats."
            }
        ],
        "findings": []
    }
