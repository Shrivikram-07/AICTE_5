import {
  ApplicationRecord,
  ActivityTimelineItem,
  IssueCategorySummary,
  Finding,
  ApplicationDocument,
  ComplianceChecklistItem,
  RiskScoreComponent,
} from '@/types';

/**
 * PRIMARY FICTIONAL DEMONSTRATION CASE: Meridian Institute of Technology
 * Seeded explicitly for SIH26261 validation demonstration
 */
export const PRIMARY_DEMO_CASE_DOCUMENTS: ApplicationDocument[] = [
  {
    id: 'doc-01',
    name: 'Affiliation_Certificate_2025_Univ.pdf',
    documentType: 'Statutory University Affiliation Order',
    uploadDate: '2026-10-18',
    status: 'FLAGGED',
    fileSize: '2.4 MB',
    pagesCount: 4,
    issuingAuthority: 'Maharashtra State Technological University (MSTU)',
    referenceNumber: 'MSTU/AFFIL/ENGG/2024/098',
    validityWindow: 'Valid until 30-June-2025 (Expired)',
    extractedFields: [
      { label: 'Affiliated Institution', value: 'Meridian Institute of Technology (PID: 1-412098)' },
      { label: 'Authorized Academic Year', value: '2024–2025 (Expired)', isFlagged: true, highlightNote: 'Validity ended 30-Jun-2025' },
      { label: 'Approved Courses', value: 'B.Tech (CSE, Mech, Civil) & M.Tech (AI)' },
      { label: 'Mandatory Renewal Status', value: 'Renewal for AY 2026–27 Not Detected', isFlagged: true },
    ],
    validationChecks: [
      { id: 'vc-1', name: 'Document Authenticity & Signature', status: 'PASS', detail: 'Registrar digital signature certificate is authentic and unexpired' },
      { id: 'vc-2', name: 'Active Validity Window', status: 'FAIL', detail: 'Affiliation expired on 30-June-2025. Mandatory renewal for AY 2026-27 is missing' },
      { id: 'vc-3', name: 'Institution Name Alignment', status: 'PASS', detail: 'Institution name matches Part-A institutional dossier verbatim' },
    ],
    associatedFindingIds: ['fnd-01'],
    samplePreviewText: {
      header: 'MAHARASHTRA STATE TECHNOLOGICAL UNIVERSITY\nBOARD OF AFFILIATION & ACCREDITATION',
      bodyParagraphs: [
        'ORDER NO: MSTU/AFFIL/ENGG/2024/098                                               DATED: 12-JUNE-2024',
        'In exercise of the powers conferred under Section 28 of the Maharashtra Technological Universities Act, provisional affiliation is hereby granted to MERIDIAN INSTITUTE OF TECHNOLOGY for the Academic Year 2024–2025.',
        'This affiliation order shall be valid strictly up to 30th June 2025, after which fresh inspection and compliance renewal shall be prerequisite for continuation.',
        'Sanctioned Programmes: B.Tech Computer Science & Engineering (120 Seats), B.Tech Mechanical Engineering (60 Seats), B.Tech Civil Engineering (60 Seats).',
      ],
      signatures: ['Prof. K. R. Deshmukh, Registrar (MSTU)', 'Dr. S. K. Joshi, Director Academic Audits'],
      stamps: ['[SEAL: Registrar Office MSTU, Pune Division]', '[WATERMARK: Provisional Affiliation 2024-25]'],
    },
  },
  {
    id: 'doc-02',
    name: 'Mandatory_Form_4B_Fire_Safety_NOC.pdf',
    documentType: 'Municipal Fire Safety & Structural Occupancy Certificate',
    uploadDate: 'Not Uploaded',
    status: 'MISSING',
    fileSize: '0 KB',
    pagesCount: 0,
    issuingAuthority: 'Municipal Fire Brigade / Chief Fire Officer',
    referenceNumber: 'Unassigned',
    validityWindow: 'Mandatory for AY 2026–27',
    extractedFields: [],
    validationChecks: [
      { id: 'vc-4', name: 'Mandatory Form Presence', status: 'FAIL', detail: 'Form 4B file is absent from uploaded dossier payload' },
      { id: 'vc-5', name: 'Fire Hydrant & Egress Plan', status: 'SKIPPED', detail: 'Cannot evaluate without Form 4B municipal clearance' },
    ],
    associatedFindingIds: ['fnd-02'],
    missingDocumentDetails: {
      requiredForm: 'Form 4B: Local Municipal Fire Brigade NOC & Building Structural Fitness',
      handbookClause: 'APH 2024–27 Clause 5.1.2 & Annexure 8 (Configured Demo Rule)',
      instructions: 'Applicant must provide valid fire NOC issued by the competent Municipal Corporation or Town Planning Authority certifying multi-story educational campus clearance.',
      consequences: 'Mandatory statutory prerequisite; failure to produce results in automatic withholding of Extension of Approval.',
    },
  },
  {
    id: 'doc-03',
    name: 'Institutional_Information_PartA_Intake.pdf',
    documentType: 'AICTE Institutional Information Form (Part-A)',
    uploadDate: '2026-10-19',
    status: 'FLAGGED',
    fileSize: '3.8 MB',
    pagesCount: 18,
    issuingAuthority: 'Governing Council, Meridian Institute of Technology',
    referenceNumber: 'MIT/AICTE-APP/2026/A-01',
    validityWindow: 'Academic Year 2026–27 Application Cycle',
    extractedFields: [
      { label: 'Programme Name', value: 'B.Tech Computer Science & Engineering' },
      { label: 'Declared Applied Intake', value: '180 Seats (Claimed Extension of +60)', isFlagged: true, highlightNote: 'Intake mismatch vs University schedule' },
      { label: 'Approved Cadre Ratio', value: '1:20 (18 Faculty members declared)' },
      { label: 'Built-up Instructional Area', value: '4,820 sq.m (Meets norms for 180 seats)' },
    ],
    validationChecks: [
      { id: 'vc-6', name: 'Institutional Form Completeness', status: 'PASS', detail: 'All 18 pages signed and authenticated by Principal' },
      { id: 'vc-7', name: 'Intake Cross-Verification', status: 'FAIL', detail: '180 seats declared, exceeding university sanctioned schedule of 120 seats' },
    ],
    associatedFindingIds: ['fnd-03'],
    samplePreviewText: {
      header: 'AICTE APPROVAL PROCESS SYSTEM · AY 2026–2027\nPART-A: INSTITUTIONAL INTAKE & INFRASTRUCTURE DECLARATION',
      bodyParagraphs: [
        'INSTITUTION: Meridian Institute of Technology (PID: 1-412098)',
        'SECTION 4: PROGRAMME & SEAT MATRIX SUBMISSION',
        'Course 1: B.Tech Computer Science & Engineering (4 Years Full Time)\nExisting Approved Intake: 120 | Applied Intake for 2026–27: 180 (+60 Seats)',
        'Undertaking: The institution affirms that requisite faculty cadre (1 Professor, 3 Associate Prof, 14 Asst Prof) and computing laboratories (240 terminals) are operational.',
      ],
      signatures: ['Dr. Rajeshwardas Nair, Principal', 'Shri V. M. Khobragade, Secretary'],
      stamps: ['[SEAL: Meridian Institute of Technology, Pune]'],
    },
  },
  {
    id: 'doc-04',
    name: 'University_Approved_Seat_Matrix_Schedule.pdf',
    documentType: 'University Affiliated Seat Matrix Schedule',
    uploadDate: '2026-10-18',
    status: 'FLAGGED',
    fileSize: '1.2 MB',
    pagesCount: 2,
    issuingAuthority: 'Office of the Academic Registrar, MSTU',
    referenceNumber: 'MSTU/ACAD/SEATS/2025-26/4120',
    validityWindow: 'Academic Year 2025–26 Schedule',
    extractedFields: [
      { label: 'Affiliated Programme', value: 'B.Tech Computer Science & Engineering' },
      { label: 'University Sanctioned Intake', value: '120 Seats Only', isFlagged: true, highlightNote: 'Delta of 60 seats vs declared' },
      { label: 'Additional Division Sanction', value: 'None Issued for AY 2026–27', isFlagged: true },
    ],
    validationChecks: [
      { id: 'vc-8', name: 'University Authority Verification', status: 'PASS', detail: 'Issued by State Technical University Academic Council' },
      { id: 'vc-9', name: 'Seat Count Cross-Check', status: 'FAIL', detail: 'Discrepancy: University recognizes 120 seats; college applied for 180 seats' },
    ],
    associatedFindingIds: ['fnd-03'],
    samplePreviewText: {
      header: 'MAHARASHTRA STATE TECHNOLOGICAL UNIVERSITY\nACADEMIC COUNCIL NOTIFICATION: SEAT SANCTIONS',
      bodyParagraphs: [
        'REF: MSTU/ACAD/SEATS/2025-26/4120                                            DATE: 04-MAY-2025',
        'Notification of Authorized Intake for Technical Colleges affiliated with MSTU:',
        'College Code 4120 - Meridian Institute of Technology:\n1. B.Tech Computer Science & Engg: 120 Seats (2 Divisions of 60)\n2. B.Tech Mechanical Engineering: 60 Seats (1 Division)\n3. B.Tech Civil Engineering: 60 Seats (1 Division)',
        'NOTE: Any unilateral intake expansion beyond 120 seats without prior Academic Council approval and university inspection shall not be admitted to CAP counseling.',
      ],
      signatures: ['Prof. K. R. Deshmukh, Registrar'],
      stamps: ['[SEAL: University Academic Council, Pune]'],
    },
  },
  {
    id: 'doc-05',
    name: 'Land_Title_Survey_142A_Conversion_Order.pdf',
    documentType: 'Revenue Department Land Conversion Order & Deed',
    uploadDate: '2026-10-19',
    status: 'MANUAL_INSPECTION',
    fileSize: '5.1 MB',
    pagesCount: 6,
    issuingAuthority: 'Sub-Divisional Revenue Officer / Tahsildar, Haveli',
    referenceNumber: 'REV/LND/CONV/2012/142-A',
    validityWindow: 'Permanent Educational Non-Agricultural (NA) Order',
    extractedFields: [
      { label: 'Survey Parcel Number', value: 'Survey No. 142/A & 143/B' },
      { label: 'Title Holder Entity', value: 'Meridian Educational & Charitable Trust' },
      { label: 'Total Land Parcel Extent', value: '3.25 Acres Contiguous (Meets 2.5 acre urban norm)' },
      { label: 'Forensic Anomaly Detection', value: 'Page 3 seal compression artifact & font baseline shift (Score 0.82)', isFlagged: true, highlightNote: 'Requires officer visual scrutiny' },
    ],
    validationChecks: [
      { id: 'vc-10', name: 'Land Contiguity & Area Norm', status: 'PASS', detail: '3.25 acres contiguous land conforms to APH Clause 4.1' },
      { id: 'vc-11', name: 'Visual Forensic Scrutiny', status: 'WARNING', detail: 'Automated scan detected localized compression artifact on Tahsildar stamp on Page 3' },
    ],
    associatedFindingIds: ['fnd-04'],
    samplePreviewText: {
      header: 'OFFICE OF THE SUB-DIVISIONAL OFFICER & TAHSILDAR\nHAVELI SUB-DIVISION, PUNE DISTRICT',
      bodyParagraphs: [
        'ORDER UNDER SECTION 44 OF MAHARASHTRA LAND REVENUE CODE, 1966',
        'ORDER NO: REV/LND/CONV/2012/142-A                                           DATE: 19-NOV-2012',
        'Sanction is hereby granted for Non-Agricultural (NA) conversion of land bearing Survey No. 142/A (2.00 Acres) and Survey No. 143/B (1.25 Acres) totaling 3.25 Acres situated at Village Wagholi, Taluka Haveli, District Pune, in favor of MERIDIAN EDUCATIONAL & CHARITABLE TRUST solely for Institutional & Educational use.',
        '[FORENSIC INSPECTION FLAG: Localized compression noise and font baseline displacement observed on the Tahsildar endorsement stamp (Page 3). Officer visual inspection recommended.]',
      ],
      signatures: ['Shri P. B. Patil, Sub-Divisional Officer'],
      stamps: ['[SEAL: Sub-Divisional Magistrate, Haveli - ANOMALY DETECTED]'],
      anomalyCoordinates: 'Page 3, X: 340px, Y: 680px (Tahsildar Endorsement)',
    },
  },
  {
    id: 'doc-06',
    name: 'Trust_Registration_Deed_Charity_Comm.pdf',
    documentType: 'Public Trust & Society Registration Certificate',
    uploadDate: '2026-10-18',
    status: 'VERIFIED',
    fileSize: '1.9 MB',
    pagesCount: 8,
    issuingAuthority: 'Office of the Charity Commissioner, Pune Division',
    referenceNumber: 'Reg. No. MH/2004/00188/P',
    validityWindow: 'Permanent Registered Public Trust',
    extractedFields: [
      { label: 'Sponsoring Trust Name', value: 'Meridian Educational & Charitable Trust' },
      { label: 'Registration Date', value: '14-March-2004' },
      { label: 'Charity Commissioner Record', value: 'Simulated e-Trust API Match (Active & In Good Standing)' },
      { label: 'Trustee PAN Authenticated', value: 'AAATM4120E (Matched simulated CBDT schema)' },
    ],
    validationChecks: [
      { id: 'vc-12', name: 'Trust Registration Verification', status: 'PASS', detail: 'Verified against simulated Charity Commissioner public trust register' },
      { id: 'vc-13', name: 'Educational Purpose Clause', status: 'PASS', detail: 'Trust constitution explicitly authorizes establishing and administering technical institutions' },
    ],
    associatedFindingIds: ['fnd-05'],
    samplePreviewText: {
      header: 'GOVERNMENT OF MAHARASHTRA · CHARITY COMMISSIONER\nCERTIFICATE OF REGISTRATION UNDER BOMBAY PUBLIC TRUSTS ACT, 1950',
      bodyParagraphs: [
        'REGISTRATION NO: MH/2004/00188/P                                             DATED: 14-MARCH-2004',
        'It is hereby certified that the Public Trust named "MERIDIAN EDUCATIONAL & CHARITABLE TRUST" has this day been duly registered in the Public Trusts Registration Office, Pune Division, under entry No. E-1422.',
        'Primary Objectives: Advancement of technical education, research in engineering, establishment of colleges and polytechnics.',
      ],
      signatures: ['Assistant Charity Commissioner, Pune Division'],
      stamps: ['[OFFICIAL SEAL: Charity Commissioner Maharashtra]'],
    },
  },
];

export const PRIMARY_DEMO_CASE_FINDINGS: Finding[] = [
  {
    id: 'fnd-01',
    title: 'Simulated Expired Affiliation Certificate',
    description:
      'Affiliation document from State Technical University expired on 30-June-2025. Mandatory valid renewal for Academic Year 2026-2027 is missing from the record.',
    category: 'Affiliation & Approvals',
    severity: 'HIGH',
    type: 'EXPIRED_AFFILIATION',
    status: 'FLAGGED',
    clauseRef: 'APH 2024–27 Clause 2.4.1 (Mandatory Affiliation)',
    detectedAt: '2026-10-20 09:14',
    simulatedNote: 'Synthetic rule engine flagged certificate validity date <= current evaluation cycle date.',
    reviewState: 'UNREVIEWED',
    observedValue: 'Order MSTU/AFFIL/ENGG/2024/098 expired 30-June-2025',
    expectedValue: 'Valid Affiliation Order covering Academic Year 2026–2027',
    explanation: 'Technical colleges cannot be recommended for Extension of Approval without active university affiliation for the prospective academic cycle.',
    recommendedAction: 'Issue formal deficiency query requesting uploaded renewal endorsement or University Syndicate inspection resolution.',
    relatedDocumentId: 'doc-01',
    riskWeight: 25,
  },
  {
    id: 'fnd-02',
    title: 'Missing Mandatory Fire Safety Certificate',
    description:
      'Mandatory Form 4B (Local Municipal Fire NOC / Structural Renewal Certificate) was not detected in the uploaded documentation package.',
    category: 'Mandatory Documentation',
    severity: 'CRITICAL',
    type: 'MISSING_DOCUMENT',
    status: 'FLAGGED',
    clauseRef: 'APH 2024–27 Clause 5.1.2 & Annexure 8 (Configured Demo Rule)',
    detectedAt: '2026-10-20 09:14',
    simulatedNote: 'Document classification model failed to locate required Form 4B stamp or keywords.',
    reviewState: 'UNREVIEWED',
    observedValue: 'Document absent from uploaded package',
    expectedValue: 'Form 4B with Chief Fire Officer municipal seal valid through June 2027',
    explanation: 'Fire and life safety compliance is a non-derogable requirement under Supreme Court educational safety directives.',
    recommendedAction: 'Withhold approval recommendation until current CFO renewal clearance is uploaded and authenticated.',
    relatedDocumentId: 'doc-02',
    riskWeight: 25,
  },
  {
    id: 'fnd-03',
    title: 'Discrepancy in Declared vs Affiliated Seat Intake',
    description:
      'Declared intake in Institutional Part-A Form specifies 180 seats for B.Tech Computer Science, but State University Affiliation schedule stipulates 120 seats (delta of 60 seats).',
    category: 'Academic & Seat Intake',
    severity: 'HIGH',
    type: 'INTAKE_MISMATCH',
    status: 'FLAGGED',
    clauseRef: 'APH 2024–27 Clause 3.2.4 (Seat Matrix Alignment)',
    detectedAt: '2026-10-20 09:15',
    simulatedNote: 'Entity extractor extracted two contradictory numerical values for CSE UG intake.',
    reviewState: 'UNREVIEWED',
    observedValue: 'Part-A: 180 Seats vs University Schedule: 120 Seats (Delta: +60)',
    expectedValue: 'Exact mathematical equality between declared intake and university approved quota',
    explanation: 'Applicant has applied for 180 seats without obtaining concurrent university academic senate concurrence.',
    recommendedAction: 'Restrict provisional approval to 120 seats unless university concurrence for additional division is furnished.',
    relatedDocumentId: 'doc-03',
    riskWeight: 18,
  },
  {
    id: 'fnd-04',
    title: 'Simulated Visual Anomaly on Land Conversion Deed',
    description:
      'Automated document forensics flagged anomalous compression noise and localized font variation on page 3 of the Tahsildar Land Conversion Order.',
    category: 'Visual & Forensic Analysis',
    severity: 'HIGH',
    type: 'VISUAL_ANOMALY',
    status: 'REQUIRES_MANUAL_INSPECTION',
    clauseRef: 'Document Authenticity & Integrity Protocol',
    detectedAt: '2026-10-20 09:16',
    simulatedNote: 'Flagged for human visual scrutiny; synthetic visual tamper detector indicated 0.82 anomaly score.',
    reviewState: 'UNREVIEWED',
    observedValue: 'Localized compression artifact & baseline displacement on Page 3 seal',
    expectedValue: 'Clean, uniform document raster without localized tampering artifacts',
    explanation: 'Synthetic heuristic flagged possible digital splicing or replacement of endorsement stamp. Human scrutiny required.',
    recommendedAction: 'Conduct side-by-side visual inspection of Tahsildar endorsement; if unresolved, request original revenue record inspection.',
    relatedDocumentId: 'doc-05',
    riskWeight: 10,
  },
  {
    id: 'fnd-05',
    title: 'Trust Registration Authenticated (Simulated Match)',
    description:
      'Sponsoring Society & Trust Registration No. MH/2004/00188 successfully verified against simulated Charity Commissioner registry record.',
    category: 'State Registry Cross-Check',
    severity: 'INFO',
    type: 'REGISTRY_MATCH',
    status: 'VERIFIED',
    clauseRef: 'APH 2024–27 Clause 1.3 (Trust/Society Registration)',
    detectedAt: '2026-10-20 09:17',
    simulatedNote: 'Simulated mock registry call matched Trust Name, Registration Date, and Trustee PAN.',
    reviewState: 'REVIEWED',
    observedValue: 'e-Trust Record: MH/2004/00188 Status Active',
    expectedValue: 'Active registered non-profit trust/society',
    explanation: 'Society legal entity conforms to AICTE sponsoring body eligibility norms.',
    recommendedAction: 'No action needed; mark verified.',
    relatedDocumentId: 'doc-06',
    riskWeight: 0,
  },
  {
    id: 'fnd-06',
    title: 'National Academic Depository (NAD) Verification Standby',
    description:
      'Faculty qualification credential verification query was bypassed because the external live NAD verification gateway is unavailable in offline demo mode.',
    category: 'External Source Integration',
    severity: 'MEDIUM',
    type: 'SOURCE_UNAVAILABLE',
    status: 'UNAVAILABLE_OFFLINE',
    clauseRef: 'Faculty Credential Verification Guideline',
    detectedAt: '2026-10-20 09:17',
    simulatedNote: 'Graceful fallback: Marked for post-demo automated sync when upstream gateway is connected.',
    reviewState: 'UNREVIEWED',
    observedValue: 'External NAD Gateway: OFFLINE_STANDBY',
    expectedValue: 'Automated live diploma & degree verification query',
    explanation: 'In live operations, faculty degrees are verified via Digilocker/NAD. In synthetic mode, this check is gracefully queued.',
    recommendedAction: 'Perform secondary manual verification of faculty appointment orders and salary EPF slips.',
    riskWeight: 0,
  },
];

export const PRIMARY_DEMO_COMPLIANCE_CHECKLIST: ComplianceChecklistItem[] = [
  {
    id: 'chk-01',
    category: 'Mandatory Documents',
    requirement: 'Form 4B: Municipal Fire Brigade Safety & Structural Occupancy Clearance',
    evidenceReviewed: 'Mandatory Form 4B fire safety upload',
    result: 'FAIL',
    explanation: 'Document file missing from submitted dossier payload.',
    recommendedAction: 'Issue formal deficit letter; cannot grant approval without municipal fire clearance.',
    reviewState: 'DEFICIENCY_FLAGGED',
    linkedDocumentId: 'doc-02',
    linkedFindingId: 'fnd-02',
    handbookClauseRef: 'APH 2024–27 Clause 5.1.2',
  },
  {
    id: 'chk-02',
    category: 'Document Validity',
    requirement: 'Valid University Affiliation covering Academic Year 2026–27',
    evidenceReviewed: 'Order MSTU/AFFIL/ENGG/2024/098',
    result: 'FAIL',
    explanation: 'Affiliation order expired on 30-June-2025; renewal for AY 2026–27 not provided.',
    recommendedAction: 'Require college to submit updated affiliation order or university provisional continuation letter.',
    reviewState: 'DEFICIENCY_FLAGGED',
    linkedDocumentId: 'doc-01',
    linkedFindingId: 'fnd-01',
    handbookClauseRef: 'APH 2024–27 Clause 2.4.1',
  },
  {
    id: 'chk-03',
    category: 'Cross-Document Consistency',
    requirement: 'Congruence between Applied Intake and University Sanctioned Matrix',
    evidenceReviewed: 'Part-A Form vs University Seat Schedule',
    result: 'FAIL',
    explanation: 'Discrepancy: Applied for 180 CSE seats vs 120 seats authorized by State University.',
    recommendedAction: 'Cap provisional intake at 120 seats pending university concurrence.',
    reviewState: 'DEFICIENCY_FLAGGED',
    linkedDocumentId: 'doc-03',
    linkedFindingId: 'fnd-03',
    handbookClauseRef: 'APH 2024–27 Clause 3.2.4',
  },
  {
    id: 'chk-04',
    category: 'Document Validity',
    requirement: 'Land Conversion Order Tamper & Forensics Integrity',
    evidenceReviewed: 'Tahsildar Order REV/LND/CONV/2012/142-A',
    result: 'WARNING',
    explanation: 'Visual anomaly detected on Page 3 endorsement seal; needs officer visual inspection.',
    recommendedAction: 'Scrutiny Officer to review Page 3 high-resolution raster or inspect revenue stamp.',
    reviewState: 'PENDING',
    linkedDocumentId: 'doc-05',
    linkedFindingId: 'fnd-04',
    handbookClauseRef: 'Document Authenticity Protocol',
  },
  {
    id: 'chk-05',
    category: 'Institution Information',
    requirement: 'Sponsoring Trust Legal Existence & Charity Registration',
    evidenceReviewed: 'Registration Certificate MH/2004/00188/P',
    result: 'PASS',
    explanation: 'Trust is active and registered with Charity Commissioner Pune Division since 2004.',
    recommendedAction: 'Accept as compliant.',
    reviewState: 'ACCEPTED',
    linkedDocumentId: 'doc-06',
    linkedFindingId: 'fnd-05',
    handbookClauseRef: 'APH 2024–27 Clause 1.3',
  },
  {
    id: 'chk-06',
    category: 'Programme & Intake Declarations',
    requirement: 'Faculty-to-Student Cadre Ratio (1:20 standard for UG Engineering)',
    evidenceReviewed: 'Part-A Faculty Roster (18 full-time teachers for 120 intake)',
    result: 'PASS',
    explanation: 'Cadre ratio 1:20 conforms to existing 120 approved intake requirements.',
    recommendedAction: 'Accept for existing 120 seats.',
    reviewState: 'ACCEPTED',
    linkedDocumentId: 'doc-03',
    handbookClauseRef: 'APH 2024–27 Clause 7.1',
  },
  {
    id: 'chk-07',
    category: 'Infrastructure Evidence',
    requirement: 'Mandatory Contiguous Land Extent (Min 2.5 Acres in Urban Jurisdiction)',
    evidenceReviewed: 'Survey No. 142/A & 143/B Title Deeds',
    result: 'PASS',
    explanation: 'Total contiguous campus area is 3.25 Acres, satisfying the 2.5 Acre norm.',
    recommendedAction: 'Accept as compliant.',
    reviewState: 'ACCEPTED',
    linkedDocumentId: 'doc-05',
    handbookClauseRef: 'APH 2024–27 Clause 4.1.1',
  },
  {
    id: 'chk-08',
    category: 'Institution Information',
    requirement: 'Faculty Qualification External Registry Synchronization',
    evidenceReviewed: 'Simulated NAD/Digilocker Gateway',
    result: 'NOT_CHECKED',
    explanation: 'External NAD gateway in offline mock mode during demo.',
    recommendedAction: 'Secondary review of manual faculty appointment orders.',
    reviewState: 'PENDING',
    handbookClauseRef: 'APH 2024–27 Clause 7.4',
  },
];

export const PRIMARY_DEMO_RISK_BREAKDOWN: RiskScoreComponent[] = [
  {
    factor: 'Missing Mandatory Form 4B (Fire Safety NOC)',
    weight: 25,
    condition: 'Absence of mandatory life safety municipal clearance',
    triggered: true,
    findingId: 'fnd-02',
  },
  {
    factor: 'Expired University Affiliation Certificate',
    weight: 25,
    condition: 'Affiliation expired on 30-June-2025; AY 2026-27 unverified',
    triggered: true,
    findingId: 'fnd-01',
  },
  {
    factor: 'Seat Intake Mismatch (+60 Unapproved Seats)',
    weight: 18,
    condition: 'Part-A intake exceeds University sanctioned schedule',
    triggered: true,
    findingId: 'fnd-03',
  },
  {
    factor: 'Unresolved Visual Anomaly on Land Conversion Deed',
    weight: 10,
    condition: 'Forensic raster artifact on Page 3 endorsement seal',
    triggered: true,
    findingId: 'fnd-04',
  },
];

export const PRIMARY_DEMO_CASE: ApplicationRecord = {
  id: 'demo-eoa-0142',
  applicationId: 'DEMO-EoA-2026-0142',
  institutionName: 'Meridian Institute of Technology',
  applicationCategory: 'Extension of Approval',
  state: 'Maharashtra (WRO)',
  region: 'Western Region',
  programType: 'Engineering & Technology (UG/PG)',
  submissionDate: '2026-10-19',
  status: 'PENDING_REVIEW',
  riskScore: 78, // 25 + 25 + 18 + 10 = 78
  priority: 'HIGH',
  documentsCount: 6,
  documentsReviewed: 5,
  issueCount: 4,
  lastUpdated: '15 mins ago',
  reviewerNotes:
    'Primary demonstration case for SIH26261 scrutiny workflow. Configured with expired affiliation, missing Form 4B, intake mismatch, and visual inspection flag.',
  findings: PRIMARY_DEMO_CASE_FINDINGS,
  documents: PRIMARY_DEMO_CASE_DOCUMENTS,
  complianceChecklist: PRIMARY_DEMO_COMPLIANCE_CHECKLIST,
  riskBreakdown: PRIMARY_DEMO_RISK_BREAKDOWN,
  lastValidatedAt: '2026-10-20 09:17',
  validationState: 'COMPLETED',
};

/**
 * 11 TOTAL FICTIONAL RECORDS
 */
export const SYNTHETIC_APPLICATIONS: ApplicationRecord[] = [
  PRIMARY_DEMO_CASE,
  {
    id: 'app-nti-0089',
    applicationId: 'AICTE-NTI-2026-0089',
    institutionName: 'Aryavart Institute of Engineering',
    applicationCategory: 'New Technical Institution',
    state: 'Uttar Pradesh (NRO)',
    region: 'Northern Region',
    programType: 'Engineering & Technology',
    submissionDate: '2026-10-18',
    status: 'VALIDATION_EXCEPTION',
    riskScore: 85,
    priority: 'HIGH',
    documentsCount: 8,
    documentsReviewed: 8,
    issueCount: 3,
    lastUpdated: '1 hour ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [
      { factor: 'Land Contiguity Violation (Divided parcels)', weight: 45, condition: 'Parcels divided by public highway', triggered: true },
      { factor: 'Principal Qualification Shortfall', weight: 40, condition: '11 years exp vs mandated 13 years', triggered: true },
    ],
    findings: [
      {
        id: 'fnd-101',
        title: 'Land Contiguity Non-Compliance',
        description: 'Mandatory 2.5 acres non-contiguous: Plot A (1.6 acres) separated from Plot B (0.9 acres) by public road.',
        category: 'Land & Infrastructure',
        severity: 'CRITICAL',
        type: 'NORMS_VIOLATION',
        status: 'FLAGGED',
        clauseRef: 'APH 2024–27 Clause 4.1.1',
        reviewState: 'UNREVIEWED',
        riskWeight: 45,
      },
      {
        id: 'fnd-102',
        title: 'Principal Qualification Experience Shortfall',
        description: 'Designated Principal has 11 years post-Ph.D. teaching experience against mandated 13 years.',
        category: 'Faculty & Cadre',
        severity: 'HIGH',
        type: 'NORMS_VIOLATION',
        status: 'FLAGGED',
        clauseRef: 'AICTE Pay Scales & Qualifications Norms',
        reviewState: 'UNREVIEWED',
        riskWeight: 40,
      },
    ],
  },
  {
    id: 'app-eoa-0215',
    applicationId: 'AICTE-EoA-2026-0215',
    institutionName: 'Kaveri Polytechnic College',
    applicationCategory: 'Extension of Approval',
    state: 'Tamil Nadu (SRO)',
    region: 'Southern Region',
    programType: 'Diploma Engineering',
    submissionDate: '2026-10-17',
    status: 'VERIFIED',
    riskScore: 18,
    priority: 'LOW',
    documentsCount: 6,
    documentsReviewed: 6,
    issueCount: 0,
    lastUpdated: '3 hours ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [],
    findings: [
      {
        id: 'fnd-201',
        title: 'All Mandatory Documents Verified',
        description: 'Affiliation, occupancy certificate, faculty cadre, and equipment registers fully compliant.',
        category: 'Mandatory Documentation',
        severity: 'INFO',
        type: 'REGISTRY_MATCH',
        status: 'VERIFIED',
        reviewState: 'REVIEWED',
        riskWeight: 0,
      },
    ],
  },
  {
    id: 'app-inc-0412',
    applicationId: 'AICTE-INC-2026-0412',
    institutionName: 'Vindhya College of Pharmacy',
    applicationCategory: 'Increase in Intake',
    state: 'Madhya Pradesh (CRO)',
    region: 'Central Region',
    programType: 'Pharmacy (B.Pharm)',
    submissionDate: '2026-10-16',
    status: 'UNDER_AI_REVIEW',
    riskScore: 45,
    priority: 'MEDIUM',
    documentsCount: 7,
    documentsReviewed: 5,
    issueCount: 1,
    lastUpdated: '5 hours ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [
      { factor: 'Machine Room Carpet Area Deficit', weight: 45, condition: '85 sq.m vs prescribed 100 sq.m', triggered: true },
    ],
    findings: [
      {
        id: 'fnd-301',
        title: 'Laboratory Carpet Area Audit Underway',
        description: 'Machine room carpet area 85 sq.m vs prescribed 100 sq.m under automated CAD drawing calculation.',
        category: 'Land & Infrastructure',
        severity: 'MEDIUM',
        type: 'NORMS_VIOLATION',
        status: 'FLAGGED',
        clauseRef: 'APH 2024–27 Clause 6.4',
        reviewState: 'UNREVIEWED',
        riskWeight: 45,
      },
    ],
  },
  {
    id: 'app-crs-0504',
    applicationId: 'AICTE-CRS-2026-0504',
    institutionName: 'Saraswati School of Architecture',
    applicationCategory: 'Introduction of New Course',
    state: 'Gujarat (WRO)',
    region: 'Western Region',
    programType: 'Architecture & Planning',
    submissionDate: '2026-10-15',
    status: 'VALIDATION_EXCEPTION',
    riskScore: 72,
    priority: 'HIGH',
    documentsCount: 6,
    documentsReviewed: 6,
    issueCount: 2,
    lastUpdated: '8 hours ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [
      { factor: 'Statutory COA Concurrence Omitted', weight: 42, condition: 'Missing COA approval for M.Arch', triggered: true },
      { factor: 'Studio Area Deficit', weight: 30, condition: 'Design studio deficient by 42 sq.m', triggered: true },
    ],
    findings: [
      {
        id: 'fnd-401',
        title: 'Council of Architecture (COA) Concurrence Pending',
        description: 'Mandatory statutory concurrence certificate from COA for proposed M.Arch program not uploaded.',
        category: 'Affiliation & Approvals',
        severity: 'HIGH',
        type: 'MISSING_DOCUMENT',
        status: 'FLAGGED',
        clauseRef: 'APH 2024–27 Clause 2.8',
        reviewState: 'UNREVIEWED',
        riskWeight: 42,
      },
      {
        id: 'fnd-402',
        title: 'Studio Area Norm Discrepancy',
        description: 'Design studio space deficient by 42 sq.m for planned intake of 40 students.',
        category: 'Land & Infrastructure',
        severity: 'HIGH',
        type: 'NORMS_VIOLATION',
        status: 'FLAGGED',
        clauseRef: 'APH 2024–27 Clause 6.1',
        reviewState: 'UNREVIEWED',
        riskWeight: 30,
      },
    ],
  },
  {
    id: 'app-eoa-0631',
    applicationId: 'AICTE-EoA-2026-0631',
    institutionName: 'Deccan Institute of Advanced Studies',
    applicationCategory: 'Extension of Approval',
    state: 'Karnataka (SRO)',
    region: 'South-Western Region',
    programType: 'Management (MBA)',
    submissionDate: '2026-10-14',
    status: 'APPROVAL_RECOMMENDED',
    riskScore: 12,
    priority: 'LOW',
    documentsCount: 5,
    documentsReviewed: 5,
    issueCount: 0,
    lastUpdated: '1 day ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [],
    findings: [],
  },
  {
    id: 'app-eoa-0774',
    applicationId: 'AICTE-EoA-2026-0774',
    institutionName: 'Himalayan Technical Academy',
    applicationCategory: 'Extension of Approval',
    state: 'Uttarakhand (NRO)',
    region: 'Northern Region',
    programType: 'Engineering & Technology',
    submissionDate: '2026-10-13',
    status: 'PENDING_REVIEW',
    riskScore: 62,
    priority: 'MEDIUM',
    documentsCount: 6,
    documentsReviewed: 6,
    issueCount: 2,
    lastUpdated: '1 day ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [
      { factor: 'Chairman Affidavit Signature OCSP Ambiguity', weight: 32, condition: 'Digital timestamp lacks OCSP', triggered: true },
      { factor: 'Faculty Cadre Imbalance (Mech Engg)', weight: 30, condition: '1:18 vs prescribed 1:12', triggered: true },
    ],
    findings: [
      {
        id: 'fnd-501',
        title: 'Digital Signature Validity Ambiguity',
        description: 'Signer certificate timestamp on Chairman affidavit lacks verifiable OCSP response.',
        category: 'Visual & Forensic Analysis',
        severity: 'MEDIUM',
        type: 'VISUAL_ANOMALY',
        status: 'REQUIRES_MANUAL_INSPECTION',
        reviewState: 'UNREVIEWED',
        riskWeight: 32,
      },
      {
        id: 'fnd-502',
        title: 'Faculty Cadre Ratio Imbalance',
        description: 'Assistant Professor to Professor ratio in Mechanical Engineering is 1:18 vs prescribed 1:12.',
        category: 'Faculty & Cadre',
        severity: 'MEDIUM',
        type: 'NORMS_VIOLATION',
        status: 'FLAGGED',
        reviewState: 'UNREVIEWED',
        riskWeight: 30,
      },
    ],
  },
  {
    id: 'app-nti-0890',
    applicationId: 'AICTE-NTI-2026-0890',
    institutionName: 'Pacific College of Artificial Intelligence',
    applicationCategory: 'New Technical Institution',
    state: 'Telangana (SCRO)',
    region: 'South-Central Region',
    programType: 'Computer Applications (MCA/Data Science)',
    submissionDate: '2026-10-12',
    status: 'UNDER_AI_REVIEW',
    riskScore: 38,
    priority: 'MEDIUM',
    documentsCount: 7,
    documentsReviewed: 5,
    issueCount: 1,
    lastUpdated: '2 days ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [
      { factor: 'Lease Line Bandwidth SLA Pending', weight: 38, condition: '500 Mbps SLA awaiting confirmation', triggered: true },
    ],
    findings: [
      {
        id: 'fnd-601',
        title: 'Bandwidth & Lease Line Proof Under Check',
        description: '500 Mbps dedicated leased line service-level agreement bill verification awaiting ISP cross-check.',
        category: 'Mandatory Documentation',
        severity: 'LOW',
        type: 'SOURCE_UNAVAILABLE',
        status: 'FLAGGED',
        reviewState: 'UNREVIEWED',
        riskWeight: 38,
      },
    ],
  },
  {
    id: 'app-inc-0922',
    applicationId: 'AICTE-INC-2026-0922',
    institutionName: 'Ganga Valley Institute of Management',
    applicationCategory: 'Increase in Intake',
    state: 'Bihar (ERO)',
    region: 'Eastern Region',
    programType: 'Management (PGDM)',
    submissionDate: '2026-10-11',
    status: 'APPROVAL_RECOMMENDED',
    riskScore: 15,
    priority: 'LOW',
    documentsCount: 5,
    documentsReviewed: 5,
    issueCount: 0,
    lastUpdated: '2 days ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [],
    findings: [],
  },
  {
    id: 'app-eoa-1045',
    applicationId: 'AICTE-EoA-2026-1045',
    institutionName: 'Western Ghats College of Technology',
    applicationCategory: 'Extension of Approval',
    state: 'Kerala (SWRO)',
    region: 'South-Western Region',
    programType: 'Engineering & Technology',
    submissionDate: '2026-10-10',
    status: 'VALIDATION_EXCEPTION',
    riskScore: 81,
    priority: 'HIGH',
    documentsCount: 7,
    documentsReviewed: 7,
    issueCount: 2,
    lastUpdated: '3 days ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [
      { factor: 'Barrier-Free Accessibility Certificate Missing', weight: 45, condition: 'Divyangjan accessibility omitted', triggered: true },
      { factor: 'Faculty EPF Deduction Receipt Deficit', weight: 36, condition: 'Q2 2026 EPF receipts missing for 8 faculty', triggered: true },
    ],
    findings: [
      {
        id: 'fnd-701',
        title: 'Barrier-Free Environment & Ramp Certificate Missing',
        description: 'Divyangjan accessibility compliance certificate (Annexure 12) omitted from mandatory uploads.',
        category: 'Mandatory Documentation',
        severity: 'HIGH',
        type: 'MISSING_DOCUMENT',
        status: 'FLAGGED',
        reviewState: 'UNREVIEWED',
        riskWeight: 45,
      },
      {
        id: 'fnd-702',
        title: 'Faculty PF Deduction Statement Incomplete',
        description: 'EPF payment electronic receipt for 8 faculty members missing for Q2 2026.',
        category: 'Faculty & Cadre',
        severity: 'HIGH',
        type: 'NORMS_VIOLATION',
        status: 'FLAGGED',
        reviewState: 'UNREVIEWED',
        riskWeight: 36,
      },
    ],
  },
  {
    id: 'app-cls-1102',
    applicationId: 'AICTE-CLS-2026-1102',
    institutionName: 'Nalanda Applied Science Institute',
    applicationCategory: 'Closure of Program',
    state: 'Odisha (ERO)',
    region: 'Eastern Region',
    programType: 'Applied Arts & Crafts',
    submissionDate: '2026-10-09',
    status: 'VERIFIED',
    riskScore: 24,
    priority: 'LOW',
    documentsCount: 4,
    documentsReviewed: 4,
    issueCount: 0,
    lastUpdated: '4 days ago',
    documents: [],
    complianceChecklist: [],
    riskBreakdown: [],
    findings: [
      {
        id: 'fnd-801',
        title: 'Student Migration Undertaking Verified',
        description: 'Affidavit affirming zero pending enrolled students verified against university registrar certificate.',
        category: 'Affiliation & Approvals',
        severity: 'INFO',
        type: 'REGISTRY_MATCH',
        status: 'VERIFIED',
        reviewState: 'REVIEWED',
        riskWeight: 0,
      },
    ],
  },
];

/**
 * RECENT ACTIVITY TIMELINE
 */
export const SYNTHETIC_ACTIVITIES: ActivityTimelineItem[] = [
  {
    id: 'act-01',
    timestamp: '15 mins ago',
    applicationId: 'DEMO-EoA-2026-0142',
    institutionName: 'Meridian Institute of Technology',
    action: 'Simulated visual tamper detector flagged Land Deed page 3 for manual inspection.',
    type: 'DEFICIT_FLAG',
    actor: 'Forensic-OCR-Engine',
    severity: 'HIGH',
  },
  {
    id: 'act-02',
    timestamp: '18 mins ago',
    applicationId: 'DEMO-EoA-2026-0142',
    institutionName: 'Meridian Institute of Technology',
    action: 'Seat matrix delta flagged: 180 declared CSE vs 120 affiliated seats.',
    type: 'DEFICIT_FLAG',
    actor: 'Norms-Engine',
    severity: 'HIGH',
  },
  {
    id: 'act-03',
    timestamp: '1 hour ago',
    applicationId: 'AICTE-NTI-2026-0089',
    institutionName: 'Aryavart Institute of Engineering',
    action: 'Land Contiguity failure recorded: Parcels divided by public highway.',
    type: 'DEFICIT_FLAG',
    actor: 'Geospatial-Verifier',
    severity: 'HIGH',
  },
  {
    id: 'act-04',
    timestamp: '3 hours ago',
    applicationId: 'AICTE-EoA-2026-0215',
    institutionName: 'Kaveri Polytechnic College',
    action: 'Automated document checklist validated (6/6 documents passed).',
    type: 'VERIFICATION',
    actor: 'Compliance-Rulebase-v3',
    severity: 'LOW',
  },
  {
    id: 'act-05',
    timestamp: '5 hours ago',
    applicationId: 'AICTE-INC-2026-0412',
    institutionName: 'Vindhya College of Pharmacy',
    action: 'AI extraction completed for 5/7 technical drawings and lab manifests.',
    type: 'DOCUMENT_UPLOAD',
    actor: 'Batch-Parser-Queue',
    severity: 'INFO',
  },
  {
    id: 'act-06',
    timestamp: '1 day ago',
    applicationId: 'AICTE-EoA-2026-0631',
    institutionName: 'Deccan Institute of Advanced Studies',
    action: 'Scrutiny Committee approved clean verification report for MBA program.',
    type: 'STATUS_CHANGE',
    actor: 'Officer #42 (Manual Signoff)',
    severity: 'LOW',
  },
];

/**
 * Summary metrics helper - works with any provided applications array
 */
export function getSummaryMetrics(applications: ApplicationRecord[] = SYNTHETIC_APPLICATIONS) {
  const total = applications.length;
  const pendingReview = applications.filter((a) => a.status === 'PENDING_REVIEW').length;
  const validationExceptions = applications.filter((a) => a.status === 'VALIDATION_EXCEPTION').length;
  const highPriority = applications.filter((a) => a.priority === 'HIGH').length;
  const documentsReviewed = applications.reduce((acc, a) => acc + a.documentsReviewed, 0);
  const totalDocuments = applications.reduce((acc, a) => acc + a.documentsCount, 0);

  return {
    totalApplications: total,
    pendingReview,
    validationExceptions,
    highPriorityCases: highPriority,
    documentsReviewed,
    totalDocuments,
    reviewProgressRate: totalDocuments > 0 ? Math.round((documentsReviewed / totalDocuments) * 100) : 100,
  };
}

/**
 * Status distribution for chart
 */
export function getStatusDistribution(applications: ApplicationRecord[] = SYNTHETIC_APPLICATIONS) {
  const counts: Record<string, number> = {
    'Pending Review': 0,
    'Validation Exceptions': 0,
    'Under AI Review': 0,
    'Verified': 0,
    'Approval Recommended': 0,
  };

  applications.forEach((app) => {
    switch (app.status) {
      case 'PENDING_REVIEW':
        counts['Pending Review']++;
        break;
      case 'VALIDATION_EXCEPTION':
        counts['Validation Exceptions']++;
        break;
      case 'UNDER_AI_REVIEW':
        counts['Under AI Review']++;
        break;
      case 'VERIFIED':
        counts['Verified']++;
        break;
      case 'APPROVAL_RECOMMENDED':
        counts['Approval Recommended']++;
        break;
    }
  });

  return [
    { name: 'Pending Review', value: counts['Pending Review'], color: '#F59E0B' },
    { name: 'Exceptions', value: counts['Validation Exceptions'], color: '#EF4444' },
    { name: 'Under AI Review', value: counts['Under AI Review'], color: '#3B82F6' },
    { name: 'Verified', value: counts['Verified'], color: '#10B981' },
    { name: 'Recommended', value: counts['Approval Recommended'], color: '#6366F1' },
  ];
}

/**
 * 7-Day Application Intake & Automated Validation Trend
 */
export function getApplicationTrendData() {
  return [
    { day: 'Oct 14', received: 1, validated: 1 },
    { day: 'Oct 15', received: 1, validated: 0 },
    { day: 'Oct 16', received: 2, validated: 1 },
    { day: 'Oct 17', received: 1, validated: 1 },
    { day: 'Oct 18', received: 2, validated: 1 },
    { day: 'Oct 19', received: 3, validated: 2 },
    { day: 'Oct 20', received: 1, validated: 1 },
  ];
}

/**
 * Issue Category Summary
 */
export function getIssueCategorySummary(applications: ApplicationRecord[] = SYNTHETIC_APPLICATIONS): IssueCategorySummary[] {
  const allFindings: Finding[] = [];
  applications.forEach((app) => {
    allFindings.push(...app.findings);
  });

  const categoryMap = new Map<string, { total: number; high: number }>();

  allFindings.forEach((finding) => {
    const entry = categoryMap.get(finding.category) || { total: 0, high: 0 };
    entry.total += 1;
    if (finding.severity === 'CRITICAL' || finding.severity === 'HIGH') {
      entry.high += 1;
    }
    categoryMap.set(finding.category, entry);
  });

  const totalFindings = allFindings.length || 1;

  const result: IssueCategorySummary[] = [];
  categoryMap.forEach((val, cat) => {
    result.push({
      category: cat,
      count: val.total,
      highSeverityCount: val.high,
      percentage: Math.round((val.total / totalFindings) * 100),
    });
  });

  return result.sort((a, b) => b.count - a.count);
}
