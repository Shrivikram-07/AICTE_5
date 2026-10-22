import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { getStatusDistribution } from '@/data/mockData';
import { ApplicationRecord } from '@/types';
import { useApplicationContext } from '@/context/ApplicationContext';

export function StatusDistributionChart({ applications: propApps }: { applications?: ApplicationRecord[] }) {
  const { applications: contextApps } = useApplicationContext();
  const apps = propApps || contextApps;
  const data = getStatusDistribution(apps);
  const total = apps.length || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-64">
      {/* Donut Chart */}
      <div className="h-56 w-56 relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#1E293B',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '12px',
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-900">{total}</span>
          <span className="text-[10px] uppercase font-semibold text-slate-500">
            Dossiers
          </span>
        </div>
      </div>

      {/* Legend & Breakdown List */}
      <div className="w-full space-y-2 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 font-medium">{item.name}</span>
            </div>
            <span className="font-mono font-semibold text-slate-900">
              {item.value} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
