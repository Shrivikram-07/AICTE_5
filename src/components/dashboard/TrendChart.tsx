import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { getApplicationTrendData } from '@/data/mockData';

export function TrendChart() {
  const data = getApplicationTrendData();

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorValidated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#1E293B',
              borderRadius: '8px',
              color: '#F8FAFC',
              fontSize: '12px',
            }}
            itemStyle={{ color: '#F8FAFC' }}
            labelStyle={{ fontWeight: 'bold', color: '#CBD5E1' }}
          />
          <Area
            type="monotone"
            dataKey="received"
            name="Received Dossiers"
            stroke="#1E3A8A"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorReceived)"
          />
          <Area
            type="monotone"
            dataKey="validated"
            name="AI-Validated"
            stroke="#059669"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValidated)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
