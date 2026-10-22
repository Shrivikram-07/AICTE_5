from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from PIL import Image, ImageDraw

FIXTURES_DIR = Path(__file__).resolve().parent
FIXTURES_DIR.mkdir(parents=True, exist_ok=True)

def generate_digital_test_pdf(
    filename: str,
    ref_no: str,
    institution: str,
    academic_year: str,
    expiry_date: str,
    intake_seats: int,
    land_acres: float = 5.25
) -> Path:
    path = FIXTURES_DIR / filename
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter

    c.setStrokeColor(colors.HexColor("#1e3a8a"))
    c.setLineWidth(1.5)
    c.rect(35, 35, width - 70, height - 70)

    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(colors.HexColor("#0f172a"))
    c.drawCentredString(width / 2, height - 75, "STATE TECHNICAL ACCREDITATION COUNCIL")

    c.setFont("Helvetica-Bold", 11)
    c.drawString(60, height - 120, f"Order No: {ref_no}")
    c.drawString(width - 220, height - 120, "Date: 15-April-2026")

    text = c.beginText(60, height - 160)
    text.setFont("Helvetica", 10)
    text.setLeading(16)
    
    lines = [
        f"Institution: {institution}",
        f"Subject: Regulatory Approval Dossier for Academic Year {academic_year}",
        "",
        f"Sanctioned Intake Capacity: Approved Intake: {intake_seats} seats.",
        f"Statutory Validity: Valid strictly up to {expiry_date}.",
        f"Land Title: Survey No. 881/B with total area of {land_acres} acres.",
        "",
        "This order is issued under AICTE Approval Process Handbook (APH 2024-27).",
        "Authorized Signatory: Registrar & Member Secretary [SEAL]",
    ]
    for line in lines:
        text.textLine(line)
    c.drawText(text)

    c.setFont("Helvetica-Bold", 10)
    c.drawString(width - 220, 80, "Registrar [DIGITALLY SIGNED]")
    c.save()
    return path

def generate_scanned_test_image(filename: str, text: str) -> Path:
    path = FIXTURES_DIR / filename
    img = Image.new("RGB", (900, 1100), color=(250, 250, 250))
    d = ImageDraw.Draw(img)
    # Draw simple text and bounding borders
    d.rectangle([(20, 20), (880, 1080)], outline=(100, 100, 100), width=2)
    d.text((50, 50), text, fill=(20, 20, 20))
    d.text((50, 150), "OFFICIAL SCANNED REGULATORY CERTIFICATE", fill=(10, 10, 10))
    d.text((50, 200), "Academic Year: 2026-27 | Intake: 120 seats", fill=(30, 30, 30))
    img.save(str(path))
    return path

if __name__ == "__main__":
    generate_digital_test_pdf(
        "test_fixture_valid_eoa.pdf",
        "REG-REF-TEST-9921",
        "Meridian Institute of Technology",
        "2026-27",
        "30th June 2027",
        420
    )
    generate_digital_test_pdf(
        "test_fixture_cross_120.pdf",
        "ORDER-INTAKE-120-SAC",
        "Apex Institute of Technology",
        "2026-27",
        "30th June 2027",
        120
    )
    generate_digital_test_pdf(
        "test_fixture_cross_180.pdf",
        "APPLICATION-INTAKE-180-PART-A",
        "Apex Institute of Technology",
        "2026-27",
        "30th June 2027",
        180
    )
    generate_digital_test_pdf(
        "test_fixture_expired.pdf",
        "EXP-ORDER-AY-2024",
        "Meridian Institute of Technology",
        "2024-25",
        "31st July 2025",
        120
    )
    generate_scanned_test_image("test_fixture_scanned.png", "MUNICIPAL FIRE CLEARANCE CERTIFICATE NOC-2026")
    print("All fixtures generated successfully!")
