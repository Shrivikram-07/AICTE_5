import { getIssueCategorySummary } from '@/data/mockData';
import { ApplicationRecord } from '@/types';
import { useApplicationContext } from '@/context/ApplicationContext';
import { AlertOctagon, CheckCircle2 } from 'lucide-react';

export function IssueCategoryList({ applications: propApps }: { applications?: ApplicationRecord[] }) {
  const { applications: contextApps } = useApplicationContext();
  const apps = propApps || contextApps;
  const summaries = getIssueCategorySummary(apps);

  const totalFlags = summaries.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="space-y-3.5">
      {summaries.map((item) => (
        <div key={item.category} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 truncate">
              {item.category}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {item.highSeverityCount > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                  <AlertOctagon className="h-3 w-3" />
                  {item.highSeverityCount} Critical/High
                </span>
              )}
              <span className="font-mono text-xs font-semibold text-slate-700">
                {item.count} issues ({item.percentage}%)
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.highSeverityCount > 0 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(item.percentage * 2.5, 100)}%` }}
            />
          </div>
        </div>
      ))}

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Mapped to APH 2024–27 Norm Clauses
        </span>
        <span className="font-mono text-slate-400">Total Active Flags: {totalFlags}</span>
      </div>
    </div>
  );
}
