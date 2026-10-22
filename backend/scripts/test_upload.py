import urllib.request
from pathlib import Path
import json

def test_upload(pdf_name, category):
    file_path = Path(__file__).resolve().parent.parent / "sample_docs" / pdf_name
    boundary = "----WebKitFormBoundaryAICTETestUpload123"
    
    with open(file_path, "rb") as f:
        file_bytes = f.read()

    body = bytearray()
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{pdf_name}"\r\n'.encode("utf-8"))
    body.extend(b"Content-Type: application/pdf\r\n\r\n")
    body.extend(file_bytes)
    body.extend(b"\r\n")

    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="category"\r\n\r\n{category}\r\n'.encode("utf-8"))
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request("http://127.0.0.1:8000/api/documents/upload", data=bytes(body))
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"=== UPLOAD RESULT FOR: {pdf_name} ({category}) ===")
            print(f"Doc ID: {data['id']} | Status: {data['status']} | Size: {data['fileSize']} | Pages: {data['pagesCount']}")
            print(f"Ref No: {data['referenceNumber']} | Validity: {data['validityWindow']}")
            print(f"Engine: {data['ocrEngineUsed']} | Processing: {data['processingTimeMs']}ms")
            print(f"Extracted Fields ({len(data['extractedFields'])}):")
            for fld in data["extractedFields"]:
                flag_str = " [FLAGGED]" if fld.get("isFlagged") else ""
                print(f"   * {fld['label']}: {fld['value']}{flag_str}")
            print(f"Validation Checks ({len(data['validationChecks'])}):")
            for chk in data["validationChecks"]:
                print(f"   [{chk['status']}] {chk['name']}: {chk['detail']}")
            print(f"Findings ({len(data['findingsGenerated'])}):")
            for fnd in data["findingsGenerated"]:
                print(f"   ! [{fnd['severity']}] {fnd['title']} (+{fnd['riskWeight']} risk)")
            print("-" * 60)
            return data
    except urllib.error.HTTPError as e:
        print("Upload Error:", e.code, e.read().decode("utf-8"))

if __name__ == "__main__":
    test_upload("affiliation_order_valid_2026.pdf", "Affiliation & Approvals")
    test_upload("affiliation_order_expired_2024.pdf", "Affiliation & Approvals")
    test_upload("intake_approval_discrepancy_360.pdf", "Academic & Seat Intake")
    test_upload("fire_safety_noc_compliant.pdf", "Mandatory Documentation")
