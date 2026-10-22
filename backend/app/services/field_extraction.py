import re
from typing import Dict, Any, List, Optional
from backend.app.schemas import ExtractedFieldSchema

class FieldExtractionService:
    @staticmethod
    def extract_fields(raw_text: str, category: str, filename: str) -> Dict[str, Any]:
        """
        Applies domain regular expressions and heuristic entity parsing to extract
        structured AICTE compliance fields from raw document text.
        """
        fields: List[ExtractedFieldSchema] = []
        text_lower = raw_text.lower()

        # 1. Reference / Order Number Extraction
        ref_patterns = [
            r"(?:ref(?:\.|\s*order)?\s*no|order\s*no|file\s*no|f\.no|noc\s*(?:certificate\s*)?no)\s*[:.-]?\s*([A-Za-z0-9\/\-_]+)",
            r"(?:registration\s*no|reg\s*no)\s*[:.-]?\s*([A-Za-z0-9\/\-_]+)",
        ]
        detected_ref = None
        for pat in ref_patterns:
            m = re.search(pat, raw_text, re.IGNORECASE)
            if m:
                detected_ref = m.group(1).strip()
                break

        if detected_ref:
            fields.append(ExtractedFieldSchema(
                label="Reference / Order Number",
                value=detected_ref,
                confidence=0.95
            ))

        # 2. Academic Year Extraction
        year_patterns = [
            r"(?:academic\s*year|ay|year)\s*[:.-]?\s*([12][0-9]{3}\s*[-–/]\s*(?:[12][0-9]{3}|[0-9]{2}))",
            r"\b([12][0-9]{3}\s*[-–]\s*(?:[12][0-9]{3}|[0-9]{2}))\b",
        ]
        detected_year = None
        for pat in year_patterns:
            m = re.search(pat, raw_text, re.IGNORECASE)
            if m:
                detected_year = m.group(1).replace(" ", "").replace("–", "-")
                break

        if detected_year:
            # Check if year is strictly older than current cycle (2026-27)
            is_expired_year = any(past in detected_year for past in ["2023", "2024", "2024-25", "2024-2025", "2025", "2025-26"])
            fields.append(ExtractedFieldSchema(
                label="Academic Year",
                value=detected_year,
                confidence=0.92,
                isFlagged=is_expired_year,
                highlightNote="Prior cycle detected" if is_expired_year else "Current academic cycle"
            ))

        # 3. Expiry / Validity Date Extraction
        date_patterns = [
            r"(?:valid\s*till|valid\s*up\s*to|validity|expired\s*on|expires\s*on|date\s*of\s*expiry)\s*[:.-]?\s*([0-9]{1,2}(?:st|nd|rd|th)?[\s\/\-\.][A-Za-z0-9]+[\s\/\-\.][12][0-9]{3})",
            r"(?:valid\s*strictly\s*up\s*to)\s*([0-9]{1,2}(?:st|nd|rd|th)?\s*[A-Za-z]+\s*[12][0-9]{3})",
        ]
        detected_expiry = None
        for pat in date_patterns:
            m = re.search(pat, raw_text, re.IGNORECASE)
            if m:
                detected_expiry = m.group(1).strip()
                break

        if detected_expiry:
            is_past_expiry = any(y in detected_expiry for y in ["2022", "2023", "2024", "2025", "June 2025", "30-June-2025", "30th June 2025"])
            fields.append(ExtractedFieldSchema(
                label="Statutory Validity Window",
                value=detected_expiry,
                confidence=0.94,
                isFlagged=is_past_expiry,
                highlightNote="Validity window expired before AY 2026–27" if is_past_expiry else "Active validity"
            ))

        # 4. Seat Intake / Intake Capacity Extraction
        intake_pattern = r"(?:intake(?:\s*capacity)?|seats?|approved\s*intake|applied\s*intake|sanctioned\s*intake)\s*[:.-]?\s*([0-9]{2,4})\s*(?:seats?)?"
        intake_matches = re.findall(intake_pattern, raw_text, re.IGNORECASE)
        detected_intake = None
        detected_intake_number = None
        if intake_matches:
            detected_intake_number = int(intake_matches[0])
            detected_intake = f"{detected_intake_number} Seats"
            fields.append(ExtractedFieldSchema(
                label="Detected Seat Intake",
                value=detected_intake,
                confidence=0.88,
                isFlagged=len(intake_matches) > 1 and len(set(intake_matches)) > 1,
                highlightNote="Multiple diverging intake numbers detected in text" if (len(intake_matches) > 1 and len(set(intake_matches)) > 1) else None
            ))

        # 5. Institution Name / PID Extraction
        pid_match = re.search(r"(?:pid|institute\s*id|permanent\s*institute\s*id)\s*[:.-]?\s*([0-9\-_]+)", raw_text, re.IGNORECASE)
        if pid_match:
            fields.append(ExtractedFieldSchema(
                label="Permanent Institute ID (PID)",
                value=pid_match.group(1),
                confidence=0.96
            ))

        inst_match = re.search(r"(?:institution|college|institute|trust)\s*[:.-]?\s*([A-Za-z\s&,\.\(\)]{5,60}(?:technology|engineering|management|polytechnic|institute|college|trust))", raw_text, re.IGNORECASE)
        if inst_match:
            fields.append(ExtractedFieldSchema(
                label="Extracted Institution / Trust",
                value=inst_match.group(1).strip(),
                confidence=0.85
            ))

        # 6. Land Area / Survey Numbers
        survey_match = re.search(r"(?:survey\s*no\.?|gat\s*no\.?|khasra\s*no\.?)\s*[:.-]?\s*([0-9A-Za-z\/\-_,\s]+)", raw_text, re.IGNORECASE)
        if survey_match:
            fields.append(ExtractedFieldSchema(
                label="Survey / Land Parcel Number",
                value=survey_match.group(1).strip()[:40],
                confidence=0.90
            ))

        area_match = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*(?:acres?|hectares?|sq\.?\s*m(?:eters?)?)", raw_text, re.IGNORECASE)
        if area_match:
            fields.append(ExtractedFieldSchema(
                label="Campus Land Extent",
                value=area_match.group(0).strip(),
                confidence=0.88
            ))

        # 7. Category-Specific Fallbacks
        if not fields:
            fields.append(ExtractedFieldSchema(
                label="Document Identification",
                value=f"Parsed from {filename} ({len(raw_text)} chars parsed)",
                confidence=0.75
            ))

        return {
            "fields": fields,
            "detected_ref": detected_ref,
            "detected_year": detected_year,
            "detected_expiry": detected_expiry,
            "detected_intake": detected_intake,
            "detected_intake_number": detected_intake_number,
        }
