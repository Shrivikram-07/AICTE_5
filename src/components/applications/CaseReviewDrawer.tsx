import { useNavigate } from 'react-router-dom';
import { ApplicationRecord } from '@/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { RiskScoreBadge } from './RiskScoreBadge';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Calendar,
  FileCheck,
  AlertTriangle,
  ShieldAlert,
  MapPin,
  Sparkles,
  FileText,
  Clock,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface CaseReviewDrawerProps {
  application: ApplicationRecord | null;
  onClose: () => void;
}

export function CaseReviewDrawer({ application, onClose }: CaseReviewDrawerProps) {
  const navigate = useNavigate();

  if (!application) return null;

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
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {application.applicationId}
                  </span>
                  <Badge variant="navy" size="sm">
                    {application.applicationCategory}
                  </Badge>
                  {application.applicationId === 'DEMO-EoA-2026-0142' && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30">
                      <Sparkles className="h-3 w-3" /> Primary Demo Dossier
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
                  {application.institutionName}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {application.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Submitted: {application.submissionDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Updated: {application.lastUpdated}
                  </span>
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

            {/* Quick status bar */}
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-navy-800/80 pt-4">
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Review Status</div>
                <div className="mt-1">
                  <StatusBadge status={application.status} />
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Risk Assessment</div>
                <div className="mt-1 flex items-center gap-2">
                  <RiskScoreBadge score={application.riskScore} />
                  <PriorityBadge priority={application.priority} />
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Documents Processed</div>
                <div className="mt-1 font-mono text-xs font-semibold text-slate-200">
                  {application.documentsReviewed} / {application.documentsCount} ({Math.round((application.documentsReviewed / application.documentsCount) * 100)}%)
                </div>
              </div>
            </div>
          </div>

          {/* Synthetic Data Disclaimer Banner */}
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="font-medium">
                Synthetic Demonstration Case · Findings generated by prototype mock validation engine.
              </span>
            </div>
            <span className="font-mono text-[10px] bg-amber-200/60 px-1.5 py-0.5 rounded font-semibold">
              SIH26261
            </span>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Overview / Reviewer Notes */}
            {application.reviewerNotes && (
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Scrutiny Context & Notes
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {application.reviewerNotes}
                </p>
              </div>
            )}

            {/* Findings & Deficiencies Section */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Automated Findings & Compliance Flags ({application.findings.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  {application.findings.filter((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH').length} High/Critical
                </span>
              </div>

              {application.findings.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-lg border border-slate-200 mt-4">
                  <FileCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-700">No regulatory infractions flagged.</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">All uploaded mandatory attachments conform to standard handbook checklists.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {application.findings.map((finding) => {
                    let borderClass = 'border-l-amber-500';
                    let badgeVariant: 'danger' | 'warning' | 'primary' | 'success' | 'outline' = 'warning';

                    if (finding.severity === 'CRITICAL' || finding.severity === 'HIGH') {
                      borderClass = 'border-l-rose-500';
                      badgeVariant = 'danger';
                    } else if (finding.severity === 'INFO') {
                      borderClass = 'border-l-emerald-500';
                      badgeVariant = 'success';
                    } else if (finding.severity === 'MEDIUM') {
                      borderClass = 'border-l-amber-500';
                      badgeVariant = 'warning';
                    }

                    return (
                      <div
                        key={finding.id}
                        className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm border-l-4 ${borderClass}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={badgeVariant} size="sm">
                                {finding.severity}
                              </Badge>
                              <span className="text-xs font-semibold text-slate-800">
                                {finding.category}
                              </span>
                              {finding.clauseRef && (
                                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {finding.clauseRef}
                                </span>
                              )}
                            </div>
                            <h4 className="mt-1 text-sm font-semibold text-slate-900">
                              {finding.title}
                            </h4>
                          </div>

                          <span className="shrink-0 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {finding.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {finding.description}
                        </p>

                        {finding.simulatedNote && (
                          <div className="mt-3 rounded bg-slate-50 p-2.5 border border-slate-200/80 text-[11px] text-slate-500">
                            <span className="font-medium text-slate-700">Engine Telemetry:</span>{' '}
                            {finding.simulatedNote}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Document Verification Checklist */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Submitted Mandatory Dossier Items
              </h3>
              <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs">
                <div className="p-3 flex items-center justify-between bg-slate-50 font-medium text-slate-700">
                  <span>Document Title</span>
                  <span>AI Pre-Check Status</span>
                </div>
                <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <span className="text-slate-800">Society / Trust Registration Deed</span>
                  <span className="inline-flex items-center text-emerald-700 font-medium gap-1 text-[11px]">
                    <FileCheck className="h-3.5 w-3.5" /> Registry Verified
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <span className="text-slate-800">University Affiliation Letter AY 2026-27</span>
                  <span className="inline-flex items-center text-rose-700 font-semibold gap-1 text-[11px]">
                    <AlertTriangle className="h-3.5 w-3.5" /> Expired (30-Jun-2025)
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <span className="text-slate-800">Land Title / Survey No. 142/A Conversion Deed</span>
                  <span className="inline-flex items-center text-amber-700 font-medium gap-1 text-[11px]">
                    <Eye className="h-3.5 w-3.5" /> Manual Scrutiny Needed
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <span className="text-slate-800">Form 4B: Fire Safety & Occupancy Certificate</span>
                  <span className="inline-flex items-center text-rose-700 font-semibold gap-1 text-[11px]">
                    <X className="h-3.5 w-3.5" /> Document Missing
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Footer / Scrutiny Actions */}
          <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Assigned to: <strong className="text-slate-700">Scrutiny Officer #42</strong>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={onClose} className="flex-1 sm:flex-initial">
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 sm:flex-initial bg-blue-700 hover:bg-blue-800 gap-1.5 shadow-sm"
                onClick={() => {
                  onClose();
                  navigate(`/applications/${application.id}/review`);
                }}
              >
                <span>Open Dedicated Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
