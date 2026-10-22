from pathlib import Path

FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"

def test_digital_pdf_entity_extraction_and_aph_validation(client):
    pdf_path = FIXTURES_DIR / "test_fixture_valid_eoa.pdf"
    assert pdf_path.exists(), "Test fixture must exist"

    with open(pdf_path, "rb") as f:
        file_bytes = f.read()

    res = client.post(
        "/api/documents/upload",
        files={"file": ("test_fixture_valid_eoa.pdf", file_bytes, "application/pdf")},
        data={"category": "Affiliation & Approvals", "applicationId": "TEST-APP-001"}
    )
    assert res.status_code == 200
    data = res.json()

    # Verify ID and basic metadata
    assert data["id"].startswith("doc-upl-")
    assert data["name"] == "test_fixture_valid_eoa.pdf"
    assert data["pagesCount"] == 1
    assert data["mimeType"] == "application/pdf"
    assert data["ocrEngineUsed"] == "pypdf-native-parser"

    # Verify extracted domain entities
    assert data["referenceNumber"] == "REG-REF-TEST-9921"
    assert "30th June 2027" in (data["validityWindow"] or "")
    assert data["extractedIntakeValue"] == 420

    # Verify validation checks
    check_names = [c["name"] for c in data["validationChecks"]]
    assert "Active Validity for AY 2026–27" in check_names or "Tenure Window Evaluation" in check_names
    assert "Seat Intake Matrix Format" in check_names
    assert "Signatory Authentication Markers" in check_names

    # Check status: should be VERIFIED with 0 critical findings
    assert data["status"] == "VERIFIED"
    assert len(data["findingsGenerated"]) == 0

def test_expired_affiliation_generates_deficiency_finding(client):
    pdf_path = FIXTURES_DIR / "test_fixture_expired.pdf"
    assert pdf_path.exists(), "Expired fixture must exist"

    with open(pdf_path, "rb") as f:
        file_bytes = f.read()

    res = client.post(
        "/api/documents/upload",
        files={"file": ("test_fixture_expired.pdf", file_bytes, "application/pdf")},
        data={"category": "Affiliation & Approvals", "applicationId": "TEST-APP-EXP"}
    )
    assert res.status_code == 200
    data = res.json()

    assert data["status"] == "FLAGGED"
    
    # Check that Active Validity failed
    validity_check = next((c for c in data["validationChecks"] if "Validity" in c["name"]), None)
    assert validity_check is not None
    assert validity_check["status"] == "FAIL"

    # Check that finding was generated with risk weight 25
    assert len(data["findingsGenerated"]) >= 1
    expired_fnd = next((f for f in data["findingsGenerated"] if f["type"] == "EXPIRED_AFFILIATION"), None)
    assert expired_fnd is not None
    assert expired_fnd["riskWeight"] == 25
    assert expired_fnd["severity"] == "HIGH"
