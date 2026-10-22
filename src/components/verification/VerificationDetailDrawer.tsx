import { useNavigate } from 'react-router-dom';
import { VerificationRecord } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApplicationContext } from '@/context/ApplicationContext';
import {
  X,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Clock,
  ArrowRight,
  FileText,
  Building2,
  Sparkles,
  Info,
} from 'lucide-react';

interface VerificationDetailDrawerProps {
  record: VerificationRecord | null;
  onClose: () => void;
}

export function VerificationDetailDrawer({ record, onClose }: VerificationDetailDrawerProps) {
  const navigate = useNavigate();
  const { updateFindingReview } = useApplicationContext();

  if (!record) return null;

  const isVerified = record.reviewStatus === 'VERIFIED';

  const handleResolveLinkedFinding = () => {
    if (record.findingId && record.appDbId) {
      updateFindingReview(record.appDbId, record.findingId, {
        reviewState: 'RESOLVED',
        reviewNotes: 'Resolved directly from Verification Centre operations ledger.',
        resolved: true,
      });
      onClose();
    }
  };

  const handleMarkInspected = () => {
    if (record.findingId && record.appDbId) {
      updateFindingReview(record.appDbId, record.findingId, {
        reviewState: 'REVIEWED',
        reviewNotes: 'Inspected and noted in Verification Centre.',
        resolved: false,
      });
      onClose();
    }
  };

  const getResultBadge = () => {
    switch (record.result) {
      case 'MATCH_PASSED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Match Passed
          </span>
        );
      case 'MISMATCH_FLAGGED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
            <AlertOctagon className="h-3.5 w-3.5 text-rose-600" /> Mismatch Flagged
          </span>
        );
      case 'ANOMALY_DETECTED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Anomaly Detected
          </span>
        );
      case 'SOURCE_UNAVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            <Cpu className="h-3.5 w-3.5 text-slate-500" /> Source Unavailable
          </span>
        );
      case 'PENDING_MANUAL':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <Clock className="h-3.5 w-3.5 text-amber-600" /> Pending Manual Check
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="bg-navy-950 text-white p-6 border-b border-navy-800">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {record.id}
                  </span>
                  <Badge variant="navy" size="sm">
                    {record.methodLabel}
                  </Badge>
                  {getResultBadge()}
                </div>
                <h2 className="mt-2 text-lg font-bold tracking-tight text-white">
                  {record.targetChecked}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-mono text-amber-300">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {record.applicationId}
                  </span>
                  <span>·</span>
                  <span className="truncate max-w-[260px] font-semibold text-slate-200">
                    {record.institutionName}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-slate-400">{record.timestamp}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 hover:bg-navy-800 hover:text-white transition-colors"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Dynamic Protocol & Execution Mode Banner */}
          {record.method === 'REGISTRY_MATCHING' || record.method === 'EXTERNAL_SOURCE' ? (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="font-medium">
                  Simulated External Registry Gateway · Sandbox Demonstration Mode (Charity Comm / NAD / MCA).
                </span>
              </div>
              <span className="font-mono text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold shrink-0">
                EXTERNAL SIMULATION
              </span>
            </div>
          ) : (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="font-medium">
                  Local Rule Engine & Document Forensics · Evaluated against Approval Process Handbook (APH 2024–27).
                </span>
              </div>
              <span className="font-mono text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded font-bold shrink-0">
                LOCAL RULE PIPELINE
              </span>
            </div>
          )}

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {/* Observed vs Expected Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Evidentiary Comparison
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                    Observed Record Value
                  </span>
                  <p className="font-mono text-xs text-slate-900 font-semibold leading-relaxed">
                    {record.observedValue}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/50 space-y-1">
                  <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider block">
                    Expected Regulatory Norm
                  </span>
                  <p className="font-mono text-xs text-blue-950 font-semibold leading-relaxed">
                    {record.expectedValue}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence Reference */}
            <div className="rounded-lg border border-slate-200 p-4 space-y-2 bg-white">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-600" />
                Dossier & Evidence Reference
              </h4>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-800 font-semibold">
                  {record.documentName}
                </span>
                {record.documentId && (
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    ID: {record.documentId}
                  </span>
                )}
              </div>
            </div>

            {/* Explanation & Technical Details */}
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-200 p-4 space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs">Algorithmic Explanation</h4>
                <p className="text-slate-600 leading-relaxed">
                  {record.explanation}
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 space-y-1.5">
                <h4 className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-blue-700" />
                  Recommended Scrutiny Officer Action
                </h4>
                <p className="text-blue-900 leading-relaxed">
                  {record.recommendedAction}
                </p>
              </div>
            </div>

            {/* Officer Review Status & Score Impact */}
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Officer Review Status
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block ${
                      record.reviewStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : record.reviewStatus === 'INSPECTED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {record.reviewStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                {record.scoreContribution !== undefined && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Priority Score Impact
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900 mt-1 inline-block">
                      +{record.scoreContribution} pts
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {record.findingId && !isVerified && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={handleMarkInspected}
                  >
                    Mark as Inspected
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs bg-emerald-700 hover:bg-emerald-800"
                    onClick={handleResolveLinkedFinding}
                  >
                    Resolve Finding
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={onClose} className="flex-1 sm:flex-initial">
                Close
              </Button>
              {record.appDbId && (
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 sm:flex-initial bg-blue-700 hover:bg-blue-800 gap-1.5"
                  onClick={() => {
                    onClose();
                    navigate(`/applications/${record.appDbId}/review`);
                  }}
                >
                  <span>Open Application Review</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
