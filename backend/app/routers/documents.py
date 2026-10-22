import os
import time
import json
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse

from backend.app.config import settings
from backend.app.schemas import (
    DocumentUploadResponse,
    DocumentDetailSchema,
    CrossDocumentVerificationRequest,
    CrossDocumentVerificationResponse,
)
from backend.app.services.file_storage import FileStorageService
from backend.app.services.pdf_extraction import PDFExtractionService
from backend.app.services.ocr_service import OCRService
from backend.app.services.field_extraction import FieldExtractionService
from backend.app.services.validation_engine import ValidationEngineService

router = APIRouter(prefix="/documents", tags=["Documents"])

# In-memory document registry for session persistence, backed by json cache on disk
DOCUMENTS_STORE: Dict[str, Dict[str, Any]] = {}
CACHE_FILE = settings.UPLOAD_DIR / ".documents_cache.json"

def _load_cache():
    global DOCUMENTS_STORE
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                DOCUMENTS_STORE = json.load(f)
        except Exception:
            DOCUMENTS_STORE = {}

def _save_cache():
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(DOCUMENTS_STORE, f, indent=2)
    except Exception:
        pass

# Initialize cache
_load_cache()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form("Regulatory"),
    documentType: Optional[str] = Form(None),
    institutionId: Optional[str] = Form(None),
    applicationId: Optional[str] = Form(None)
):
    start_time = time.time()
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing file name.")

    # 1. Read bytes safely
    content = await file.read()
    if not content or len(content) == 0:
        raise HTTPException(status_code=400, detail="Security rejection: Uploaded file is empty (0 bytes).")

    # 2. Store securely and validate magic signature
    storage_meta = FileStorageService.save_upload_file(file, content)
    doc_id = storage_meta["doc_id"]
    filename = storage_meta["original_filename"]
    ext = storage_meta["extension"]
    mime_type = storage_meta["mime_type"]
    file_size_bytes = storage_meta["file_size_bytes"]
    file_hash = storage_meta["file_hash"]

    # Check for duplicate cryptographic hash
    is_duplicate_hash = any(
        existing_doc.get("fileHash") == file_hash
        for existing_id, existing_doc in DOCUMENTS_STORE.items()
        if (not applicationId or existing_doc.get("applicationId") == applicationId)
    )

    # 3. Extraction based on type
    is_pdf = ext == ".pdf"
    pages_count = 1
    raw_text = ""
    is_scanned = False
    ocr_engine = None
    has_visual_anomaly = False
    anomaly_details = None

    if is_pdf:
        try:
            pdf_data = PDFExtractionService.extract_pdf_data(content)
            pages_count = pdf_data["pages_count"]
            raw_text = pdf_data["full_text"]
            is_scanned = pdf_data["is_scanned"]
            ocr_engine = "pypdf-native-parser"
            if is_scanned:
                ocr_available, _ = OCRService.is_tesseract_available()
                ocr_engine = "pypdf-scanned-stream" if not ocr_available else "tesseract-ocr-pdf"
        except Exception as e:
            raw_text = f"[PDF Parsing Error: {str(e)}]"
            has_visual_anomaly = True
            anomaly_details = f"PDF structure error: {str(e)}"
    else:
        # Image file
        img_data = OCRService.process_image(content)
        raw_text = img_data["extracted_text"]
        has_visual_anomaly = img_data["has_visual_anomaly"]
        anomaly_details = img_data["anomaly_details"]
        ocr_engine = "tesseract-ocr" if img_data["ocr_available"] else "image-raster-analyzer"
        is_scanned = True

    # 4. Field extraction
    doc_category = category or "Regulatory"
    extracted_data = FieldExtractionService.extract_fields(raw_text, doc_category, filename)
    extracted_fields = extracted_data["fields"]
    detected_ref = extracted_data["detected_ref"]
    detected_expiry = extracted_data["detected_expiry"]
    detected_intake_number = extracted_data.get("detected_intake_number")

    # 5. Rule-based compliance & APH validation
    validation_res = ValidationEngineService.evaluate_document(
        raw_text=raw_text,
        category=doc_category,
        extracted_info=extracted_data,
        is_scanned=is_scanned,
        has_visual_anomaly=has_visual_anomaly,
        anomaly_details=anomaly_details,
        is_duplicate_hash=is_duplicate_hash
    )

    # 6. Same-Application Cross-Document Verification (APH Clause 3.2.4)
    cross_res = ValidationEngineService.evaluate_cross_document_intake(
        target_doc_id=doc_id,
        target_filename=filename,
        current_intake=detected_intake_number,
        application_id=applicationId,
        all_documents=DOCUMENTS_STORE
    )
    validation_res["checks"].extend(cross_res["checks"])
    if cross_res["hasMismatch"]:
        validation_res["findings"].extend(cross_res["findings"])
        validation_res["status"] = "FLAGGED"

    elapsed_ms = int((time.time() - start_time) * 1000)

    # Format human-readable size
    kb = file_size_bytes / 1024
    if kb >= 1024:
        file_size_str = f"{kb/1024:.1f} MB"
    else:
        file_size_str = f"{kb:.1f} KB"

    # Attach document ID to generated findings
    generated_findings = []
    finding_ids = []
    for f in validation_res["findings"]:
        f_with_doc = dict(f)
        f_with_doc["id"] = f"{f['id']}-{doc_id[-4:]}"
        f_with_doc["documentId"] = doc_id
        generated_findings.append(f_with_doc)
        finding_ids.append(f_with_doc["id"])

    response_payload = {
        "id": doc_id,
        "name": filename,
        "documentType": documentType or (Path(filename).stem.replace("_", " ").title()),
        "category": doc_category,
        "uploadDate": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": validation_res["status"],
        "fileSize": file_size_str,
        "fileSizeBytes": file_size_bytes,
        "pagesCount": pages_count,
        "fileHash": file_hash,
        "mimeType": mime_type,
        "applicationId": applicationId,
        "issuingAuthority": "State Govt / University / Municipal Council",
        "referenceNumber": detected_ref,
        "validityWindow": detected_expiry or "2026–2027 Academic Year",
        "extractedIntakeValue": detected_intake_number,
        "extractedFields": [f.model_dump() if hasattr(f, "model_dump") else f.dict() for f in extracted_fields],
        "validationChecks": [c.model_dump() if hasattr(c, "model_dump") else c.dict() for c in validation_res["checks"]],
        "associatedFindingIds": finding_ids,
        "rawTextExcerpt": raw_text[:800] if raw_text else "No textual characters extracted.",
        "processingTimeMs": elapsed_ms,
        "ocrEngineUsed": ocr_engine,
        "isScanned": is_scanned,
        "hasVisualAnomaly": has_visual_anomaly,
        "anomalyDetails": anomaly_details,
        "duplicateHashDetected": is_duplicate_hash,
        "findingsGenerated": generated_findings,
    }

    # Persist in document store (without leaking internal disk path)
    detail_record = dict(response_payload)
    detail_record["fullRawText"] = raw_text
    detail_record["downloadUrl"] = f"/api/documents/{doc_id}/file"
    DOCUMENTS_STORE[doc_id] = detail_record
    _save_cache()

    return DocumentUploadResponse(**response_payload)

@router.get("/samples/list")
def list_sample_documents():
    sample_dir = Path(__file__).resolve().parent.parent.parent / "sample_docs"
    if not sample_dir.exists():
        return []
    files = []
    for f in sample_dir.glob("*.pdf"):
        files.append({
            "filename": f.name,
            "title": f.stem.replace("_", " ").title(),
            "size": f.stat().st_size,
            "downloadUrl": f"/api/documents/samples/file/{f.name}"
        })
    return files

@router.get("/samples/file/{filename}")
def get_sample_document_file(filename: str):
    sample_dir = Path(__file__).resolve().parent.parent.parent / "sample_docs"
    safe_name = os.path.basename(filename)
    file_path = sample_dir / safe_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Sample file not found.")
    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename={safe_name}"}
    )

@router.post("/cross-check", response_model=CrossDocumentVerificationResponse)
def cross_check_application_documents(req: CrossDocumentVerificationRequest):
    """
    Evaluates cross-document consistency across all uploaded documents for a given applicationId.
    """
    app_docs = [
        d for d in DOCUMENTS_STORE.values()
        if d.get("applicationId") == req.applicationId
        and (not req.documentIds or d.get("id") in req.documentIds)
    ]

    intake_docs = [d for d in app_docs if d.get("extractedIntakeValue") is not None]

    if len(intake_docs) < 2:
        return CrossDocumentVerificationResponse(
            applicationId=req.applicationId,
            documentsAnalyzedCount=len(app_docs),
            hasMismatch=False,
            comparedIntakes=[{"doc_id": d["id"], "name": d["name"], "intake": d["extractedIntakeValue"]} for d in intake_docs],
            validationChecks=[
                ValidationCheckSchema(
                    id="chk-cross-intake-summary",
                    name="Cross-Document Intake Alignment",
                    status="PASS",
                    detail=f"Single intake source ({intake_docs[0]['extractedIntakeValue']} seats) or insufficient comparative documents present." if intake_docs else "No numeric intake declarations found across documents."
                )
            ],
            findingsGenerated=[]
        )

    # Compare distinct intake values
    distinct_intakes = {d["extractedIntakeValue"] for d in intake_docs}
    if len(distinct_intakes) > 1:
        primary = intake_docs[0]
        secondary = intake_docs[1]
        delta = abs(primary["extractedIntakeValue"] - secondary["extractedIntakeValue"])
        
        finding = {
            "id": f"fnd-cross-intake-app-{req.applicationId[-4:]}",
            "title": "Cross-Document Approved Seat Intake Mismatch",
            "category": "Academic & Seat Intake",
            "severity": "HIGH",
            "type": "INTAKE_MISMATCH",
            "status": "FLAGGED",
            "clauseRef": "APH 2024–27 Clause 3.2.4 (Cross-Document Parity)",
            "observedValue": f"'{primary['name']}': {primary['extractedIntakeValue']} seats vs '{secondary['name']}': {secondary['extractedIntakeValue']} seats (Delta: {delta})",
            "expectedValue": "Exact mathematical parity between institutional declarations and affiliation orders",
            "explanation": f"Discrepant intake numbers identified between submitted statutory documents '{primary['name']}' ({primary['extractedIntakeValue']} seats) and '{secondary['name']}' ({secondary['extractedIntakeValue']} seats).",
            "recommendedAction": "Require institutional reconciliation and cap provisional approval at lower threshold.",
            "riskWeight": 18,
            "relatedDocumentId": primary["id"],
        }

        return CrossDocumentVerificationResponse(
            applicationId=req.applicationId,
            documentsAnalyzedCount=len(app_docs),
            hasMismatch=True,
            comparedIntakes=[{"doc_id": d["id"], "name": d["name"], "intake": d["extractedIntakeValue"]} for d in intake_docs],
            validationChecks=[
                ValidationCheckSchema(
                    id="chk-cross-intake-summary",
                    name="Cross-Document Intake Alignment",
                    status="FAIL",
                    detail=f"Conflict detected: '{primary['name']}' ({primary['extractedIntakeValue']} seats) vs '{secondary['name']}' ({secondary['extractedIntakeValue']} seats). Delta: {delta} seats."
                )
            ],
            findingsGenerated=[finding]
        )

    return CrossDocumentVerificationResponse(
        applicationId=req.applicationId,
        documentsAnalyzedCount=len(app_docs),
        hasMismatch=False,
        comparedIntakes=[{"doc_id": d["id"], "name": d["name"], "intake": d["extractedIntakeValue"]} for d in intake_docs],
        validationChecks=[
            ValidationCheckSchema(
                id="chk-cross-intake-summary",
                name="Cross-Document Intake Alignment",
                status="PASS",
                detail=f"All {len(intake_docs)} documents with intake declarations align at {intake_docs[0]['extractedIntakeValue']} seats."
            )
        ],
        findingsGenerated=[]
    )

@router.get("/{doc_id}", response_model=DocumentDetailSchema)
def get_document_detail(doc_id: str):
    if doc_id not in DOCUMENTS_STORE:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    return DocumentDetailSchema(**DOCUMENTS_STORE[doc_id])

@router.get("/{doc_id}/file")
def get_document_file(doc_id: str):
    file_path = FileStorageService.get_file_path(doc_id)
    if not file_path or not file_path.exists():
        raise HTTPException(status_code=404, detail="File on disk not found.")
    
    # Determine media type
    ext = file_path.suffix.lower()
    media_type = "application/pdf" if ext == ".pdf" else "image/png"
    if ext in [".jpg", ".jpeg"]:
        media_type = "image/jpeg"
    elif ext == ".tiff":
        media_type = "image/tiff"

    return FileResponse(
        path=str(file_path),
        media_type=media_type,
        headers={"Content-Disposition": f"inline; filename={file_path.name}"}
    )
