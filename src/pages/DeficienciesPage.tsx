import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApplicationContext } from '@/context/ApplicationContext';
import { CaseReviewDrawer } from '@/components/applications/CaseReviewDrawer';
import { ApplicationRecord } from '@/types';
import { ShieldAlert, Sparkles, Filter, ArrowRight } from 'lucide-react';

export function DeficienciesPage() {
  const navigate = useNavigate();
  const { applications } = useApplicationContext();
  const [selectedCase, setSelectedCase] = useState<ApplicationRecord | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');

  // Flatten findings with institution metadata
  const allDeficiencies = useMemo(() => {
    const list: Array<{
      app: ApplicationRecord;
      finding: (typeof applications)[0]['findings'][0];
    }> = [];

    applications.forEach((app) => {
      app.findings.forEach((finding) => {
        if (finding.status !== 'VERIFIED') {
          list.push({ app, finding });
        }
      });
    });

    return list;
  }, [applications]);

  const filteredDeficiencies = useMemo(() => {
    if (severityFilter === 'ALL') return allDeficiencies;
    return allDeficiencies.filter((d) => d.finding.severity === severityFilter);
  }, [allDeficiencies, severityFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Regulatory Deficiency Tracking
            </h1>
            <Badge variant="navy" size="sm">
              SIH26261 Rules
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Catalog of non-compliance flags and discrepancies mapped directly to the AICTE Approval Process Handbook (APH 2024–27).
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Severity:
          </span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="rounded-md border border-slate-200 bg-white py-1 px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      {/* Synthetic Notice */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          Showing {filteredDeficiencies.length} active flags derived from the shared synthetic intake dataset.
        </span>
        <span className="font-mono text-[10px] text-amber-800">Mock Norms Engine</span>
      </div>

      <div className="space-y-3.5">
        {filteredDeficiencies.map(({ app, finding }, idx) => {
          const isPrimaryDemo = app.applicationId === 'DEMO-EoA-2026-0142';
          const isCritical = finding.severity === 'CRITICAL';
          const isHigh = finding.severity === 'HIGH';

          return (
            <Card
              key={`${app.id}-${finding.id}-${idx}`}
              className={`border-l-4 ${
                isCritical
                  ? 'border-l-rose-600'
                  : isHigh
                  ? 'border-l-rose-500'
                  : 'border-l-amber-500'
              } ${isPrimaryDemo ? 'bg-amber-50/20' : ''}`}
            >
              <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between pb-2 gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {finding.clauseRef || finding.category}
                    </span>
                    <Badge variant={isCritical || isHigh ? 'danger' : 'warning'}>
                      {finding.severity} Severity
                    </Badge>
                    {isPrimaryDemo && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                        <Sparkles className="h-3 w-3" /> Primary Demo Case
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base text-slate-900 mt-1">
                    {finding.title}
                  </CardTitle>
                  <div className="text-xs font-medium text-slate-600 flex items-center gap-2">
                    <span className="font-mono text-slate-800">{app.applicationId}</span>
                    <span>·</span>
                    <span className="text-slate-900 font-semibold">{app.institutionName}</span>
                    <span>·</span>
                    <span className="text-slate-500">{app.state}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {finding.status.replace(/_/g, ' ')}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2 text-slate-600 hover:text-slate-900"
                    onClick={() => setSelectedCase(app)}
                  >
                    Quick View
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-7 text-xs px-2.5 bg-blue-700 hover:bg-blue-800"
                    onClick={() => navigate(`/applications/${app.id}/review`)}
                  >
                    Workspace <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {finding.description}
                </p>
                {finding.simulatedNote && (
                  <div className="mt-2 text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                    Engine Log: {finding.simulatedNote}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CaseReviewDrawer
        application={selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  );
}
