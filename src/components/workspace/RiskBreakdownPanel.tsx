import { ApplicationRecord, Finding } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

interface RiskBreakdownPanelProps {
  application: ApplicationRecord;
  onOpenFinding: (finding: Finding) => void;
  onRequestClarification: () => void;
  onRecordReview: () => void;
}

export function RiskBreakdownPanel({
  application,
  onOpenFinding,
  onRequestClarification,
  onRecordReview,
}: RiskBreakdownPanelProps) {
  // Compute sum of active triggered weights
  const components = application.riskBreakdown || [];

  return (
    <div className="space-y-5">
      {/* Risk Score Explanation Card */}
      <Card className="border-t-4 border-t-amber-500 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
              Scrutiny Risk Breakdown
            </span>
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                application.riskScore >= 70
                  ? 'bg-rose-100 text-rose-800'
                  : application.riskScore >= 40
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {application.riskScore}/100 Score
            </span>
          </div>
          <CardTitle className="text-base text-slate-900 mt-1">
            Deterministic Priority Index
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3.5 text-xs">
          {/* Transparent Mathematical Formula Breakdown */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between border-b border-slate-100 pb-1">
              <span>Risk Factor Evaluation</span>
              <span>Weight</span>
            </div>

            {components.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No risk weight penalties triggered.</p>
            ) : (
              components.map((comp, idx) => (
                <div
                  key={idx}
                  className={`flex items-start justify-between p-2 rounded-lg text-[11px] transition-colors ${
                    comp.triggered
                      ? 'bg-rose-50/70 border border-rose-200 text-rose-950 font-medium'
                      : 'bg-slate-50 text-slate-400 line-through'
                  }`}
                >
                  <div className="pr-2 min-w-0">
                    <span className="font-semibold block truncate">{comp.factor}</span>
                    <span className="text-[10px] text-slate-500">{comp.condition}</span>
                  </div>
                  <span className="font-mono font-bold shrink-0">
                    {comp.triggered ? `+${comp.weight}` : '0'} pts
                  </span>
                </div>
              ))
            )}

            {/* Arithmetic Total Calculation */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-bold text-slate-900">
              <span>Cumulative Priority Score:</span>
              <span className="font-mono text-sm text-blue-700">
                {application.riskScore} / 100
              </span>
            </div>
          </div>

          {/* Mandatory Formal Disclaimer */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Scoring Protocol Definition:</strong> Simulated review-priority score — not a fraud probability or final decision.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Action Guidance Card */}
      <Card className="bg-gradient-to-br from-navy-950 to-slate-900 text-white border-navy-800">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <CardTitle className="text-white text-xs uppercase tracking-wider">
              Recommended Next Action
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {application.riskScore >= 70
              ? 'Issue Deficiency Letter regarding expired affiliation certificate & missing Form 4B fire safety clearance before committee sign-off.'
              : 'Dossier exhibits low regulatory risk. Review verified certificates and proceed to formal committee recommendation.'}
          </p>

          <div className="space-y-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onRequestClarification}
              className="w-full bg-navy-900/80 text-slate-200 border-navy-700 hover:bg-navy-800 hover:text-white justify-between text-xs"
            >
              <span>Dispatch Clarification Query</span>
              <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onRecordReview}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-between text-xs shadow-md shadow-blue-900/40"
            >
              <span>Record Scrutiny Determination</span>
              <FileCheck2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Priority Findings Quick Access */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-slate-500">
            Active Findings Quick Jump
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {application.findings.map((fnd) => (
            <div
              key={fnd.id}
              onClick={() => onOpenFinding(fnd)}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition-all flex items-center justify-between text-xs group"
            >
              <div className="min-w-0 pr-2">
                <div className="font-semibold text-slate-900 truncate group-hover:text-blue-700">
                  {fnd.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {fnd.status.replace(/_/g, ' ')} · +{fnd.riskWeight || 0} pts
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
