import { ApplicationRecord, Finding } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  AlertTriangle,
  Building2,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface OverviewTabProps {
  application: ApplicationRecord;
  onOpenFinding: (finding: Finding) => void;
  onNavigateToTab: (tab: 'documents' | 'compliance' | 'verification') => void;
}

export function OverviewTab({
  application,
  onOpenFinding,
  onNavigateToTab,
}: OverviewTabProps) {
  const unresolvedFindings = application.findings.filter(
    (f) => f.status === 'FLAGGED' || f.status === 'REQUIRES_MANUAL_INSPECTION'
  );

  return (
    <div className="space-y-6">
      {/* Executive Intelligence Brief Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Scrutiny Intelligence Brief
            </h3>
          </div>
          <Badge variant="navy" size="sm">
            AI Automated Assessment
          </Badge>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Application <strong>{application.applicationId}</strong> submitted by{' '}
          <strong>{application.institutionName}</strong> for <em>{application.applicationCategory}</em>{' '}
          has been processed across {application.documentsCount} statutory documentation packages. Automated screening
          has identified <strong>{unresolvedFindings.length} active regulatory flags</strong> requiring scrutiny officer
          adjudication before formal recommendation can be formulated.
        </p>

        {application.applicationId === 'DEMO-EoA-2026-0142' && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-950">Key Demonstration Highlights:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-amber-900">
                <li>Expired State University Affiliation Certificate (AY 2024–25 expired on 30-June-2025).</li>
                <li>Missing mandatory Form 4B municipal fire safety & structural fitness certificate.</li>
                <li>Intake mismatch: Declared 180 seats in Part-A vs. 120 seats authorized on University Seat Schedule.</li>
                <li>Visual anomaly flagged on Tahsildar land conversion deed (Page 3 endorsement stamp).</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Discrepancy Highlights Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            Primary Regulatory Flags ({unresolvedFindings.length})
          </h3>
          <span className="text-xs text-slate-400">Click card to review & resolve</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {unresolvedFindings.map((finding) => (
            <Card
              key={finding.id}
              onClick={() => onOpenFinding(finding)}
              className="cursor-pointer border-l-4 border-l-rose-500 hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.2 rounded">
                    {finding.id}
                  </span>
                  <Badge variant="danger" size="sm">
                    {finding.severity}
                  </Badge>
                </div>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">
                  {finding.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {finding.description}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400">Weight: +{finding.riskWeight || 0} pts</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect Finding <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Institution & Programme Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Institutional Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Institution Name</span>
              <span className="font-semibold text-slate-900">{application.institutionName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Jurisdiction / Region</span>
              <span className="font-medium text-slate-900">{application.state}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Application Category</span>
              <span className="font-medium text-slate-900">{application.applicationCategory}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Submission Date</span>
              <span className="font-mono text-slate-900">{application.submissionDate}</span>
            </div>
            <div className="flex justify-between py-1 text-xs">
              <span className="text-slate-500">Sponsoring Trust</span>
              <span className="font-semibold text-slate-900">Meridian Educational & Charitable Trust</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-600" />
              Academic Programmes & Intake Declarations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-lg border border-slate-200 p-2.5 bg-slate-50">
              <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                <span>B.Tech Computer Science & Engg</span>
                <span className="font-mono text-rose-700">180 Applied vs 120 Approved</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Discrepancy: Part-A form claims 180 seats, but university schedule limits intake to 120 seats.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-2.5 bg-slate-50">
              <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                <span>B.Tech Mechanical Engineering</span>
                <span className="font-mono text-emerald-700">60 Seats (Aligned)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                1:20 cadre ratio satisfied; laboratory equipment manifest verified.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-2.5 bg-slate-50">
              <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                <span>B.Tech Civil Engineering</span>
                <span className="font-mono text-emerald-700">60 Seats (Aligned)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Survey laboratory & computer aided design lab verified.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateToTab('documents')}
          className="rounded-xl border border-slate-200 bg-white p-4 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all text-xs"
        >
          <span className="font-bold text-slate-900 flex items-center justify-between">
            Document Inventory ({application.documentsCount})
            <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
          </span>
          <p className="text-slate-500 mt-1 text-[11px]">
            Inspect individual PDFs, extracted OCR fields, and missing document placeholders.
          </p>
        </div>

        <div
          onClick={() => onNavigateToTab('compliance')}
          className="rounded-xl border border-slate-200 bg-white p-4 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all text-xs"
        >
          <span className="font-bold text-slate-900 flex items-center justify-between">
            Compliance Checklist ({application.complianceChecklist.length})
            <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
          </span>
          <p className="text-slate-500 mt-1 text-[11px]">
            Evaluate Pass/Warning/Fail checks across land, faculty, and affiliation clauses.
          </p>
        </div>

        <div
          onClick={() => onNavigateToTab('verification')}
          className="rounded-xl border border-slate-200 bg-white p-4 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all text-xs"
        >
          <span className="font-bold text-slate-900 flex items-center justify-between">
            Forensics & Registry Check
            <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
          </span>
          <p className="text-slate-500 mt-1 text-[11px]">
            Examine simulated seal authenticity, signature checks, and visual anomalies.
          </p>
        </div>
      </div>
    </div>
  );
}
