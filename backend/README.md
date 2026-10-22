# AICTE Intelligence — Document Verification & OCR Engine

> **SIH Problem Statement SIH26261**: AI-Powered Application Validation, Document Authentication, and Regulatory Compliance Verification.

This service is a high-performance Python FastAPI service that ingests genuine regulatory documents (PDFs, TIFFs, scanned PNG/JPEG images), validates file header magic bytes, extracts digital stream and raster image characters, parses domain entities via regex heuristics, and evaluates Approval Process Handbook (APH 2024–27) compliance rules.

---

## Architecture Overview

```
backend/
├── app/
│   ├── config.py                 # Port, CORS, upload limits, academic cycle
│   ├── main.py                   # FastAPI app entrypoint & middleware
│   ├── schemas.py                # Pydantic models for documents & checks
│   ├── routers/
│   │   ├── health.py             # GET /api/health (OCR engine status)
│   │   ├── documents.py          # POST /api/documents/upload, GET /file, GET /samples
│   │   └── verification.py       # POST /api/verification/re-verify
│   └── services/
│       ├── file_storage.py       # Magic byte validation, SHA-256 hash, UUID storage
│       ├── pdf_extraction.py     # pypdf text extraction & scanned page heuristic
│       ├── ocr_service.py        # Tesseract detection & Pillow raster analysis
│       ├── field_extraction.py   # Regex extraction (Order No, AY, Expiry, Intake, Land)
│       └── validation_engine.py  # APH 2024–27 compliance rules & finding generation
├── sample_docs/                  # Pre-built test PDF documents
├── scripts/
│   ├── generate_sample_docs.py   # Generates test PDFs with real text
│   └── test_upload.py            # Automated test runner for upload & rule engine
├── requirements.txt
└── README.md
```

---

## Setup & Running

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Run the Verification Backend Server
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
The API is available at: `http://localhost:8000`  
Swagger UI Interactive Documentation: `http://localhost:8000/docs`  
Health Endpoint: `http://localhost:8000/api/health`

### 3. Generate Sample Demonstration PDFs
```bash
python backend/scripts/generate_sample_docs.py
```

### 4. Run Verification Test Suite
```bash
python backend/scripts/test_upload.py
```

---

## Document Validation Rules

| Check Name | Target Clause | Trigger Condition |
| :--- | :--- | :--- |
| **Active Academic Validity** | APH Ch. II § 2.14 | Flags expiration dates prior to current cycle (AY 2026–27) |
| **Seat Intake Consistency** | APH Ch. III § 3.2 | Flags intake discrepancy if declared delta exceeds 0 |
| **Signatory Authentication** | Statutory Verification | Detects presence of official registrar, principal, or notary markers |
| **Raster & Layout Integrity** | Forensic Scrutiny | Detects low DPI, severe compression noise, or corrupt raster headers |
| **Municipal Fire Safety** | Fire Safety Act § 13 | Detects wet riser, static water tank, and valid expiry |

---

## Engine Status & OCR Transparency
The engine is completely transparent regarding hardware capabilities. When Tesseract OCR is not installed in the host system PATH, the service relies on digital stream parsing via `pypdf` with 100% text fidelity and logs raster inspection for officer scrutiny, never fabricating false OCR claims.

---

## Enabling Native Tesseract OCR on Windows (Optional)

By default, the platform runs with full functionality on digital PDFs without requiring any external binaries. If evaluators wish to test native optical character recognition on scanned bitmap images:

1. **Download the Tesseract Windows 64-bit installer**:
   - Official UB-Mannheim Build: [https://github.com/UB-Mannheim/tesseract/wiki](https://github.com/UB-Mannheim/tesseract/wiki)
   - Installer direct link: `tesseract-ocr-w64-setup-5.x.x.exe`

2. **Install to default location**:
   - Install to `C:\Program Files\Tesseract-OCR`
   - The backend `OCRService` will auto-detect `C:\Program Files\Tesseract-OCR\tesseract.exe` automatically without requiring PATH restart.

3. **Verify Detection**:
   - Visit: `http://localhost:8000/api/health`
   - The response will immediately report:
     ```json
     {
       "status": "healthy",
       "ocrAvailable": true,
       "ocrEngineInfo": "Tesseract binary detected at C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
     }
     ```
   - In the frontend upload modal, the status indicator will update to: **FastAPI Connected (Tesseract OCR Active)**.
