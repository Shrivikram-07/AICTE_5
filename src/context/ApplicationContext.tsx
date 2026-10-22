import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ApplicationRecord,
  ActivityTimelineItem,
  FindingReviewState,
  ApplicationStatus,
  ApplicationDocument,
  Finding,
  RiskScoreComponent,
} from '@/types';
import { SYNTHETIC_APPLICATIONS, SYNTHETIC_ACTIVITIES } from '@/data/mockData';
import { DocumentUploadResponseDto } from '@/lib/api';

interface ValidationStage {
  stage: number;
  stageName: string;
  percent: number;
  detail: string;
}

interface ApplicationContextType {
  applications: ApplicationRecord[];
  activities: ActivityTimelineItem[];
  getApplication: (idOrAppNumber: string) => ApplicationRecord | undefined;
  updateFindingReview: (
    appId: string,
    findingId: string,
    updates: {
      reviewState: FindingReviewState;
      reviewNotes?: string;
      resolved?: boolean;
    }
  ) => void;
  runValidationSimulation: (appId: string) => Promise<void>;
  recordOfficerReview: (
    appId: string,
    decision: ApplicationStatus,
    notes: string
  ) => void;
  requestClarification: (
    appId: string,
    querySubject: string,
    queryDetails: string
  ) => void;
  addUploadedDocument: (
    appId: string,
    docUpload: DocumentUploadResponseDto
  ) => void;
  resetDemoData: () => void;
  isSimulatingValidation: boolean;
  validationProgress: ValidationStage | null;
}

const STORAGE_KEY_APPS = 'aicte_intelligence_applications_v3';
const STORAGE_KEY_ACTS = 'aicte_intelligence_activities_v3';

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  // Initialize applications from localStorage or fall back to SYNTHETIC_APPLICATIONS
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_APPS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse applications from localStorage', e);
    }
    return SYNTHETIC_APPLICATIONS;
  });

  // Initialize activities from localStorage or fall back to SYNTHETIC_ACTIVITIES
  const [activities, setActivities] = useState<ActivityTimelineItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse activities from localStorage', e);
    }
    return SYNTHETIC_ACTIVITIES;
  });

  const [isSimulatingValidation, setIsSimulatingValidation] = useState(false);
  const [validationProgress, setValidationProgress] = useState<ValidationStage | null>(null);

  // Sync state to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch (e) {
      console.warn('Failed to persist applications to localStorage', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTS, JSON.stringify(activities));
    } catch (e) {
      console.warn('Failed to persist activities to localStorage', e);
    }
  }, [activities]);

  const getApplication = useCallback(
    (idOrAppNumber: string): ApplicationRecord | undefined => {
      const query = idOrAppNumber.toLowerCase().trim();
      return applications.find(
        (a) =>
          a.id.toLowerCase() === query ||
          a.applicationId.toLowerCase() === query
      );
    },
    [applications]
  );

  /**
   * Finding Review Action:
   * Updates review state, review notes, and if resolved, recalculates score deterministically.
   * "Reviewed" marks inspection without deleting risk score.
   * "Resolved" deducts the documented risk weight and updates breakdown.
   */
  const updateFindingReview = useCallback(
    (
      appId: string,
      findingId: string,
      updates: {
        reviewState: FindingReviewState;
        reviewNotes?: string;
        resolved?: boolean;
      }
    ) => {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== appId && app.applicationId !== appId) return app;

          let scoreDelta = 0;
          const updatedFindings = app.findings.map((f) => {
            if (f.id !== findingId) return f;

            const isNowResolved = updates.resolved === true || updates.reviewState === 'RESOLVED';
            const wasResolved = f.reviewState === 'RESOLVED';

            // Calculate deterministic score change
            if (isNowResolved && !wasResolved) {
              scoreDelta -= f.riskWeight || 0;
            } else if (!isNowResolved && wasResolved) {
              scoreDelta += f.riskWeight || 0;
            }

            return {
              ...f,
              reviewState: updates.reviewState,
              status: isNowResolved ? ('RESOLVED' as const) : f.status === 'RESOLVED' ? ('FLAGGED' as const) : f.status,
              reviewNotes: updates.reviewNotes !== undefined ? updates.reviewNotes : f.reviewNotes,
              reviewedBy: 'Scrutiny Officer #42',
              reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          });

          // Recalculate new risk score (clamp 0-100)
          const newRiskScore = Math.max(0, Math.min(100, app.riskScore + scoreDelta));
          const newPriority = newRiskScore >= 70 ? 'HIGH' : newRiskScore >= 40 ? 'MEDIUM' : 'LOW';

          // Update risk breakdown
          const updatedBreakdown = (app.riskBreakdown || []).map((rb) => {
            if (rb.findingId === findingId) {
              return {
                ...rb,
                triggered: updates.reviewState !== 'RESOLVED',
              };
            }
            return rb;
          });

          // Recount active unresolved issues
          const activeIssues = updatedFindings.filter(
            (f) => f.status === 'FLAGGED' || f.status === 'REQUIRES_MANUAL_INSPECTION'
          ).length;

          return {
            ...app,
            findings: updatedFindings,
            riskScore: newRiskScore,
            priority: newPriority,
            issueCount: activeIssues,
            riskBreakdown: updatedBreakdown,
            lastUpdated: 'Just now',
          };
        })
      );

      // Add audit event
      const targetApp = getApplication(appId);
      const actionName =
        updates.reviewState === 'RESOLVED'
          ? `Resolved finding (${findingId}) with documented justification.`
          : updates.reviewState === 'REVIEWED'
          ? `Marked finding (${findingId}) as inspected & reviewed.`
          : `Updated review note on finding (${findingId}).`;

      const newAct: ActivityTimelineItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        applicationId: targetApp?.applicationId || appId,
        institutionName: targetApp?.institutionName || 'Institutional Application',
        action: actionName,
        type: 'MANUAL_OVERRIDE',
        actor: 'Scrutiny Officer #42',
        severity: updates.reviewState === 'RESOLVED' ? 'LOW' : 'INFO',
        details: updates.reviewNotes,
      };

      setActivities((prev) => [newAct, ...prev]);
    },
    [getApplication]
  );

  /**
   * Deterministic Frontend Simulation of AI Validation Engine
   */
  const runValidationSimulation = useCallback(
    async (appId: string) => {
      setIsSimulatingValidation(true);

      const stages: ValidationStage[] = [
        {
          stage: 1,
          stageName: 'Dossier Inventory & OCR Classification',
          percent: 25,
          detail: 'Scanning uploaded PDF packages, verifying page hashes, and categorizing statutory orders...',
        },
        {
          stage: 2,
          stageName: 'Cross-Document Field Entity Extraction',
          percent: 50,
          detail: 'Extracting declared intake from Part-A and cross-checking against University Seat Matrix schedule...',
        },
        {
          stage: 3,
          stageName: 'APH 2024–27 Norms Rulebase Evaluation',
          percent: 75,
          detail: 'Evaluating Clause 2.4.1 (Affiliation Expiry), Clause 5.1.2 (Fire NOC), and Cadre ratios...',
        },
        {
          stage: 4,
          stageName: 'Deficiency Scoring & Audit Manifest Generation',
          percent: 100,
          detail: 'Aggregating deterministic risk components, calibrating priority index, and signing audit log.',
        },
      ];

      for (let i = 0; i < stages.length; i++) {
        setValidationProgress(stages[i]);
        await new Promise((resolve) => setTimeout(resolve, 450));
      }

      // Finalize application state
      const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== appId && app.applicationId !== appId) return app;
          return {
            ...app,
            lastValidatedAt: nowFormatted,
            validationState: 'COMPLETED',
            lastUpdated: 'Just now',
          };
        })
      );

      // Add audit event
      const targetApp = getApplication(appId);
      const auditEvent: ActivityTimelineItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        applicationId: targetApp?.applicationId || appId,
        institutionName: targetApp?.institutionName || 'Institutional Application',
        action: 'Automated AI Validation run completed across 6 statutory dossiers (APH 2024-27).',
        type: 'VERIFICATION',
        actor: 'AICTE-Scrutiny-Daemon',
        severity: 'INFO',
      };

      setActivities((prev) => [auditEvent, ...prev]);

      setIsSimulatingValidation(false);
      setValidationProgress(null);
    },
    [getApplication]
  );

  /**
   * Record Formal Officer Scrutiny Determination
   */
  const recordOfficerReview = useCallback(
    (appId: string, decision: ApplicationStatus, notes: string) => {
      const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== appId && app.applicationId !== appId) return app;
          return {
            ...app,
            status: decision,
            reviewerNotes: notes,
            officerDecision: {
              recordedBy: 'Scrutiny Officer #42',
              recordedAt: nowFormatted,
              decision,
              notes,
            },
            lastUpdated: 'Just now',
          };
        })
      );

      const targetApp = getApplication(appId);
      const auditEvent: ActivityTimelineItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        applicationId: targetApp?.applicationId || appId,
        institutionName: targetApp?.institutionName || 'Institutional Application',
        action: `Formal scrutiny determination recorded: ${decision.replace(/_/g, ' ')}.`,
        type: 'STATUS_CHANGE',
        actor: 'Scrutiny Officer #42',
        severity: decision === 'VALIDATION_EXCEPTION' || decision === 'REJECTED' ? 'HIGH' : 'LOW',
        details: notes,
      };

      setActivities((prev) => [auditEvent, ...prev]);
    },
    [getApplication]
  );

  /**
   * Request Clarification from Institution
   */
  const requestClarification = useCallback(
    (appId: string, querySubject: string, queryDetails: string) => {
      const targetApp = getApplication(appId);
      const auditEvent: ActivityTimelineItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        applicationId: targetApp?.applicationId || appId,
        institutionName: targetApp?.institutionName || 'Institutional Application',
        action: `Deficiency clarification query dispatched: "${querySubject}".`,
        type: 'DEFICIT_FLAG',
        actor: 'Scrutiny Officer #42',
        severity: 'MEDIUM',
        details: queryDetails,
      };

      setActivities((prev) => [auditEvent, ...prev]);
    },
    [getApplication]
  );

  /**
   * Add Uploaded Document:
   * Attaches real document parsed by FastAPI backend to target application,
   * incorporates extracted findings, recalculates overall risk score deterministically,
   * and creates an audit trail entry.
   */
  const addUploadedDocument = useCallback(
    (appId: string, docUpload: DocumentUploadResponseDto) => {
      let newFindingsAdded: Finding[] = [];

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== appId && app.applicationId !== appId) return app;

          // Convert backend response into ApplicationDocument
          const newDoc: ApplicationDocument = {
            id: docUpload.id,
            name: docUpload.name,
            documentType: docUpload.documentType,
            uploadDate: docUpload.uploadDate,
            status: docUpload.status,
            fileSize: docUpload.fileSize,
            pagesCount: docUpload.pagesCount,
            issuingAuthority: docUpload.issuingAuthority,
            referenceNumber: docUpload.referenceNumber,
            validityWindow: docUpload.validityWindow,
            extractedFields: docUpload.extractedFields,
            validationChecks: docUpload.validationChecks,
            associatedFindingIds: docUpload.associatedFindingIds,
            isUploadedRealDoc: true,
            fileHash: docUpload.fileHash,
            mimeType: docUpload.mimeType,
            ocrEngineUsed: docUpload.ocrEngineUsed,
            rawTextExcerpt: docUpload.rawTextExcerpt,
            downloadUrl: `/api/documents/${docUpload.id}/file`,
            isScanned: docUpload.isScanned,
            hasVisualAnomaly: docUpload.hasVisualAnomaly,
            anomalyDetails: docUpload.anomalyDetails,
          };

          // Map generated findings
          const mappedFindings: Finding[] = (docUpload.findingsGenerated || []).map((f) => ({
            id: f.id,
            title: f.title,
            description: f.explanation || f.title,
            category: f.category || 'Mandatory Documentation',
            severity: f.severity || 'HIGH',
            type: f.type || 'EXPIRED_AFFILIATION',
            status: f.status || 'FLAGGED',
            clauseRef: f.clauseRef,
            reviewState: 'UNREVIEWED',
            observedValue: f.observedValue,
            expectedValue: f.expectedValue,
            explanation: f.explanation,
            recommendedAction: f.recommendedAction,
            relatedDocumentId: docUpload.id,
            riskWeight: f.riskWeight || 15,
            detectedAt: 'Real-time via FastAPI OCR Pipeline',
          }));

          newFindingsAdded = mappedFindings;

          // Deduplicate if already present
          const existingDocIndex = app.documents.findIndex((d) => d.id === docUpload.id);
          const updatedDocuments =
            existingDocIndex >= 0
              ? app.documents.map((d, i) => (i === existingDocIndex ? newDoc : d))
              : [newDoc, ...app.documents];

          // Deduplicate findings: replace or add based on ID or relatedDocumentId + type
          const existingFindingsClean = app.findings.filter(
            (existingF) =>
              !mappedFindings.some(
                (newF) =>
                  newF.id === existingF.id ||
                  (newF.relatedDocumentId &&
                    newF.relatedDocumentId === existingF.relatedDocumentId &&
                    newF.type === existingF.type)
              )
          );
          const combinedFindings = [...mappedFindings, ...existingFindingsClean];

          // Deterministic risk score calculation from active findings
          const activeFindings = combinedFindings.filter(
            (f) => f.reviewState !== 'RESOLVED' && f.status !== 'RESOLVED' && f.status !== 'VERIFIED'
          );
          const newRiskScore = Math.min(
            100,
            activeFindings.reduce((sum, f) => sum + (f.riskWeight || 0), 0)
          );
          const newPriority = newRiskScore >= 70 ? 'HIGH' : newRiskScore >= 40 ? 'MEDIUM' : 'LOW';

          // Update risk breakdown
          const existingBreakdownsClean = (app.riskBreakdown || []).filter(
            (rb) => !mappedFindings.some((mf) => mf.id === rb.findingId)
          );
          const newBreakdowns: RiskScoreComponent[] = mappedFindings.map((f) => ({
            factor: f.title,
            weight: f.riskWeight || 15,
            condition: f.clauseRef || 'APH Norm Compliance',
            triggered: true,
            findingId: f.id,
          }));

          const updatedBreakdown = [...newBreakdowns, ...existingBreakdownsClean];

          // Count active issues
          const activeIssues = combinedFindings.filter(
            (f) => f.status === 'FLAGGED' || f.status === 'REQUIRES_MANUAL_INSPECTION'
          ).length;

          return {
            ...app,
            documents: updatedDocuments,
            findings: combinedFindings,
            documentsCount: (app.documentsCount || app.documents.length) + (existingDocIndex >= 0 ? 0 : 1),
            documentsReviewed: (app.documentsReviewed || 0) + (docUpload.status === 'VERIFIED' ? 1 : 0),
            riskScore: newRiskScore,
            priority: newPriority,
            issueCount: activeIssues,
            riskBreakdown: updatedBreakdown,
            lastUpdated: 'Just now',
          };
        })
      );

      // Audit event
      const targetApp = getApplication(appId);
      const auditEvent: ActivityTimelineItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        applicationId: targetApp?.applicationId || appId,
        institutionName: targetApp?.institutionName || 'Institutional Application',
        action: `Real Document Ingested: "${docUpload.name}" [${docUpload.ocrEngineUsed || 'FastAPI'}]`,
        type: 'DOCUMENT_UPLOAD',
        actor: 'FastAPI Document Verification Engine',
        severity: docUpload.status === 'FLAGGED' ? 'HIGH' : docUpload.status === 'MANUAL_INSPECTION' ? 'MEDIUM' : 'INFO',
        details: `Processed in ${docUpload.processingTimeMs}ms. Extracted ${docUpload.extractedFields.length} fields; ${docUpload.validationChecks.length} checks executed; ${newFindingsAdded.length} new finding(s) generated.`,
      };

      setActivities((prev) => [auditEvent, ...prev]);
    },
    [getApplication]
  );

  /**
   * Reset Demo Data: Wipes localStorage and resets to fresh initial seed
   */
  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_APPS);
    localStorage.removeItem(STORAGE_KEY_ACTS);
    setApplications(SYNTHETIC_APPLICATIONS);
    setActivities(SYNTHETIC_ACTIVITIES);
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        activities,
        getApplication,
        updateFindingReview,
        runValidationSimulation,
        recordOfficerReview,
        requestClarification,
        addUploadedDocument,
        resetDemoData,
        isSimulatingValidation,
        validationProgress,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplicationContext() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplicationContext must be used within an ApplicationProvider');
  }
  return context;
}
