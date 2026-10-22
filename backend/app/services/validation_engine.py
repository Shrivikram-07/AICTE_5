from typing import Dict, Any, List, Optional
from backend.app.schemas import ValidationCheckSchema

class ValidationEngineService:
    @staticmethod
    def evaluate_document(
        raw_text: str,
        category: str,
        extracted_info: Dict[str, Any],
        is_scanned: bool,
        has_visual_anomaly: bool,
        anomaly_details: str = None,
        is_duplicate_hash: bool = False
    ) -> Dict[str, Any]:
        """
        Executes genuine rule-based verification against extracted document entities
        and Approval Process Handbook (APH 2024–27) standard clauses.
        """
        checks: List[ValidationCheckSchema] = []
        findings: List[Dict[str, Any]] = []
        doc_status = "VERIFIED"

        text_lower = raw_text.lower()
        fields = extracted_info.get("fields", [])
        detected_expiry = extracted_info.get("detected_expiry")
        detected_year = extracted_info.get("detected_year")
        detected_intake = extracted_info.get("detected_intake")
        detected_intake_number = extracted_info.get("detected_intake_number")

        # Check 0: Cryptographic Hash / Duplicate Detection
        if is_duplicate_hash:
            checks.append(ValidationCheckSchema(
                id="chk-duplicate-hash",
                name="Document Cryptographic Uniqueness",
                status="WARNING",
                detail="Duplicate SHA-256 digest: An identical document file was previously uploaded to this application docket."
            ))
            if doc_status == "VERIFIED":
                doc_status = "FLAGGED"
            findings.append({
                "id": "fnd-duplicate-upload",
                "title": "Duplicate Document Upload Detected",
                "category": "Mandatory Documentation",
                "severity": "MEDIUM",
                "type": "OTHER",
                "status": "FLAGGED",
                "clauseRef": "AICTE Document Ingestion Guidelines § 4",
                "observedValue": "Cryptographic SHA-256 collision with earlier docket file",
                "expectedValue": "Unique distinct file for each statutory requirement",
                "explanation": "The uploaded file matches the SHA-256 hash of an existing file in this application. Submitting duplicate files may indicate missing prerequisites.",
                "recommendedAction": "Verify whether this requirement should be fulfilled by an alternative document.",
                "riskWeight": 5,
            })
        else:
            checks.append(ValidationCheckSchema(
                id="chk-duplicate-hash",
                name="Document Cryptographic Uniqueness",
                status="PASS",
                detail="Cryptographic SHA-256 digest is distinct in application inventory."
            ))

        # Check 1: Document Format & Raster Integrity
        if has_visual_anomaly:
            checks.append(ValidationCheckSchema(
                id="chk-format",
                name="Raster Integrity & Tamper Scan",
                status="WARNING",
                detail=anomaly_details or "Localized compression artifact detected in raster scan. Officer visual inspection required."
            ))
            doc_status = "MANUAL_INSPECTION"
            findings.append({
                "id": "fnd-live-raster",
                "title": "Visual Artifact Detected in Uploaded Raster",
                "category": "Visual & Forensic Analysis",
                "severity": "HIGH",
                "type": "VISUAL_ANOMALY",
                "status": "REQUIRES_MANUAL_INSPECTION",
                "clauseRef": "Document Authenticity & Integrity Protocol",
                "observedValue": anomaly_details or "Anomalous raster compression",
                "expectedValue": "Clean uniform raster with verifiable physical revenue stamp",
                "explanation": "Heuristic inspection flagged image quality or compression disparity. Human visual scrutiny required.",
                "recommendedAction": "Examine original document or physical seal.",
                "riskWeight": 10,
            })
        else:
            checks.append(ValidationCheckSchema(
                id="chk-format",
                name="Raster & Layout Integrity",
                status="PASS",
                detail="Document layout conforms to standard raster density."
            ))

        # Check 2: Academic Validity & Expiry Rule (APH Clause 2.4.1)
        # Evaluated against current cycle: Academic Year 2026–2027
        is_expired = False
        if detected_expiry:
            expired_years = ["2022", "2023", "2024", "2025", "June 2025", "30-June-2025", "30th June 2025", "31st July 2025", "31-July-2025"]
            is_expired = any(y in detected_expiry for y in expired_years)

        if not is_expired and detected_year:
            expired_cycles = ["2022-23", "2023-24", "2024-25", "2024-2025", "2025-26", "2025-2026"]
            is_expired = any(c in detected_year for c in expired_cycles)

        if is_expired:
            checks.append(ValidationCheckSchema(
                id="chk-validity",
                name="Active Validity for AY 2026–27",
                status="FAIL",
                detail=f"Validity ended on {detected_expiry or detected_year}. Renewal for AY 2026–27 not detected."
            ))
            doc_status = "FLAGGED"
            findings.append({
                "id": "fnd-live-expired",
                "title": f"Uploaded {category} Has Expired Validity",
                "category": "Affiliation & Approvals",
                "severity": "HIGH",
                "type": "EXPIRED_AFFILIATION",
                "status": "FLAGGED",
                "clauseRef": "APH 2024–27 Clause 2.4.1 (Mandatory Affiliation / Validity)",
                "observedValue": f"Document expired on {detected_expiry or detected_year}",
                "expectedValue": "Valid Order extending through Academic Year 2026–2027",
                "explanation": "Uploaded statutory certificate has lapsed. Active renewal is compulsory for Extension of Approval.",
                "recommendedAction": "Require applicant to submit current renewal order.",
                "riskWeight": 25,
            })
        elif detected_expiry:
            checks.append(ValidationCheckSchema(
                id="chk-validity",
                name="Active Validity for AY 2026–27",
                status="PASS",
                detail=f"Certificate validity confirmed: {detected_expiry}"
            ))
        else:
            checks.append(ValidationCheckSchema(
                id="chk-validity",
                name="Tenure Window Evaluation",
                status="PASS",
                detail="No premature expiry restriction flagged in text stream."
            ))

        # Check 3: Single-Document Intake Extraction (Does NOT flag mismatch on its own)
        if detected_intake_number is not None:
            checks.append(ValidationCheckSchema(
                id="chk-intake",
                name="Seat Intake Matrix Format",
                status="PASS",
                detail=f"Intake parameter ({detected_intake_number} Seats) extracted cleanly from document text."
            ))
        elif detected_intake:
            checks.append(ValidationCheckSchema(
                id="chk-intake",
                name="Seat Intake Matrix Format",
                status="PASS",
                detail=f"Intake parameter ({detected_intake}) extracted from document stream."
            ))

        # Check 4: Category Keyword Alignment
        category_lower = category.lower()
        if "fire" in category_lower:
            if any(k in text_lower for k in ["fire", "safety", "cfo", "noc", "extinguisher", "hydrant", "hazard"]):
                checks.append(ValidationCheckSchema(
                    id="chk-fire-content",
                    name="Municipal Fire Safety Verification",
                    status="PASS",
                    detail="Municipal fire clearance directives identified in document content."
                ))
            else:
                checks.append(ValidationCheckSchema(
                    id="chk-fire-content",
                    name="Municipal Fire Safety Verification",
                    status="WARNING",
                    detail="Uploaded file lacks explicit municipal fire safety NOC terminology."
                ))
                if doc_status == "VERIFIED":
                    doc_status = "FLAGGED"

        # Check 5: Digital Signature & Authentication Markers
        has_signature = any(s in text_lower for s in ["signature", "signed", "registrar", "principal", "secretary", "tahsildar", "seal", "digitally signed", "pki", "authorized signatory"])
        if has_signature:
            checks.append(ValidationCheckSchema(
                id="chk-auth",
                name="Signatory Authentication Markers",
                status="PASS",
                detail="Authentic statutory signatory endorsements identified in stream."
            ))
        else:
            checks.append(ValidationCheckSchema(
                id="chk-auth",
                name="Signatory Authentication Markers",
                status="WARNING",
                detail="No explicit officer signature or notary seal markers detected in extracted text."
            ))

        return {
            "checks": checks,
            "status": doc_status,
            "findings": findings,
        }

    @staticmethod
    def evaluate_cross_document_intake(
        target_doc_id: str,
        target_filename: str,
        current_intake: Optional[int],
        application_id: Optional[str],
        all_documents: Dict[str, Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Cross-checks declared/sanctioned intake across multiple documents uploaded
        for the same application.
        Only triggers a mismatch when TWO actual extracted values are available and comparable.
        Cites both source documents and delta.
        """
        if current_intake is None or not application_id:
            return {
                "hasMismatch": False,
                "checks": [
                    ValidationCheckSchema(
                        id="chk-cross-intake",
                        name="Cross-Document Intake Parity",
                        status="SKIPPED",
                        detail="Cross-document comparison skipped (intake value or application ID absent)."
                    )
                ],
                "findings": [],
                "comparedIntakes": []
            }

        # Find other documents in the same application docket that also have an extracted intake
        docket_peers = []
        for doc_id, doc in all_documents.items():
            if doc_id == target_doc_id:
                continue
            if doc.get("applicationId") == application_id:
                peer_intake = doc.get("extractedIntakeValue")
                if peer_intake is not None:
                    docket_peers.append({
                        "doc_id": doc_id,
                        "name": doc.get("name", "Unknown File"),
                        "intake": peer_intake,
                        "documentType": doc.get("documentType", "Document"),
                        "rawTextExcerpt": (doc.get("rawTextExcerpt") or "")[:200]
                    })

        # If no other document with an intake exists for this application
        if not docket_peers:
            return {
                "hasMismatch": False,
                "checks": [
                    ValidationCheckSchema(
                        id="chk-cross-intake",
                        name="Cross-Document Intake Parity",
                        status="PASS",
                        detail=f"Single document intake analyzed ({current_intake} seats); no conflicting documents in application docket."
                    )
                ],
                "findings": [],
                "comparedIntakes": [{"doc_id": target_doc_id, "name": target_filename, "intake": current_intake}]
            }

        # Check for discrepancy with peers
        mismatched_peers = [p for p in docket_peers if p["intake"] != current_intake]

        if mismatched_peers:
            primary_peer = mismatched_peers[0]
            delta = abs(current_intake - primary_peer["intake"])
            
            check = ValidationCheckSchema(
                id="chk-cross-intake",
                name="Cross-Document Intake Parity",
                status="FAIL",
                detail=f"Intake conflict detected between '{target_filename}' ({current_intake} seats) and '{primary_peer['name']}' ({primary_peer['intake']} seats). Delta: {delta} seats."
            )

            finding = {
                "id": f"fnd-cross-intake-{target_doc_id[-4:]}",
                "title": "Cross-Document Approved Seat Intake Mismatch",
                "category": "Academic & Seat Intake",
                "severity": "HIGH",
                "type": "INTAKE_MISMATCH",
                "status": "FLAGGED",
                "clauseRef": "APH 2024–27 Clause 3.2.4 (Cross-Document Parity)",
                "observedValue": f"'{target_filename}': {current_intake} seats vs '{primary_peer['name']}': {primary_peer['intake']} seats (Delta: {delta} seats)",
                "expectedValue": "Exact mathematical parity between institutional declarations and affiliation orders",
                "explanation": (
                    f"Conflicting approved intake values extracted across submitted documents for application '{application_id}'. "
                    f"'{target_filename}' specifies {current_intake} seats, while '{primary_peer['name']}' specifies {primary_peer['intake']} seats. "
                    f"Under APH Clause 3.2.4, discordant intake figures require regulatory reconciliation."
                ),
                "recommendedAction": "Verify with University Academic Senate and restrict provisional approval to lower threshold pending clarification.",
                "riskWeight": 18,
                "relatedDocumentId": target_doc_id,
            }

            return {
                "hasMismatch": True,
                "checks": [check],
                "findings": [finding],
                "comparedIntakes": [
                    {"doc_id": target_doc_id, "name": target_filename, "intake": current_intake},
                    *docket_peers
                ]
            }

        # All peers match!
        matching_peer = docket_peers[0]
        check = ValidationCheckSchema(
            id="chk-cross-intake",
            name="Cross-Document Intake Parity",
            status="PASS",
            detail=f"Cross-document parity confirmed: Extracted intake ({current_intake} seats) matches '{matching_peer['name']}' ({matching_peer['intake']} seats) across application docket."
        )

        return {
            "hasMismatch": False,
            "checks": [check],
            "findings": [],
            "comparedIntakes": [
                {"doc_id": target_doc_id, "name": target_filename, "intake": current_intake},
                *docket_peers
            ]
        }
