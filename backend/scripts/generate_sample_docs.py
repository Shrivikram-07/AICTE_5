import os
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

DOCS_DIR = Path(__file__).resolve().parent.parent / "sample_docs"
DOCS_DIR.mkdir(parents=True, exist_ok=True)

def create_valid_affiliation():
    path = DOCS_DIR / "affiliation_order_valid_2026.pdf"
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter

    # Header Border
    c.setStrokeColor(colors.HexColor("#1e3a8a"))
    c.setLineWidth(2)
    c.rect(30, 30, width - 60, height - 60)

    # Header
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(colors.HexColor("#0f172a"))
    c.drawCentredString(width / 2, height - 70, "STATE TECHNICAL UNIVERSITY OF AFFILIATIONS")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#475569"))
    c.drawCentredString(width / 2, height - 88, "Directorate of Academic Affiliation & Regulatory Oversight")
    c.drawCentredString(width / 2, height - 102, "Knowledge Campus, Technical Board Road, New Delhi - 110002")

    c.setLineWidth(0.5)
    c.line(50, height - 115, width - 50, height - 115)

    # Document Title & Ref
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(colors.HexColor("#1e293b"))
    c.drawString(60, height - 145, "PROVISIONAL AFFILIATION ORDER FOR AY 2026–2027")

    c.setFont("Helvetica-Bold", 10)
    c.drawString(60, height - 175, "Ref. Order No: AU/AFFIL/2026-27/REG-8842")
    c.setFont("Helvetica", 10)
    c.drawString(width - 200, height - 175, "Date of Issue: 18th March 2026")

    # Body Text
    textobject = c.beginText(60, height - 210)
    textobject.setFont("Helvetica", 10)
    textobject.setLeading(16)
    
    lines = [
        "To,",
        "The Principal / Secretary,",
        "Meridian Institute of Technology (PID: 1-93481203),",
        "Sector 12, Knowledge Park, Gautam Buddha Nagar, Uttar Pradesh.",
        "",
        "Subject: Grant of Extension of Provisional Affiliation for Academic Year 2026-27 - Reg.",
        "",
        "Sir / Madam,",
        "In accordance with the State Technical University Act and the AICTE Approval Process Handbook (APH 2024-27),",
        "sanction of provisional affiliation is hereby conveyed for the Academic Year 2026-2027 subject to fulfillment",
        "of all statutory norms and land guidelines prescribed by AICTE and State Government.",
        "",
        "1. Institution Details: Meridian Institute of Technology (Permanent ID: 1-93481203)",
        "2. Land Area Surveyed: 7.82 acres of continuous institutional land under Survey No. 412/A.",
        "3. Approved Intake: 420 seats across B.Tech in CSE, ECE, Mechanical, and Data Science.",
        "4. Period of Validity: Valid strictly up to 30th June 2027.",
        "",
        "Terms and Conditions:",
        "a) The institution shall maintain student-to-faculty cadre ratio as per AICTE handbook norms (1:15 / 1:20).",
        "b) Physical infrastructure, barrier-free access, and fire safety systems must be certified annually.",
        "c) Any change in intake without prior approval from AICTE and this Board shall invite regulatory penalty.",
        "",
        "Yours faithfully,",
    ]
    for line in lines:
        textobject.textLine(line)
    c.drawText(textobject)

    # Signatory Box
    c.setFont("Helvetica-Bold", 10)
    c.drawString(width - 240, 100, "Dr. K. S. Ramanathan, Ph.D.")
    c.setFont("Helvetica", 9)
    c.drawString(width - 240, 85, "Registrar & Authorized Signatory")
    c.drawString(width - 240, 72, "State Technical University [SEAL]")

    c.save()
    print("Created:", path)

def create_expired_affiliation():
    path = DOCS_DIR / "affiliation_order_expired_2024.pdf"
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter

    c.setStrokeColor(colors.HexColor("#b91c1c"))
    c.setLineWidth(2)
    c.rect(30, 30, width - 60, height - 60)

    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(colors.HexColor("#991b1b"))
    c.drawCentredString(width / 2, height - 70, "PREVIOUS CYCLE AFFILIATION CERTIFICATE (EXPIRED)")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#475569"))
    c.drawCentredString(width / 2, height - 90, "Directorate of Technical Board Operations")

    c.line(50, height - 105, width - 50, height - 105)

    c.setFont("Helvetica-Bold", 11)
    c.drawString(60, height - 135, "Order No: STB/AFFIL/EXP-2024-910")
    c.drawString(width - 220, height - 135, "Date of Issue: 12th July 2024")

    textobject = c.beginText(60, height - 170)
    textobject.setFont("Helvetica", 10)
    textobject.setLeading(16)
    
    lines = [
        "Certificate of Affiliation for Prior Cycle:",
        "Institution: Meridian Institute of Technology (PID: 1-93481203)",
        "",
        "This is to certify that affiliation was granted strictly for Academic Year 2024-25.",
        "Validity Condition: This affiliation certificate expired on 31st July 2025.",
        "",
        "DEFICIENCY NOTICE / NOTE:",
        "The holder has not submitted renewal for AY 2026-27 under this file number.",
        "Under AICTE APH Chapter II Clause 2.14, submitting expired affiliation documents",
        "constitutes an immediate compliance deficiency requiring manual inspection or re-submission.",
        "",
        "Sanctioned Intake under AY 2024-25: 360 seats.",
        "",
        "State Technical Board Secretary",
    ]
    for line in lines:
        textobject.textLine(line)
    c.drawText(textobject)

    c.setFont("Helvetica-Bold", 10)
    c.drawString(width - 240, 90, "Joint Registrar [EXPIRED ARCHIVE]")

    c.save()
    print("Created:", path)

def create_intake_discrepancy():
    path = DOCS_DIR / "intake_approval_discrepancy_360.pdf"
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter

    c.setStrokeColor(colors.HexColor("#c2410c"))
    c.setLineWidth(2)
    c.rect(30, 30, width - 60, height - 60)

    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(colors.HexColor("#0f172a"))
    c.drawCentredString(width / 2, height - 70, "STATE ADMISSION COMMITTEE & SEAT SANCTION BOARD")
    
    c.line(50, height - 90, width - 50, height - 90)

    c.setFont("Helvetica-Bold", 11)
    c.drawString(60, height - 120, "Notification Order No: SAC/INTAKE/2026/041")
    c.drawString(width - 200, height - 120, "Date: 04th April 2026")

    textobject = c.beginText(60, height - 150)
    textobject.setFont("Helvetica", 10)
    textobject.setLeading(16)
    
    lines = [
        "Subject: Sanctioned Seat Intake for Academic Year 2026-27 - Reg.",
        "",
        "Institution: Meridian Institute of Technology (PID: 1-93481203)",
        "",
        "In accordance with seat allocation meeting held on 2nd April 2026, the committee approves:",
        "1. Computer Science & Engineering: 120 seats",
        "2. Electronics & Communication Engineering: 120 seats",
        "3. Mechanical Engineering: 60 seats",
        "4. Information Technology: 60 seats",
        "",
        "TOTAL SANCTIONED INTAKE: 360 seats only.",
        "",
        "IMPORTANT OBSERVATION:",
        "The institution's EoA portal application requested 420 seats. However, due to faculty cadre deficit,",
        "the sanctioned intake remains capped at 360 seats. Operating excess intake above 360 is unapproved.",
        "",
        "Period of Validity: Academic Year 2026-27.",
        "Signatory: Member Secretary, State Admission Committee.",
    ]
    for line in lines:
        textobject.textLine(line)
    c.drawText(textobject)

    c.setFont("Helvetica-Bold", 10)
    c.drawString(width - 240, 90, "Member Secretary [SEAL]")

    c.save()
    print("Created:", path)

def create_fire_noc():
    path = DOCS_DIR / "fire_safety_noc_compliant.pdf"
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter

    c.setStrokeColor(colors.HexColor("#15803d"))
    c.setLineWidth(2)
    c.rect(30, 30, width - 60, height - 60)

    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(colors.HexColor("#166534"))
    c.drawCentredString(width / 2, height - 70, "DEPARTMENT OF FIRE AND RESCUE SERVICES")
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#374151"))
    c.drawCentredString(width / 2, height - 88, "Office of the Chief Fire Officer - District Fire Headquarters")

    c.line(50, height - 100, width - 50, height - 100)

    c.setFont("Helvetica-Bold", 11)
    c.drawString(60, height - 125, "NOC Certificate No: FIRE-NOC-MUNI-2026-789")
    c.drawString(width - 200, height - 125, "Date: 15th January 2026")

    textobject = c.beginText(60, height - 155)
    textobject.setFont("Helvetica", 10)
    textobject.setLeading(16)
    
    lines = [
        "CERTIFICATE OF FIRE SAFETY AND NO OBJECTION CERTIFICATE (NOC)",
        "",
        "Certified that the institutional premises of:",
        "Meridian Institute of Technology (PID: 1-93481203),",
        "comprising Academic Block A, Administrative Block, and Engineering Laboratories,",
        "was inspected on 12th January 2026 by the Divisional Fire Officer.",
        "",
        "Findings & Fire Safety Infrastructure:",
        "- Wet riser and hydrant system: Operational with 100,000L static reservoir.",
        "- Automatic smoke detection and fire alarm panel: Fully functional.",
        "- Emergency evacuation staircases: Clear with photoluminescent exit signage.",
        "- Portable fire extinguishers: Inspected and tagged with valid expiry dates.",
        "",
        "Validity Condition: This Fire Safety NOC is valid strictly up to 31st March 2027.",
        "",
        "Issued under Section 13 of the Fire Prevention and Life Safety Measures Act.",
    ]
    for line in lines:
        textobject.textLine(line)
    c.drawText(textobject)

    c.setFont("Helvetica-Bold", 10)
    c.drawString(width - 240, 90, "Chief Fire Officer [DIGITALLY SIGNED]")

    c.save()
    print("Created:", path)

if __name__ == "__main__":
    create_valid_affiliation()
    create_expired_affiliation()
    create_intake_discrepancy()
    create_fire_noc()
    print("All sample PDF documents generated successfully!")
