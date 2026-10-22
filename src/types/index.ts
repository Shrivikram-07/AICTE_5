export type ApplicationStatus =
  | 'PENDING_REVIEW'
  | 'UNDER_AI_REVIEW'
  | 'VALIDATION_EXCEPTION'
  | 'VERIFIED'
  | 'APPROVAL_RECOMMENDED'
  | 'REJECTED';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ApplicationCategory =
  | 'Extension of Approval'
  | 'New Technical Institution'
  | 'Increase in Intake'
  | 'Introduction of New Course'
  | 'Closure of Program'
  | 'Change of Site';

export type FindingType =
  | 'EXPIRED_AFFILIATION'
  | 'MISSING_DOCUMENT'
  | 'INTAKE_MISMATCH'
  | 'VISUAL_ANOMALY'
  | 'REGISTRY_MATCH'
  | 'SOURCE_UNAVAILABLE'
  | 'NORMS_VIOLATION'
  | 'OTHER';

export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type FindingReviewState = 'UNREVIEWED' | 'REVIEWED' | 'RESOLVED' | 'ESCALATED';

export interface Finding {
  id: string;
  title: string;
  description: string;
  category:
    | 'Affiliation & Approvals'
    | 'Mandatory Documentation'
    | 'Academic & Seat Intake'
    | 'Visual & Forensic Analysis'
    | 'State Registry Cross-Check'
    | 'External Source Integration'
    | 'Land & Infrastructure'
    | 'Faculty & Cadre';
  severity: FindingSeverity;
  type: FindingType;
  status: 'FLAGGED' | 'RESOLVED' | 'VERIFIED' | 'REQUIRES_MANUAL_INSPECTION' | 'UNAVAILABLE_OFFLINE';
  clauseRef?: string;
  detectedAt?: string;
  simulatedNote?: string;
  // Enhanced Evidence-Linked Finding Attributes
  reviewState: FindingReviewState;
  observedValue?: string;
  expectedValue?: string;
  explanation?: string;
  recommendedAction?: string;
  relatedDocumentId?: string;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  riskWeight?: number; // Contribution to 0-100 risk score
}

export type DocumentStatus =
  | 'VERIFIED'
  | 'FLAGGED'
  | 'MISSING'
  | 'MANUAL_INSPECTION'
  | 'OFFLINE_STANDBY';

export interface ExtractedField {
  label: string;
  value: string;
  confidence?: number;
  isFlagged?: boolean;
  highlightNote?: string;
}

export interface ValidationCheckItem {
  id: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'SKIPPED';
  detail: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  documentType: string;
  uploadDate: string;
  status: DocumentStatus;
  fileSize?: string;
  pagesCount?: number;
  issuingAuthority?: string;
  referenceNumber?: string;
  validityWindow?: string;
  extractedFields: ExtractedField[];
  validationChecks: ValidationCheckItem[];
  associatedFindingIds: string[];
  missingDocumentDetails?: {
    requiredForm: string;
    handbookClause: string;
    instructions: string;
    consequences: string;
  };
  samplePreviewText?: {
    header: string;
    bodyParagraphs: string[];
    signatures: string[];
    stamps: string[];
    anomalyCoordinates?: string;
  };
  isUploadedRealDoc?: boolean;
  fileHash?: string;
  mimeType?: string;
  ocrEngineUsed?: string;
  rawTextExcerpt?: string;
  fullRawText?: string;
  downloadUrl?: string;
  isScanned?: boolean;
  hasVisualAnomaly?: boolean;
  anomalyDetails?: string;
}

export type ComplianceResult = 'PASS' | 'WARNING' | 'FAIL' | 'NOT_CHECKED';

export interface ComplianceChecklistItem {
  id: string;
  category:
    | 'Mandatory Documents'
    | 'Document Validity'
    | 'Cross-Document Consistency'
    | 'Institution Information'
    | 'Programme & Intake Declarations'
    | 'Infrastructure Evidence';
  requirement: string;
  evidenceReviewed: string;
  result: ComplianceResult;
  explanation: string;
  recommendedAction: string;
  reviewState: 'PENDING' | 'ACCEPTED' | 'DEFICIENCY_FLAGGED' | 'WAIVED';
  linkedDocumentId?: string;
  linkedFindingId?: string;
  handbookClauseRef: string;
}

export interface RiskScoreComponent {
  factor: string;
  weight: number;
  condition: string;
  triggered: boolean;
  findingId?: string;
}

export interface ApplicationRecord {
  id: string;
  applicationId: string;
  institutionName: string;
  applicationCategory: ApplicationCategory;
  state: string;
  region: string;
  programType: string;
  submissionDate: string;
  status: ApplicationStatus;
  riskScore: number; // 0 - 100
  priority: PriorityLevel;
  documentsCount: number;
  documentsReviewed: number;
  issueCount: number;
  lastUpdated: string;
  findings: Finding[];
  reviewerNotes?: string;
  // Phase 3 additions
  documents: ApplicationDocument[];
  complianceChecklist: ComplianceChecklistItem[];
  lastValidatedAt?: string;
  validationState?: 'NOT_RUN' | 'RUNNING' | 'COMPLETED';
  riskBreakdown: RiskScoreComponent[];
  officerDecision?: {
    recordedBy: string;
    recordedAt: string;
    decision: ApplicationStatus;
    notes: string;
  };
}

export interface ActivityTimelineItem {
  id: string;
  timestamp: string;
  applicationId: string;
  institutionName: string;
  action: string;
  type: 'VERIFICATION' | 'DEFICIT_FLAG' | 'DOCUMENT_UPLOAD' | 'STATUS_CHANGE' | 'MANUAL_OVERRIDE';
  actor: string;
  severity?: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  details?: string;
}

export interface IssueCategorySummary {
  category: string;
  count: number;
  highSeverityCount: number;
  percentage: number;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  category?: 'primary' | 'warning' | 'success' | 'danger' | 'info';
}

export type VerificationMethod =
  | 'CROSS_DOCUMENT_CONSISTENCY'
  | 'IDENTITY_MATCHING'
  | 'DOCUMENT_VALIDITY'
  | 'REGISTRY_MATCHING'
  | 'DIGITAL_SIGNATURE'
  | 'DUPLICATE_DETECTION'
  | 'VISUAL_ANOMALIES'
  | 'EXTERNAL_SOURCE';

export type VerificationResult =
  | 'MATCH_PASSED'
  | 'MISMATCH_FLAGGED'
  | 'ANOMALY_DETECTED'
  | 'SOURCE_UNAVAILABLE'
  | 'PENDING_MANUAL';

export interface VerificationRecord {
  id: string;
  applicationId: string;
  appDbId?: string;
  institutionName: string;
  documentName: string;
  documentId?: string;
  method: VerificationMethod;
  methodLabel: string;
  result: VerificationResult;
  timestamp: string;
  targetChecked: string;
  expectedValue: string;
  observedValue: string;
  explanation: string;
  recommendedAction: string;
  reviewStatus: 'PENDING_OFFICER_REVIEW' | 'INSPECTED' | 'VERIFIED' | 'EXCEPTION_RECORDED';
  findingId?: string;
  scoreContribution?: number;
}

export interface VerificationSummaryMetrics {
  totalChecks: number;
  successfulMatches: number;
  mismatchesRequiringReview: number;
  sourceChecksUnavailable: number;
  pendingManualVerification: number;
}
