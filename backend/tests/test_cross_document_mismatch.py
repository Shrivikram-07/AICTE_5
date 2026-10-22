from pathlib import Path

FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"

def test_single_document_does_not_trigger_cross_mismatch(client):
    """
    Requirement: Confirm a single document containing one intake value does NOT by itself trigger a cross-document mismatch.
    """
    path_120 = FIXTURES_DIR / "test_fixture_cross_120.pdf"
    with open(path_120, "rb") as f:
        bytes_120 = f.read()

    res = client.post(
        "/api/documents/upload",
        files={"file": ("test_fixture_cross_120.pdf", bytes_120, "application/pdf")},
        data={"category": "Academic & Seat Intake", "applicationId": "APP-TEST-SINGLE-INTAKE"}
    )
    assert res.status_code == 200
    data = res.json()

    assert data["extractedIntakeValue"] == 120
    # Confirm no mismatch finding
    cross_findings = [f for f in data["findingsGenerated"] if f["type"] == "INTAKE_MISMATCH"]
    assert len(cross_findings) == 0

    # Confirm check passed without conflict
    cross_check = next((c for c in data["validationChecks"] if c["name"] == "Cross-Document Intake Parity"), None)
    assert cross_check is not None
    assert cross_check["status"] == "PASS"

def test_two_conflicting_documents_trigger_cross_mismatch(client):
    """
    Requirement: Upload both documents and run verification. Confirm a mismatch is created ONLY when the two
    actual extracted values are available and comparable. The result must cite both source documents and delta.
    """
    app_id = "APP-TEST-CONFLICTING-INTAKE"

    # Step 1: Upload Doc A (120 seats)
    path_120 = FIXTURES_DIR / "test_fixture_cross_120.pdf"
    with open(path_120, "rb") as f:
        res1 = client.post(
            "/api/documents/upload",
            files={"file": ("docA_intake_120.pdf", f.read(), "application/pdf")},
            data={"category": "Academic & Seat Intake", "applicationId": app_id}
        )
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["extractedIntakeValue"] == 120

    # Step 2: Upload Doc B (180 seats) to the same application
    path_180 = FIXTURES_DIR / "test_fixture_cross_180.pdf"
    with open(path_180, "rb") as f:
        res2 = client.post(
            "/api/documents/upload",
            files={"file": ("docB_intake_180.pdf", f.read(), "application/pdf")},
            data={"category": "Academic & Seat Intake", "applicationId": app_id}
        )
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["extractedIntakeValue"] == 180

    # Verify cross-document check in Doc B failed
    cross_check = next((c for c in data2["validationChecks"] if c["name"] == "Cross-Document Intake Parity"), None)
    assert cross_check is not None
    assert cross_check["status"] == "FAIL"
    assert "docA_intake_120.pdf" in cross_check["detail"]
    assert "Delta: 60 seats" in cross_check["detail"]

    # Verify generated finding
    cross_findings = [f for f in data2["findingsGenerated"] if f["type"] == "INTAKE_MISMATCH"]
    assert len(cross_findings) == 1
    fnd = cross_findings[0]
    assert fnd["severity"] == "HIGH"
    assert fnd["riskWeight"] == 18
    assert "180 seats" in fnd["observedValue"]
    assert "120 seats" in fnd["observedValue"]

    # Step 3: Verify the pair verification endpoint
    pair_res = client.post(
        "/api/verification/cross-check-pair",
        json={"docIdA": data1["id"], "docIdB": data2["id"]}
    )
    assert pair_res.status_code == 200
    pair_data = pair_res.json()
    assert pair_data["hasMismatch"] is True
    assert pair_data["delta"] == 60
    assert pair_data["intakeA"] == 120
    assert pair_data["intakeB"] == 180

def test_matching_documents_pass_cleanly(client):
    app_id = "APP-TEST-MATCHING-INTAKE"

    path_120 = FIXTURES_DIR / "test_fixture_cross_120.pdf"
    with open(path_120, "rb") as f:
        b = f.read()

    res1 = client.post(
        "/api/documents/upload",
        files={"file": ("affiliation_schedule_120.pdf", b, "application/pdf")},
        data={"category": "Academic & Seat Intake", "applicationId": app_id}
    )
    assert res1.status_code == 200

    res2 = client.post(
        "/api/documents/upload",
        files={"file": ("university_order_120.pdf", b, "application/pdf")},
        data={"category": "Academic & Seat Intake", "applicationId": app_id}
    )
    assert res2.status_code == 200
    data2 = res2.json()

    cross_check = next((c for c in data2["validationChecks"] if c["name"] == "Cross-Document Intake Parity"), None)
    assert cross_check is not None
    assert cross_check["status"] == "PASS"
    assert "matches" in cross_check["detail"]
