# AICTE Intelligence — Regulatory Scrutiny & Document Verification Platform

> **Smart India Hackathon 2026 Prototype**  
> **Problem Statement SIH26261**: AI-Powered Application Validation, Document Authentication, and Regulatory Compliance Verification.

---

## 🏛️ Executive Summary

**AICTE Intelligence** is an enterprise-grade regulatory assistance platform designed for AICTE scrutiny committees and approval bureaus. It automates the ingestion, authentication, and rule-based compliance verification of institutional applications under the **Approval Process Handbook (APH 2024–2027)**.

The system combines:
1. **Digital Document Ingestion & Forensic OCR**: Genuine Python FastAPI pipeline parsing digital PDFs, detecting raster tampering artifacts, and evaluating statutory clauses in real time.
2. **Deterministic Risk Scoring**: Transparent, auditable mathematical score (0–100) computed from weighted statutory violations (e.g., +25 expired affiliation, +25 missing fire safety NOC, +18 seat intake delta, +10 seal raster anomaly).
3. **Multi-Source Verification Ledger**: Verification queue linking document evidence, observed vs. expected statutory norms, algorithmic explanations, and officer actions.
4. **Primary Demonstration Benchmark**: Full lifecycle showcase using fictional synthetic case `DEMO-EoA-2026-0142` (*Meridian Institute of Technology*, Pune).

---

## 🏗️ System Architecture

```
aicte-intelligence/
├── src/                               # React 18 + Vite + TypeScript Frontend
│   ├── components/
│   │   ├── dashboard/                 # KPI metrics, velocity charts, timelines
│   │   ├── applications/              # Status badges, priority badges, review drawer
│   │   ├── verification/              # Verification detail drawer & inspection tools
│   │   └── workspace/                 # Evidence scrutiny workspace, upload modal, document inspector
│   ├── context/
│   │   └── ApplicationContext.tsx     # Deterministic risk engine, localStorage persistence
│   ├── pages/
│   │   ├── CommandCentre.tsx          # Regulatory Command Centre with Showcase Spotlight
│   │   ├── ApplicationReviewWorkspace.tsx # Multi-tab scrutiny workspace (?tab=documents)
│   │   ├── VerificationCentrePage.tsx # Centralized multi-source verification ledger
│   │   ├── RiskIntelligencePage.tsx   # Regional heatmaps, distribution curves & insights
│   │   └── DeficienciesPage.tsx       # Deficit tracking & clarification dispatch
│   └── lib/
│       ├── api.ts                     # FastAPI client bindings & health checks
│       └── verificationData.ts        # Dynamic derivation linking uploaded evidence to queue
│
├── backend/                           # Python 3.11+ FastAPI Rule Engine
│   ├── app/
│   │   ├── main.py                    # API entrypoint, CORS, security headers
│   │   ├── routers/                   # /api/health, /api/documents, /api/verification
│   │   └── services/                  # Magic bytes, pypdf parser, regex entity extractor, rule engine
│   ├── sample_docs/                   # Pre-generated synthetic PDF fixtures
│   └── tests/                         # Pytest test suite (16 unit & integration tests)
│
└── tests/e2e/                         # Playwright end-to-end browser test suite (18 automated tests)
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js** v18+ (tested on Node v20/v22)
- **Python** 3.10+ (tested on Python 3.11/3.14)

### 1. Start the Python Verification Backend
```bash
# In project root
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- API Base: `http://127.0.0.1:8000`
- Swagger UI Docs: `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/api/health`

### 2. Start the Frontend Application
```bash
# In a separate terminal window
npm run dev
```
- Frontend UI: `http://localhost:5173/`

---

## 🎬 3-Minute Video Demonstration Script

Follow this step-by-step sequence for a compelling video presentation:

1. **Regulatory Command Centre (`http://localhost:5173/`)**:
   - Point out the **Header & Prototype Indicator** (`SIH26261 Prototype · APH Standard 2024–27`).
   - Showcase the **5 Key Metrics** (`Total Applications`, `Pending Review`, `Validation Exceptions`, `High-Priority Cases`, `Documents Reviewed`).
   - Highlight the **Featured Demonstration Spotlight Banner**: `Meridian Institute of Technology (DEMO-EoA-2026-0142)` with baseline risk score **78/100 (High Scrutiny Attention)**.
   - Click **"Launch Scrutiny Workspace"**.

2. **Application Scrutiny Workspace (`/applications/demo-eoa-0142/review`)**:
   - Inspect the **Header Strip**: Application ID, Institution Name, Status, Risk Score 78, Priority High.
   - Show the **Risk Breakdown Panel**:
     - `Expired Affiliation Order` (+25 pts)
     - `Fire & Life Safety NOC Missing` (+25 pts)
     - `Approved Intake Mismatch` (+18 pts)
     - `Land Conversion Seal Anomaly` (+10 pts)
   - Click **"Upload & Verify Document"**:
     - View the 4-step ingestion pipeline stepper.
     - Click sample test bench fixture: **"Valid Affiliation Order (AY 2026–27)"**.
     - Click **"Execute Verification"** — watch real Python FastAPI processing (magic byte check, text stream extraction, regex entity parsing, rule validation).
     - Click **"Attach Evidence & Update Risk Score"**.

3. **Deterministic Finding Resolution**:
   - In the Scrutiny Workspace, select finding **fnd-01** (`University Affiliation Expired`).
   - Change Review Determination to **Resolved** and add notes.
   - **Observe live score update**: Score immediately drops from **78 to 53**!
   - Refresh the browser (`F5`): Confirm localStorage persists the 53 score.

4. **Regulatory Verification Centre (`/verification`)**:
   - Navigate to the Verification Centre.
   - Inspect the **Summary KPIs**: `Total Checks`, `Successful Matches`, `Mismatches Requiring Review`.
   - Filter or click on any record to open the **Verification Detail Drawer**:
     - Point out the execution badge (`Local Rule Pipeline` vs `Simulated External Gateway`).
     - Review the evidentiary comparison: Observed Value vs Expected Regulatory Norm.
     - Review Algorithmic Explanation and Recommended Scrutiny Officer Action.

5. **Risk Intelligence & Insights (`/risk-insights`)**:
   - Review Regional Heatmap (Western Region high scrutiny density).
   - Review Risk Score Distribution Curve and Deficiency Root Causes.

---

## 🧪 Verification & Automated Testing

The project includes automated regression test suites covering both the Python backend and browser frontend:

### Backend Pytest Suite
```bash
python -m pytest backend/tests -v
```
*Expected: 16/16 passed.*

### Frontend Production Build
```bash
npm run build
```
*Expected: Clean Vite production build with zero TypeScript or bundle errors.*

### Playwright End-to-End Browser Automation Suite
```bash
node tests/e2e/comprehensive_e2e_test.cjs
```
*Expected: 18/18 tests passed across Command Centre, Upload Modal, Review Workspace, Verification Ledger, and Risk Insights.*

---

## 🔒 Security & Data Integrity

- **Magic Byte Validation**: All uploaded files are inspected at byte level (`%PDF`, `\x89PNG`, `\xFF\xD8\xFF`) to prevent extension spoofing.
- **Upload Hard Limits**: Strict 15 MB payload ceiling.
- **Path Traversal Protection**: Uploaded files receive cryptographically random UUID identifiers; no user filenames are written directly to filesystem paths.
- **Synthetic Data Safety**: All institutional names, student counts, and application IDs in this demonstration are synthetic and clearly marked with disclaimer banners.

---

## 📄 License & Attribution

Developed for **Smart India Hackathon 2026** under Problem Statement **SIH26261**.  
Approval Process Handbook (APH) 2024–2027 regulatory specifications adapted for technical education scrutiny research.
