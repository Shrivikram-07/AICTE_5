from pathlib import Path

def test_empty_file_rejected(client):
    res = client.post(
        "/api/documents/upload",
        files={"file": ("empty.pdf", b"", "application/pdf")},
        data={"category": "Regulatory"}
    )
    assert res.status_code == 400
    assert "empty" in res.json()["detail"].lower()

def test_unsupported_extension_rejected(client):
    res = client.post(
        "/api/documents/upload",
        files={"file": ("malicious.exe", b"MZ\x90\x00\x03\x00\x00\x00", "application/x-msdownload")},
        data={"category": "Regulatory"}
    )
    assert res.status_code == 400
    assert "unsupported" in res.json()["detail"].lower()

def test_masked_file_signature_rejection(client):
    """
    Fake PDF: text file with .pdf extension lacking %PDF magic header
    """
    fake_content = b"This is just a plain text file pretending to be a PDF."
    res = client.post(
        "/api/documents/upload",
        files={"file": ("fake_document.pdf", fake_content, "application/pdf")},
        data={"category": "Regulatory"}
    )
    assert res.status_code == 400
    assert "signature does not match" in res.json()["detail"].lower()

def test_file_size_limit_rejection(client):
    """
    Simulate a file exceeding 15 MB limit without generating full memory buffer.
    """
    oversized = b"%PDF-1.4 " + (b"0" * (16 * 1024 * 1024))
    res = client.post(
        "/api/documents/upload",
        files={"file": ("oversized.pdf", oversized, "application/pdf")},
        data={"category": "Regulatory"}
    )
    assert res.status_code == 413
    assert "exceeds maximum allowed size" in res.json()["detail"].lower()

def test_path_traversal_protection(client):
    """
    Test path traversal strings in doc_id to ensure no file outside upload directory can be read.
    """
    malicious_ids = [
        "../../config",
        "..%2F..%2Fconfig",
        "....//....//etc/passwd",
        "..\\..\\config.py",
        "doc-upl-1234/../../../main.py"
    ]
    for bad_id in malicious_ids:
        res = client.get(f"/api/documents/{bad_id}/file")
        assert res.status_code in [404, 422, 400], f"Expected safe rejection for {bad_id}, got {res.status_code}"

def test_nonexistent_doc_id_returns_404(client):
    res = client.get("/api/documents/doc-upl-00000000/file")
    assert res.status_code == 404

def test_internal_storage_path_not_exposed_in_api(client):
    """
    Verify that document detail API responses do not leak local filesystem directory structure.
    """
    valid_pdf = b"%PDF-1.4\n%AICTE test\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"
    res = client.post(
        "/api/documents/upload",
        files={"file": ("secure_test.pdf", valid_pdf, "application/pdf")},
        data={"category": "Regulatory"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "storagePath" not in data

    detail_res = client.get(f"/api/documents/{data['id']}")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert "storagePath" not in detail_data
    assert "C:\\" not in str(detail_data.get("downloadUrl", ""))
