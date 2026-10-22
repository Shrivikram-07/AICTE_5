import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/applications/StatusBadge';
import { PriorityBadge } from '@/components/applications/PriorityBadge';
import { RiskScoreBadge } from '@/components/applications/RiskScoreBadge';
import { CaseReviewDrawer } from '@/components/applications/CaseReviewDrawer';
import { ApplicationRecord } from '@/types';
import { useApplicationContext } from '@/context/ApplicationContext';
import {
  Search,
  RotateCcw,
  Download,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export function ApplicationsPage() {
  const navigate = useNavigate();
  const { applications } = useApplicationContext();
  const [searchParams] = useSearchParams();
  const { id: routeId } = useParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState<ApplicationRecord | null>(null);

  // Check if URL has id param or routeId to open case review immediately
  useEffect(() => {
    const targetId = routeId || searchParams.get('id');
    if (targetId) {
      const found = applications.find(
        (a) =>
          a.id.toLowerCase() === targetId.toLowerCase() ||
          a.applicationId.toLowerCase() === targetId.toLowerCase()
      );
      if (found) setSelectedCase(found);
    }
  }, [routeId, searchParams, applications]);

  const categories = useMemo(() => {
    const set = new Set(applications.map((a) => a.applicationCategory));
    return Array.from(set);
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        app.applicationId.toLowerCase().includes(q) ||
        app.institutionName.toLowerCase().includes(q) ||
        app.state.toLowerCase().includes(q) ||
        app.programType.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === 'ALL' || app.applicationCategory === categoryFilter;

      const matchesStatus =
        statusFilter === 'ALL' || app.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'ALL' || app.priority === priorityFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [applications, searchQuery, categoryFilter, statusFilter, priorityFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    categoryFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Institutional Applications Register
            </h1>
            <Badge variant="navy" size="sm">
              APH 2024–27
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Comprehensive register of technical institutions undergoing automated AI scrutiny and committee verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-slate-700"
            onClick={() => {
              alert('Exported synthetic applications list as CSV.');
            }}
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Dossiers
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5 text-xs shadow-sm bg-blue-700 hover:bg-blue-800"
            onClick={() => {
              navigate('/applications/demo-eoa-0142/review');
            }}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Inspect Primary Demo Case
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, name, region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Application Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Application Types</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Review Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Review Statuses</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="VALIDATION_EXCEPTION">Validation Exception</option>
              <option value="UNDER_AI_REVIEW">Under AI Review</option>
              <option value="VERIFIED">Verified</option>
              <option value="APPROVAL_RECOMMENDED">Approval Recommended</option>
            </select>

            {/* Priority */}
            <div className="flex items-center gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex-1 rounded-md border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 px-2 text-xs text-slate-500 hover:text-slate-900 shrink-0"
                  title="Reset all filters"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Result Count and Active Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredApplications.length}</strong> of{' '}
              <strong className="text-slate-800">{applications.length}</strong> total synthetic records
            </span>
            <span className="font-mono text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              DEMO DATASET · SIH26261
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          {filteredApplications.length === 0 ? (
            <div className="py-16 text-center">
              <AlertTriangle className="h-9 w-9 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No applications found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No institution dossiers match your active filter combinations. Try clearing search terms or selecting 'All'.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-4 text-xs"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Application Ref</th>
                    <th className="py-3 px-4 font-semibold">Institution Name</th>
                    <th className="py-3 px-4 font-semibold">Type & Program</th>
                    <th className="py-3 px-4 font-semibold">Risk & Priority</th>
                    <th className="py-3 px-4 font-semibold">Documents</th>
                    <th className="py-3 px-4 font-semibold">Review Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        app.applicationId === 'DEMO-EoA-2026-0142' ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Application Ref */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{app.applicationId}</span>
                          {app.applicationId === 'DEMO-EoA-2026-0142' && (
                            <span className="rounded bg-amber-200/70 text-amber-900 px-1 text-[9px] font-bold">
                              DEMO
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                          Submitted: {app.submissionDate}
                        </div>
                      </td>

                      {/* Institution */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 max-w-[240px] truncate">
                          {app.institutionName}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {app.state}
                        </div>
                      </td>

                      {/* Type & Program */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {app.applicationCategory}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[180px]">
                          {app.programType}
                        </div>
                      </td>

                      {/* Risk & Priority */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <RiskScoreBadge score={app.riskScore} />
                          <PriorityBadge priority={app.priority} />
                        </div>
                        {app.issueCount > 0 ? (
                          <div className="text-[10px] text-rose-600 font-medium mt-1">
                            {app.issueCount} deficiency flag(s)
                          </div>
                        ) : (
                          <div className="text-[10px] text-emerald-600 font-medium mt-1">
                            Checklist clean
                          </div>
                        )}
                      </td>

                      {/* Documents */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="font-semibold text-slate-900">
                          {app.documentsReviewed}
                        </span>{' '}
                        / {app.documentsCount}
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 mt-1">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${Math.round((app.documentsReviewed / app.documentsCount) * 100)}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Review Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
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

      {/* Case Review Drawer / Modal */}
      <CaseReviewDrawer
        application={selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  );
}
