import { useState, useMemo } from 'react';
import { ComplianceChecklistItem, ComplianceResult } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface ComplianceTabProps {
  checklist: ComplianceChecklistItem[];
  onInspectDocumentById?: (docId: string) => void;
  onInspectFindingById?: (findingId: string) => void;
}

export function ComplianceTab({
  checklist,
  onInspectDocumentById,
  onInspectFindingById,
}: ComplianceTabProps) {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');

  const categories = useMemo(() => {
    return Array.from(new Set(checklist.map((c) => c.category)));
  }, [checklist]);

  const filteredChecklist = useMemo(() => {
    return checklist.filter((item) => {
      const matchesCategory =
        categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesResult =
        resultFilter === 'ALL' || item.result === resultFilter;
      return matchesCategory && matchesResult;
    });
  }, [checklist, categoryFilter, resultFilter]);

  const getResultBadge = (result: ComplianceResult) => {
    switch (result) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> PASS
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded-full">
            <AlertOctagon className="h-3 w-3 text-rose-600" /> FAIL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full">
            <AlertTriangle className="h-3 w-3 text-amber-600" /> WARNING
          </span>
        );
      case 'NOT_CHECKED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-full">
            <Info className="h-3 w-3 text-slate-500" /> NOT CHECKED
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Disclaimer Banner */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-blue-950">Preliminary Compliance Screening Assistance:</strong>{' '}
          All automated evaluations reflect algorithmic rule matching against configured Approval Process Handbook (APH 2024–27) standards. Final approval or deficiency determinations remain subject to Scrutiny Committee review.
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white py-1 px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Categories ({checklist.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Evaluation:</span>
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white py-1 px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Results</option>
                <option value="FAIL">Fail</option>
                <option value="WARNING">Warning</option>
                <option value="PASS">Pass</option>
                <option value="NOT_CHECKED">Not Checked</option>
              </select>
            </div>
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            Showing {filteredChecklist.length} of {checklist.length} checklist items
          </span>
        </CardContent>
      </Card>

      {/* Compliance Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Norm Requirement & Category</th>
                  <th className="py-3 px-4 font-semibold">Evidence Reviewed</th>
                  <th className="py-3 px-4 font-semibold">Result</th>
                  <th className="py-3 px-4 font-semibold">Explanation & Recommended Action</th>
                  <th className="py-3 px-4 font-semibold">Review State</th>
                  <th className="py-3 px-4 font-semibold text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredChecklist.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      item.result === 'FAIL' ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    {/* Requirement */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <span className="font-semibold text-slate-900 block leading-tight">
                        {item.requirement}
                      </span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500">{item.category}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-mono text-[10px] text-blue-700 font-medium">
                          {item.handbookClauseRef}
                        </span>
                      </div>
                    </td>

                    {/* Evidence */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                      {item.evidenceReviewed}
                    </td>

                    {/* Result */}
                    <td className="py-3.5 px-4">
                      {getResultBadge(item.result)}
                    </td>

                    {/* Explanation */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <p className="text-slate-700 leading-relaxed">{item.explanation}</p>
                      <p className="mt-1 text-[11px] text-blue-800 font-medium">
                        Action: {item.recommendedAction}
                      </p>
                    </td>

                    {/* Review State */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          item.reviewState === 'DEFICIENCY_FLAGGED'
                            ? 'bg-rose-100 text-rose-800'
                            : item.reviewState === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.reviewState.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {item.linkedDocumentId && onInspectDocumentById ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2.5 font-medium"
                          onClick={() => onInspectDocumentById(item.linkedDocumentId!)}
                        >
                          Dossier <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      ) : item.linkedFindingId && onInspectFindingById ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2.5 font-medium"
                          onClick={() => onInspectFindingById(item.linkedFindingId!)}
                        >
                          Finding <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
