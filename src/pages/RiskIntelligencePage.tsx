import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationContext } from '@/context/ApplicationContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/applications/StatusBadge';
import { PriorityBadge } from '@/components/applications/PriorityBadge';
import { RiskScoreBadge } from '@/components/applications/RiskScoreBadge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  AlertOctagon,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export function RiskIntelligencePage() {
  const navigate = useNavigate();
  const { applications } = useApplicationContext();

  // Selected application for deep-dive risk breakdown (defaults to primary demo case)
  const [selectedAppId, setSelectedAppId] = useState<string>(() => {
    const demo = applications.find((a) => a.applicationId === 'DEMO-EoA-2026-0142');
    return demo ? demo.id : applications[0]?.id || '';
  });

  const selectedApp = useMemo(() => {
    return applications.find((a) => a.id === selectedAppId || a.applicationId === selectedAppId) || applications[0];
  }, [applications, selectedAppId]);

  // 1. KPI Overview Calculations derived dynamically from shared context
  const totalCases = applications.length;
  const highPriorityCases = applications.filter((a) => a.priority === 'HIGH').length;
  const criticalFindings = applications.reduce(
    (acc, a) => acc + a.findings.filter((f) => f.severity === 'CRITICAL' && f.status !== 'RESOLVED').length,
    0
  );
  const averageScore = Math.round(
    applications.reduce((acc, a) => acc + a.riskScore, 0) / (applications.length || 1)
  );
  const casesAwaitingAction = applications.filter(
    (a) => a.status === 'PENDING_REVIEW' || a.status === 'VALIDATION_EXCEPTION'
  ).length;

  // 2. Prioritized Case Queue: Ordered descending by current riskScore, then by issueCount
  const prioritizedQueue = useMemo(() => {
    return [...applications].sort((a, b) => {
      if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
      return b.issueCount - a.issueCount;
    });
  }, [applications]);

  // 3. Visualization Data:
  // Risk Score Distribution: Low [0-39], Medium [40-69], High [70-100]
  const riskDistributionData = useMemo(() => {
    let low = 0;
    let med = 0;
    let high = 0;
    applications.forEach((a) => {
      if (a.riskScore >= 70) high++;
      else if (a.riskScore >= 40) med++;
      else low++;
    });
    return [
      { band: 'Low (0–39)', count: low, color: '#10B981' },
      { band: 'Medium (40–69)', count: med, color: '#F59E0B' },
      { band: 'High (70–100)', count: high, color: '#EF4444' },
    ];
  }, [applications]);

  // Application Status Distribution
  const statusPieData = useMemo(() => {
    const counts: Record<string, number> = {
      'Pending Review': 0,
      'Exceptions': 0,
      'Under AI Review': 0,
      'Verified': 0,
      'Recommended': 0,
    };
    applications.forEach((app) => {
      switch (app.status) {
        case 'PENDING_REVIEW':
          counts['Pending Review']++;
          break;
        case 'VALIDATION_EXCEPTION':
          counts['Exceptions']++;
          break;
        case 'UNDER_AI_REVIEW':
          counts['Under AI Review']++;
          break;
        case 'VERIFIED':
          counts['Verified']++;
          break;
        case 'APPROVAL_RECOMMENDED':
          counts['Recommended']++;
          break;
      }
    });
    return [
      { name: 'Pending Review', value: counts['Pending Review'], color: '#F59E0B' },
      { name: 'Exceptions', value: counts['Exceptions'], color: '#EF4444' },
      { name: 'Under AI Review', value: counts['Under AI Review'], color: '#3B82F6' },
      { name: 'Verified', value: counts['Verified'], color: '#10B981' },
      { name: 'Recommended', value: counts['Recommended'], color: '#6366F1' },
    ];
  }, [applications]);

  // Findings by Category
  const findingsByCategoryData = useMemo(() => {
    const map = new Map<string, number>();
    applications.forEach((app) => {
      app.findings.forEach((f) => {
        if (f.status !== 'RESOLVED') {
          map.set(f.category, (map.get(f.category) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries()).map(([category, count]) => ({
      category: category.replace('&', '+').replace('Mandatory', 'Mand.').replace('Infrastructure', 'Infra'),
      count,
    }));
  }, [applications]);

  // Outstanding vs Reviewed Findings
  const reviewStateData = useMemo(() => {
    let unreviewed = 0;
    let reviewed = 0;
    let resolved = 0;
    applications.forEach((a) => {
      a.findings.forEach((f) => {
        if (f.reviewState === 'RESOLVED') resolved++;
        else if (f.reviewState === 'REVIEWED') reviewed++;
        else unreviewed++;
      });
    });
    return [
      { name: 'Unreviewed Flags', value: unreviewed, color: '#EF4444' },
      { name: 'Inspected Flags', value: reviewed, color: '#3B82F6' },
      { name: 'Resolved Findings', value: resolved, color: '#10B981' },
    ];
  }, [applications]);

  // Timeline Trend
  const timelineTrendData = [
    { cycle: 'Day 1', avgRisk: 68, flaggedCases: 5 },
    { cycle: 'Day 2', avgRisk: 62, flaggedCases: 4 },
    { cycle: 'Day 3', avgRisk: 55, flaggedCases: 4 },
    { cycle: 'Day 4', avgRisk: 48, flaggedCases: 3 },
    { cycle: 'Day 5', avgRisk: averageScore, flaggedCases: casesAwaitingAction },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Risk Intelligence & Regulatory Insights
            </h1>
            <Badge variant="navy" size="sm" className="font-mono text-[11px]">
              Executive Telemetry
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            Portfolio-wide risk telemetry, deficiency category distributions, priority triage queues, and transparent scoring breakdowns.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Simulated Review-Priority Score — Not a fraud probability or final decision.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/applications/demo-eoa-0142/review')}
            className="gap-1.5 text-xs bg-blue-700 hover:bg-blue-800 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Inspect Primary Demo Case
          </Button>
        </div>
      </div>

      {/* 2. Five Risk Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Total Ingestion Cases"
          value={totalCases}
          description="Active portfolio dossiers"
          category="primary"
          icon={<Layers className="h-4 w-4 text-blue-600" />}
        />
        <MetricCard
          title="High-Priority Cases"
          value={highPriorityCases}
          change="Score ≥ 70"
          trend="down"
          category="danger"
          icon={<AlertOctagon className="h-4 w-4 text-rose-600" />}
        />
        <MetricCard
          title="Critical Findings"
          value={criticalFindings}
          change="Compulsory statutory norms"
          trend="down"
          category="warning"
          icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
        />
        <MetricCard
          title="Avg Review Score"
          value={`${averageScore}/100`}
          change="Weighted portfolio risk"
          trend="neutral"
          category="info"
          icon={<TrendingUp className="h-4 w-4 text-indigo-600" />}
        />
        <MetricCard
          title="Awaiting Officer Action"
          value={casesAwaitingAction}
          change="Pending decision sign-off"
          trend="neutral"
          category="warning"
          icon={<Clock className="h-4 w-4 text-amber-600" />}
        />
      </div>

      {/* 3. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score Distribution (4 cols) */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              Risk Priority Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Categorized by Low (0–39), Medium (40–69), and High (70–100) priority bands.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-60 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="band" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '11px' }}
                />
                <Bar dataKey="count" name="Applications" radius={[4, 4, 0, 0]}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status Distribution (4 cols) */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <PieIcon className="h-4 w-4 text-indigo-600" />
              Status Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Live status counts reflecting current persisted officer reviews.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-60 pt-2 flex items-center justify-center">
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '11px' }} />
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-lg font-bold text-slate-900">{totalCases}</span>
                <span className="text-[9px] uppercase font-semibold text-slate-400">Total Cases</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding vs Reviewed Findings (4 cols) */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Scrutiny Review Progress
            </CardTitle>
            <CardDescription className="text-xs">
              Audit status of individual regulatory flags across the portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-60 pt-2 flex flex-col justify-center space-y-3">
            {reviewStateData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{item.value} items</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: item.color,
                      width: `${Math.min(item.value * 12, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Findings by Category (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Findings by Regulatory Domain
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of outstanding non-compliance infractions across APH chapters.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={findingsByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '11px' }} />
                <Bar dataKey="count" name="Active Flags" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Trend Timeline (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Scrutiny Velocity & Risk De-escalation
            </CardTitle>
            <CardDescription className="text-xs">
              Average portfolio priority trend as officer reviews and resolutions are logged.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="cycle" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '11px' }} />
                <Area type="monotone" dataKey="avgRisk" name="Avg Priority Score" stroke="#1E3A8A" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. Prioritized Case Queue & Selected Risk Breakdown (Two-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prioritized Case Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold">Prioritized High-Touch Review Queue</CardTitle>
                  <CardDescription className="text-xs">
                    Ranked by current review-priority score and outstanding regulatory infractions.
                  </CardDescription>
                </div>
                <Badge variant="outline" size="sm" className="font-mono text-[11px]">
                  {prioritizedQueue.length} Cases Ranked
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Application ID</th>
                      <th className="py-2.5 px-3 font-semibold">Institution Name</th>
                      <th className="py-2.5 px-3 font-semibold">Priority & Score</th>
                      <th className="py-2.5 px-3 font-semibold">Flags</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prioritizedQueue.map((app) => {
                      const isSelected = app.id === selectedApp?.id;
                      const isPrimaryDemo = app.applicationId === 'DEMO-EoA-2026-0142';

                      return (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50/70 border-l-4 border-l-blue-600'
                              : 'hover:bg-slate-50/80'
                          } ${isPrimaryDemo && !isSelected ? 'bg-amber-50/20' : ''}`}
                        >
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>{app.applicationId}</span>
                              {isPrimaryDemo && (
                                <span className="rounded bg-amber-200/80 text-amber-900 px-1 text-[9px] font-bold">
                                  DEMO
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-3 max-w-[180px]">
                            <div className="font-semibold text-slate-900 truncate">
                              {app.institutionName}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {app.programType}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <RiskScoreBadge score={app.riskScore} />
                              <PriorityBadge priority={app.priority} />
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            {app.issueCount > 0 ? (
                              <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px]">
                                {app.issueCount} flags
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium text-[10px]">Clean</span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <StatusBadge status={app.status} />
                          </td>

                          <td className="py-3 px-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs px-2.5 font-medium text-blue-700 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/applications/${app.id}/review`);
                              }}
                            >
                              Workspace <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Selected Case Risk Explanation Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedApp ? (
            <Card className="border-t-4 border-t-blue-600 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                    {selectedApp.applicationId}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <RiskScoreBadge score={selectedApp.riskScore} />
                    <PriorityBadge priority={selectedApp.priority} />
                  </div>
                </div>
                <CardTitle className="text-sm font-bold text-slate-900 mt-2 truncate">
                  {selectedApp.institutionName}
                </CardTitle>
                <CardDescription className="text-xs">
                  Deterministic priority score arithmetic based on active regulatory infractions.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                {/* Contributing factors arithmetic list */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Active Penalty Factors
                  </span>

                  {(!selectedApp.riskBreakdown || selectedApp.riskBreakdown.length === 0) ? (
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-emerald-900">Zero active risk penalties</p>
                      <p className="text-[11px] text-emerald-700">All mandatory statutory requirements verified clean.</p>
                    </div>
                  ) : (
                    selectedApp.riskBreakdown.map((comp, idx) => {
                      const linkedFnd = selectedApp.findings.find((f) => f.id === comp.findingId);
                      const isResolved = linkedFnd?.reviewState === 'RESOLVED';

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border text-xs space-y-1 ${
                            comp.triggered && !isResolved
                              ? 'bg-rose-50/70 border-rose-200 text-rose-950 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{comp.factor}</span>
                            <span className="font-mono font-bold text-xs shrink-0">
                              {comp.triggered && !isResolved ? `+${comp.weight} pts` : '0 pts (Resolved)'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center justify-between">
                            <span>Condition: {comp.condition}</span>
                            <span className="font-mono text-[9px] uppercase font-bold px-1.5 rounded bg-white border border-slate-200">
                              {linkedFnd?.reviewState || (comp.triggered ? 'UNREVIEWED' : 'RESOLVED')}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Cumulative Score Total */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Cumulative Priority Index:</span>
                    <span className="font-mono text-sm text-blue-700">
                      {selectedApp.riskScore} / 100
                    </span>
                  </div>
                </div>

                {/* Score Policy Disclaimer */}
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Regulatory Protocol:</strong> High risk score signifies high triage priority for scrutiny officers, not proven misconduct. Resolving findings through documented evidence deducts risk in real time.
                  </div>
                </div>

                {/* Action button */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/applications/${selectedApp.id}/review`)}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-xs py-2 justify-between"
                >
                  <span>Open Full Scrutiny Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <p className="text-xs text-slate-400 italic">Select an application from the queue to view score breakdown.</p>
          )}
        </div>
      </div>
    </div>
  );
}
