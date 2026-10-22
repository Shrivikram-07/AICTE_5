from pathlib import Path
from backend.app.services.ocr_service import OCRService

FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"

def test_scanned_image_processing_and_transparent_ocr_status(client):
    img_path = FIXTURES_DIR / "test_fixture_scanned.png"
    assert img_path.exists(), "Scanned test fixture must exist"

    with open(img_path, "rb") as f:
        img_bytes = f.read()

    res = client.post(
        "/api/documents/upload",
        files={"file": ("test_fixture_scanned.png", img_bytes, "image/png")},
        data={"category": "Mandatory Documentation", "applicationId": "TEST-APP-SCAN"}
    )
    assert res.status_code == 200
    data = res.json()

    assert data["isScanned"] is True
    assert data["mimeType"] == "image/png"

    # Inspect host Tesseract availability
    tesseract_available, engine_info = OCRService.is_tesseract_available()

    if not tesseract_available:
        # Transparent reporting: never falsely report successful OCR
        assert data["ocrEngineUsed"] == "image-raster-analyzer"
        assert "Host system has no native Tesseract OCR binary configured" in data["rawTextExcerpt"]
    else:
        assert data["ocrEngineUsed"] == "tesseract-ocr"
