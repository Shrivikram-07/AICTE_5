def test_duplicate_file_upload_detection(client):
    app_id = "APP-TEST-DUP-HASH"
    content = b"%PDF-1.4\n%UniqueHashTestDossier\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"

    # Upload first time
    res1 = client.post(
        "/api/documents/upload",
        files={"file": ("original_submission.pdf", content, "application/pdf")},
        data={"category": "Regulatory", "applicationId": app_id}
    )
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["duplicateHashDetected"] is False

    # Upload same file bytes second time
    res2 = client.post(
        "/api/documents/upload",
        files={"file": ("accidental_reupload.pdf", content, "application/pdf")},
        data={"category": "Regulatory", "applicationId": app_id}
    )
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["duplicateHashDetected"] is True

    # Check for duplicate warning check
    dup_check = next((c for c in data2["validationChecks"] if c["id"] == "chk-duplicate-hash"), None)
    assert dup_check is not None
    assert dup_check["status"] == "WARNING"

    # Check for duplicate finding
    dup_fnd = next((f for f in data2["findingsGenerated"] if f["type"] == "OTHER" and "Duplicate" in f["title"]), None)
    assert dup_fnd is not None
    assert dup_fnd["riskWeight"] == 5
