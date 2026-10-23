import { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useApplicationContext } from '@/context/ApplicationContext';
import { ApplicationDocument, Finding } from '@/types';
import { StatusBadge } from '@/components/applications/StatusBadge';
import { PriorityBadge } from '@/components/applications/PriorityBadge';
import { RiskScoreBadge } from '@/components/applications/RiskScoreBadge';
import { Button } from '@/components/ui/Button';

// Workspace Tabs & Sub-components
import { OverviewTab } from '@/components/workspace/OverviewTab';
import { DocumentsTab } from '@/components/workspace/DocumentsTab';
import { ComplianceTab } from '@/components/workspace/ComplianceTab';
import { VerificationTab } from '@/components/workspace/VerificationTab';
import { RiskBreakdownPanel } from '@/components/workspace/RiskBreakdownPanel';

// Modals
import { DocumentInspectorModal } from '@/components/workspace/DocumentInspectorModal';
import { FindingReviewModal } from '@/components/workspace/FindingReviewModal';
import { RecordReviewModal } from '@/components/workspace/RecordReviewModal';
import { RequestClarificationModal } from '@/components/workspace/RequestClarificationModal';
import { ValidationSimulationModal } from '@/components/workspace/ValidationSimulationModal';
import { DocumentUploadModal } from '@/components/workspace/DocumentUploadModal';

import {
  ChevronRight,
  Home,
  Play,
  HelpCircle,
  FileCheck2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  UploadCloud,
} from 'lucide-react';

export function ApplicationReviewWorkspace() {
  const { id } = useParams<{ id: string }>();
  const { getApplication, runValidationSimulation, resetDemoData } = useApplicationContext();

  const application = useMemo(() => {
    if (!id) return undefined;
    return getApplication(id);
  }, [id, getApplication]);

  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const activeTab: 'overview' | 'documents' | 'compliance' | 'verification' =
    requestedTab && ['overview', 'documents', 'compliance', 'verification'].includes(requestedTab)
      ? (requestedTab as 'overview' | 'documents' | 'compliance' | 'verification')
      : 'overview';

  const setActiveTab = (tab: 'overview' | 'documents' | 'compliance' | 'verification') => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', tab);
        return next;
      },
      { replace: true }
    );
  };
  const [selectedDoc, setSelectedDoc] = useState<ApplicationDocument | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isRecordReviewOpen, setIsRecordReviewOpen] = useState(false);
  const [isClarificationOpen, setIsClarificationOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Fallback if application ID not found
  if (!application) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Application Record Not Found</h2>
        <p className="text-xs text-slate-600">
          No scrutiny dossier exists with reference "{id}".
        </p>
        <Link to="/applications">
          <Button variant="primary" size="sm">
            Return to Applications Register
          </Button>
        </Link>
      </div>
    );
  }

  // Summary strip derived calculations
  const totalDocs = application.documentsCount || 6;
  const reviewedDocs = application.documentsReviewed || 5;
  const passedChecksCount = (application.complianceChecklist || []).filter((c) => c.result === 'PASS').length;
  const outstandingFindingsCount = application.findings.filter(
    (f) => f.status === 'FLAGGED' || f.status === 'REQUIRES_MANUAL_INSPECTION'
  ).length;
  const progressPercent = Math.round((reviewedDocs / totalDocs) * 100);

  const handleInspectDocById = (docId: string) => {
    const doc = application.documents.find((d) => d.id === docId);
    if (doc) setSelectedDoc(doc);
  };

  const handleInspectFindingById = (fndId: string) => {
    const fnd = application.findings.find((f) => f.id === fndId);
    if (fnd) setSelectedFinding(fnd);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
          <Home className="h-3.5 w-3.5" /> Command Centre
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link to="/applications" className="hover:text-slate-800 transition-colors">
          Applications Register
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-mono text-slate-800 font-semibold">{application.applicationId}</span>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-900 font-medium">Scrutiny Workspace</span>
      </nav>

      {/* 2. Workspace Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                {application.applicationId}
              </span>
              <StatusBadge status={application.status} />
              <PriorityBadge priority={application.priority} />
              <RiskScoreBadge score={application.riskScore} />
              {application.applicationId === 'DEMO-EoA-2026-0142' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  <Sparkles className="h-3 w-3 text-amber-600" /> Primary SIH26261 Demo Case
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {application.institutionName}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span>Jurisdiction: <strong className="text-slate-700">{application.state}</strong></span>
              <span>Category: <strong className="text-slate-700">{application.applicationCategory}</strong></span>
              <span>Submitted: <strong className="font-mono text-slate-700">{application.submissionDate}</strong></span>
              {application.lastValidatedAt && (
                <span className="text-emerald-700 font-medium">
                  Last Validated: {application.lastValidatedAt}
                </span>
              )}
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-1.5 text-xs text-indigo-800 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 font-semibold"
            >
              <UploadCloud className="h-3.5 w-3.5 text-indigo-600" />
              Upload Real Evidence
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClarificationOpen(true)}
              className="gap-1.5 text-xs text-slate-700"
            >
              <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
              Request Clarification
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecordReviewOpen(true)}
              className="gap-1.5 text-xs text-slate-700"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-blue-600" />
              Record Review
            </Button>

            <Button
              variant="specular"
              size="sm"
              onClick={() => runValidationSimulation(application.id)}
              className="gap-1.5 text-xs shadow-md"
            >
              <Play className="h-3.5 w-3.5 fill-current text-blue-200" />
              Run Validation
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-[11px] uppercase font-bold text-slate-400">Overall Risk Index</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {application.riskScore}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 truncate">Deterministic penalty sum</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-[11px] uppercase font-bold text-slate-400">Dossiers Reviewed</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {reviewedDocs}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {totalDocs}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Statutory files in inventory</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-[11px] uppercase font-bold text-slate-400">Passed Checks</div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-emerald-700 font-mono">
            {passedChecksCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Norm items confirmed clean</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="text-[11px] uppercase font-bold text-slate-400">Outstanding Flags</div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-rose-700 font-mono">
            {outstandingFindingsCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Requires officer decision</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[11px] uppercase font-bold text-slate-400">Completion Progress</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-blue-700 font-mono">
              {progressPercent}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Overview & Brief
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'documents'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Document Intelligence ({totalDocs})
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'compliance'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Compliance Review ({application.complianceChecklist.length})
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'verification'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Verification & Forensics
        </button>
      </div>

      {/* 5. Main Area (2-Column Layout with Side Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8">
          {activeTab === 'overview' && (
            <OverviewTab
              application={application}
              onOpenFinding={(fnd) => setSelectedFinding(fnd)}
              onNavigateToTab={(t) => setActiveTab(t)}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsTab
              documents={application.documents}
              onInspectDocument={(doc) => setSelectedDoc(doc)}
              onUploadClick={() => setIsUploadModalOpen(true)}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceTab
              checklist={application.complianceChecklist}
              onInspectDocumentById={handleInspectDocById}
              onInspectFindingById={handleInspectFindingById}
            />
          )}

          {activeTab === 'verification' && (
            <VerificationTab
              application={application}
              onInspectDocumentById={handleInspectDocById}
            />
          )}
        </div>

        {/* Side Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <RiskBreakdownPanel
            application={application}
            onOpenFinding={(fnd) => setSelectedFinding(fnd)}
            onRequestClarification={() => setIsClarificationOpen(true)}
            onRecordReview={() => setIsRecordReviewOpen(true)}
          />

          {/* Reset Demo Button */}
          <div className="pt-2 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Reset demo state to initial seed?')) {
                  resetDemoData();
                  alert('Demo state restored to initial seed.');
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-800 gap-1.5 border-dashed"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Demo Dataset
            </Button>
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <DocumentInspectorModal
        document={selectedDoc}
        linkedFindings={
          selectedDoc
            ? application.findings.filter((f) => selectedDoc.associatedFindingIds.includes(f.id))
            : []
        }
        onClose={() => setSelectedDoc(null)}
        onOpenFinding={(fnd) => {
          setSelectedDoc(null);
          setSelectedFinding(fnd);
        }}
      />

      <FindingReviewModal
        applicationId={application.applicationId}
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onViewDocument={(docId) => {
          setSelectedFinding(null);
          handleInspectDocById(docId);
        }}
      />

      {isRecordReviewOpen && (
        <RecordReviewModal
          applicationId={application.applicationId}
          currentStatus={application.status}
          onClose={() => setIsRecordReviewOpen(false)}
        />
      )}

      {isClarificationOpen && (
        <RequestClarificationModal
          applicationId={application.applicationId}
          institutionName={application.institutionName}
          onClose={() => setIsClarificationOpen(false)}
        />
      )}

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        applicationId={application.applicationId}
        institutionName={application.institutionName}
      />

      <ValidationSimulationModal />
    </div>
  );
}
