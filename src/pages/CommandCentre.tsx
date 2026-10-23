import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  AlertOctagon,
  Clock,
  Layers,
  Search,
  RotateCcw,
  FileSpreadsheet,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { StatusDistributionChart } from '@/components/dashboard/StatusDistributionChart';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { IssueCategoryList } from '@/components/dashboard/IssueCategoryList';
import { StatusBadge } from '@/components/applications/StatusBadge';
import { PriorityBadge } from '@/components/applications/PriorityBadge';
import { RiskScoreBadge } from '@/components/applications/RiskScoreBadge';
import { CaseReviewDrawer } from '@/components/applications/CaseReviewDrawer';
import { getSummaryMetrics } from '@/data/mockData';
import { ApplicationRecord } from '@/types';
import { useApplicationContext } from '@/context/ApplicationContext';

export function CommandCentre() {
  const navigate = useNavigate();
  const { applications } = useApplicationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedCase, setSelectedCase] = useState<ApplicationRecord | null>(null);

  // Derive summary metrics dynamically from shared context
  const metrics = useMemo(() => getSummaryMetrics(applications), [applications]);

  // Primary showcase demonstration case (Meridian Institute of Technology)
  const primaryCase = useMemo(() => {
    return (
      applications.find(
        (a) => a.id === 'demo-eoa-0142' || a.applicationId === 'DEMO-EoA-2026-0142'
      ) || applications[0]
    );
  }, [applications]);

  // Filtered priority queue records
  const filteredQueue = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        app.applicationId.toLowerCase().includes(q) ||
        app.institutionName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || app.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'ALL' || app.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [applications, searchQuery, statusFilter, priorityFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* 1. Header & Subtitle with Discreet Prototype Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Regulatory Command Centre
            </h1>
            <Badge variant="navy" size="sm" className="font-mono text-[11px]">
              SIH26261 Prototype
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            Assisting regulatory scrutiny committees with institutional application validation, forensic document verification, and Approval Process Handbook (APH) compliance review.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Demo Environment · Synthetic Data Engine
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500">
              APH Standard: <strong className="text-slate-700">2024–2027 (Rev 3)</strong>
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-slate-700 hover:text-slate-900"
            onClick={() => {
              alert('Exported synthetic scrutiny registry summary (CSV).');
            }}
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
            Export Summary
          </Button>
          <Button
            variant="specular"
            size="sm"
            className="gap-1.5 text-xs shadow-md"
            onClick={() => {
              navigate('/applications/demo-eoa-0142/review');
            }}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Inspect Primary Demo Case
          </Button>
        </div>
      </div>

      {/* 2. Five Polished Metric Cards (Derivation from shared context) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Total Applications"
          value={metrics.totalApplications}
          description="In active intake cycle"
          category="primary"
          icon={<Layers className="h-4 w-4 text-blue-600" />}
        />
        <MetricCard
          title="Pending Review"
          value={metrics.pendingReview}
          change="Awaiting officer sign-off"
          trend="neutral"
          category="warning"
          icon={<Clock className="h-4 w-4 text-amber-600" />}
        />
        <MetricCard
          title="Validation Exceptions"
          value={metrics.validationExceptions}
          change="Deficits flagged"
          trend="down"
          category="danger"
          icon={<AlertOctagon className="h-4 w-4 text-rose-600" />}
        />
        <MetricCard
          title="High-Priority Cases"
          value={metrics.highPriorityCases}
          change="Risk index ≥ 70"
          trend="down"
          category="warning"
          icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
        />
        <MetricCard
          title="Documents Reviewed"
          value={`${metrics.documentsReviewed}`}
          change={`${metrics.reviewProgressRate}% total progress`}
          trend="up"
          category="success"
          icon={<FileCheck2 className="h-4 w-4 text-emerald-600" />}
        />
      </div>

      {/* Featured Demonstration Spotlight: Meridian Institute of Technology */}
      {primaryCase && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-white to-blue-50/60 p-5 sm:p-6 shadow-sm">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  PRIMARY DEMONSTRATION CASE · SIH26261
                </span>
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  {primaryCase.applicationId}
                </span>
                <StatusBadge status={primaryCase.status} />
                <PriorityBadge priority={primaryCase.priority} />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  {primaryCase.institutionName}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {primaryCase.programType} · {primaryCase.state} · Regulatory Cycle:{' '}
                  <strong className="text-slate-800 font-semibold">{primaryCase.applicationCategory} (AY 2026–27)</strong>
                </p>
              </div>

              {/* Key Active Findings Pill Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {primaryCase.findings
                  .filter((f) => f.reviewState !== 'RESOLVED')
                  .slice(0, 3)
                  .map((f) => (
                    <span
                      key={f.id}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/90 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded shadow-2xs"
                    >
                      <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                      <span className="truncate max-w-[220px]">{f.title}</span>
                      <span className="font-mono text-[10px] text-rose-700 font-bold">+{f.riskWeight}</span>
                    </span>
                  ))}
                {primaryCase.findings.filter((f) => f.reviewState !== 'RESOLVED').length > 3 && (
                  <span className="text-[11px] text-slate-500 font-medium">
                    +{primaryCase.findings.filter((f) => f.reviewState !== 'RESOLVED').length - 3} more regulatory flags
                  </span>
                )}
                {primaryCase.findings.filter((f) => f.reviewState !== 'RESOLVED').length === 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    All flagged findings resolved by scrutiny committee
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Score & Fast Action Buttons */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Composite Risk Score
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {primaryCase.riskScore >= 70
                      ? 'High Scrutiny Attention'
                      : primaryCase.riskScore >= 40
                      ? 'Moderate Scrutiny'
                      : 'Low Risk / Standard'}
                  </span>
                </div>
                <RiskScoreBadge score={primaryCase.riskScore} />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white text-slate-700 hover:text-slate-900 border-slate-300 shadow-2xs"
                  onClick={() => setSelectedCase(primaryCase)}
                >
                  Quick Drawer
                </Button>
                <Button
                  variant="specular"
                  size="sm"
                  className="text-xs font-semibold gap-1.5 shadow-md"
                  onClick={() => navigate(`/applications/${primaryCase.id}/review`)}
                >
                  <span>Launch Scrutiny Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Analytics Section: Recharts Trend & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Application Ingestion & Scrutiny Velocity</CardTitle>
              <CardDescription>
                7-day operational pace comparing intake packages versus AI automated verifications.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-blue-900">
                <span className="h-2.5 w-2.5 rounded-sm bg-blue-900" />
                Received Dossiers
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
                AI-Validated
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <TrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Application Status Breakdown</CardTitle>
            <CardDescription>
              Direct derivation across all {metrics.totalApplications} intake records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusDistributionChart applications={applications} />
          </CardContent>
        </Card>
      </div>

      {/* 4. Priority Review Queue */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Priority Regulatory Review Queue</CardTitle>
                <Badge variant="outline" size="sm" className="font-mono text-[11px]">
                  {filteredQueue.length} of {metrics.totalApplications} records
                </Badge>
              </div>
              <CardDescription>
                High-touch application queue ordered by risk score and deficiency severity.
              </CardDescription>
            </div>

            {/* Queue Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by ID or institute..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="VALIDATION_EXCEPTION">Validation Exception</option>
                <option value="UNDER_AI_REVIEW">Under AI Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="APPROVAL_RECOMMENDED">Approval Recommended</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              {(searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 px-2 text-xs text-slate-500 hover:text-slate-800"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredQueue.length === 0 ? (
            <div className="py-14 px-4 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                No Applications Match Your Active Criteria
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {searchQuery
                  ? `Zero records match query "${searchQuery}" with status "${statusFilter}" and priority "${priorityFilter}".`
                  : `No applications found with status "${statusFilter}" and priority "${priorityFilter}".`}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs gap-1.5 shadow-2xs"
                >
                  <RotateCcw className="h-3 w-3 text-slate-500" />
                  Reset Queue Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Application ID</th>
                    <th className="py-2.5 px-4 font-semibold">Institution Name</th>
                    <th className="py-2.5 px-4 font-semibold">Application Type</th>
                    <th className="py-2.5 px-4 font-semibold">Review Status</th>
                    <th className="py-2.5 px-4 font-semibold">Risk Score</th>
                    <th className="py-2.5 px-4 font-semibold">Issue Count</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQueue.map((app) => (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        app.applicationId === 'DEMO-EoA-2026-0142' ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{app.applicationId}</span>
                          {app.applicationId === 'DEMO-EoA-2026-0142' && (
                            <span className="rounded bg-amber-200/70 text-amber-900 px-1 text-[9px] font-bold">
                              DEMO
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {app.state}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 truncate max-w-[240px]">
                          {app.institutionName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {app.programType}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {app.applicationCategory}
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <RiskScoreBadge score={app.riskScore} />
                          <PriorityBadge priority={app.priority} />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {app.issueCount > 0 ? (
                          <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                            {app.issueCount} flags
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium text-[11px]">
                            0 flags
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2 text-slate-600 hover:text-slate-900"
                            onClick={() => setSelectedCase(app)}
                            title="Quick View Drawer"
                          >
                            Quick View
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="h-7 text-xs px-2.5 font-medium bg-blue-700 hover:bg-blue-800"
                            onClick={() => navigate(`/applications/${app.id}/review`)}
                          >
                            Review Workspace <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Bottom Two-Column: Issue Category Summary & Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Regulatory Issue Category Summary</CardTitle>
              <Badge variant="outline" size="sm">
                Aggregated Findings
              </Badge>
            </div>
            <CardDescription>
              Discrepancies cataloged across land, faculty, affiliation, and document checklists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IssueCategoryList applications={applications} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Scrutiny Activity Timeline</CardTitle>
              <span className="text-[11px] font-mono text-slate-400">
                Live Audit Stream
              </span>
            </div>
            <CardDescription>
              Chronological log of automated checks, anomaly escalations, and officer sign-offs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline />
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer Card at bottom */}
      <div className="rounded-xl border border-slate-200 bg-slate-100/60 p-4 text-xs text-slate-600 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Smart India Hackathon Prototype Notice (Problem Statement SIH26261):</strong>{' '}
          All applications, institutions, document forensic flags, and compliance checks displayed in this interface are synthetic demonstration records. This prototype illustrates architectural feasibility for AI-assisted technical education scrutiny and does not constitute official AICTE verification or live external registry integration.
        </div>
      </div>

      {/* Case Review Drawer / Modal */}
      <CaseReviewDrawer
        application={selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  );
}
