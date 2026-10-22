import { useState } from 'react';
import { Finding } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApplicationContext } from '@/context/ApplicationContext';
import {
  X,
  AlertTriangle,
  FileCheck2,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface FindingReviewModalProps {
  applicationId: string;
  finding: Finding | null;
  onClose: () => void;
  onViewDocument?: (docId: string) => void;
}

export function FindingReviewModal({
  applicationId,
  finding,
  onClose,
  onViewDocument,
}: FindingReviewModalProps) {
  const { updateFindingReview } = useApplicationContext();
  const [notes, setNotes] = useState(finding?.reviewNotes || '');

  if (!finding) return null;

  const isResolved = finding.reviewState === 'RESOLVED';
  const isReviewed = finding.reviewState === 'REVIEWED';

  const handleMarkReviewed = () => {
    updateFindingReview(applicationId, finding.id, {
      reviewState: 'REVIEWED',
      reviewNotes: notes,
      resolved: false,
    });
    onClose();
  };

  const handleResolve = () => {
    updateFindingReview(applicationId, finding.id, {
      reviewState: 'RESOLVED',
      reviewNotes: notes,
      resolved: true,
    });
    onClose();
  };

  const handleReopen = () => {
    updateFindingReview(applicationId, finding.id, {
      reviewState: 'UNREVIEWED',
      reviewNotes: notes,
      resolved: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-navy-950 text-white p-5 border-b border-navy-800 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {finding.id}
              </span>
              <Badge
                variant={
                  finding.severity === 'CRITICAL' || finding.severity === 'HIGH'
                    ? 'danger'
                    : finding.severity === 'MEDIUM'
                    ? 'warning'
                    : 'success'
                }
                size="sm"
              >
                {finding.severity} Severity
              </Badge>
              <span className="text-xs text-slate-300 font-medium">
                {finding.category}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-white tracking-tight">
              {finding.title}
            </h2>
            {finding.clauseRef && (
              <p className="mt-1 text-xs text-slate-400 font-mono">
                Clause Ref: <strong className="text-slate-200">{finding.clauseRef}</strong> (Configured Demo Rule)
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-navy-800 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* Status & Review State */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Review State</div>
              <div className="mt-1 font-mono font-bold text-slate-900 flex items-center gap-1">
                {isResolved ? (
                  <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">RESOLVED</span>
                ) : isReviewed ? (
                  <span className="text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">REVIEWED</span>
                ) : (
                  <span className="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">UNREVIEWED</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Risk Weight</div>
              <div className="mt-1 font-mono font-bold text-slate-900">
                +{finding.riskWeight || 0} pts
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Related Evidence</div>
              <div className="mt-1 font-mono text-blue-700 font-medium truncate">
                {finding.relatedDocumentId ? (
                  <button
                    onClick={() => {
                      if (finding.relatedDocumentId && onViewDocument) {
                        onViewDocument(finding.relatedDocumentId);
                      }
                    }}
                    className="hover:underline text-left"
                  >
                    {finding.relatedDocumentId} →
                  </button>
                ) : (
                  'External Check'
                )}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Scrutiny Officer</div>
              <div className="mt-1 text-slate-700 font-medium">
                {finding.reviewedBy || 'Pending Review'}
              </div>
            </div>
          </div>

          {/* Observed vs Expected */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/50 space-y-1">
              <span className="font-bold text-rose-900 uppercase text-[10px] tracking-wider">
                Observed Finding
              </span>
              <p className="font-mono text-xs text-rose-950 font-semibold leading-relaxed">
                {finding.observedValue || finding.description}
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-1">
              <span className="font-bold text-emerald-900 uppercase text-[10px] tracking-wider">
                Prescribed Standard / Expectation
              </span>
              <p className="font-mono text-xs text-emerald-950 font-semibold leading-relaxed">
                {finding.expectedValue || 'Full compliance with AICTE Approval Process Handbook (APH 2024–27)'}
              </p>
            </div>
          </div>

          {/* Explanation & Officer Action Guidance */}
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 p-3.5 space-y-1">
              <h4 className="font-bold text-slate-900">Regulatory Technical Explanation</h4>
              <p className="text-slate-600 leading-relaxed">
                {finding.explanation || finding.description}
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3.5 space-y-1">
              <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Recommended Scrutiny Officer Action
              </h4>
              <p className="text-blue-900 leading-relaxed">
                {finding.recommendedAction || 'Review document and record determination before committee hearing.'}
              </p>
            </div>
          </div>

          {/* Visual Anomaly Notice if applicable */}
          {finding.type === 'VISUAL_ANOMALY' && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Forensic Protocol Notice:</strong> Potential visual anomalies represent algorithmic flags for human scrutiny and must never be treated as definitive proof of tampering without authorized committee determination.
              </div>
            </div>
          )}

          {/* Officer Review Notes Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 block">
              Scrutiny Officer Review Notes & Remarks
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record justification, verification evidence, or remarks for the committee record..."
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            Changes sync to shared application state & timeline
          </div>

          <div className="flex items-center gap-2">
            {isResolved ? (
              <Button variant="outline" size="sm" onClick={handleReopen} className="gap-1 text-slate-700">
                <RotateCcw className="h-3.5 w-3.5" />
                Reopen Finding (+{finding.riskWeight} pts)
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkReviewed}
                  className="gap-1 text-slate-700"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Mark as Inspected
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleResolve}
                  className="gap-1 bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  <FileCheck2 className="h-3.5 w-3.5" />
                  Resolve & Deduct Risk (-{finding.riskWeight} pts)
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
