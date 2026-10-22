import { useState, useMemo } from 'react';
import { useApplicationContext } from '@/context/ApplicationContext';
import {
  VerificationRecord,
  VerificationResult,
} from '@/types';
import {
  getVerificationRecords,
  getVerificationSummaryMetrics,
  VERIFICATION_METHOD_META,
} from '@/lib/verificationData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VerificationDetailDrawer } from '@/components/verification/VerificationDetailDrawer';
import {
  ShieldCheck,
  Search,
  RotateCcw,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

export function VerificationCentrePage() {
  const { applications } = useApplicationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [appFilter, setAppFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);

  // Derive verification records and KPI summary reactively from shared applications context
  const records = useMemo(() => getVerificationRecords(applications), [applications]);
  const metrics = useMemo(() => getVerificationSummaryMetrics(records), [records]);

  // Unique applications in the verification ledger
  const appOptions = useMemo(() => {
    const map = new Map<string, string>();
    records.forEach((r) => map.set(r.applicationId, r.institutionName));
    return Array.from(map.entries());
  }, [records]);

  // Filtered queue
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        r.id.toLowerCase().includes(q) ||
        r.applicationId.toLowerCase().includes(q) ||
        r.institutionName.toLowerCase().includes(q) ||
        r.documentName.toLowerCase().includes(q) ||
        r.methodLabel.toLowerCase().includes(q);

      const matchesResult =
        resultFilter === 'ALL' || r.result === resultFilter;

      const matchesMethod =
        methodFilter === 'ALL' || r.method === methodFilter;

      const matchesApp =
        appFilter === 'ALL' || r.applicationId === appFilter;

      return matchesSearch && matchesResult && matchesMethod && matchesApp;
    });
  }, [records, searchQuery, resultFilter, methodFilter, appFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setResultFilter('ALL');
    setMethodFilter('ALL');
    setAppFilter('ALL');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    resultFilter !== 'ALL' ||
    methodFilter !== 'ALL' ||
    appFilter !== 'ALL';

  const getResultBadge = (result: VerificationResult) => {
    switch (result) {
      case 'MATCH_PASSED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Match Passed
          </span>
        );
      case 'MISMATCH_FLAGGED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
            <AlertOctagon className="h-3 w-3 text-rose-600" /> Mismatch Flagged
          </span>
        );
      case 'ANOMALY_DETECTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
            <AlertTriangle className="h-3 w-3 text-amber-600" /> Anomaly Flagged
          </span>
        );
      case 'SOURCE_UNAVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
            <Cpu className="h-3 w-3 text-slate-500" /> Source Standby
          </span>
        );
      case 'PENDING_MANUAL':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
            <Clock className="h-3 w-3 text-amber-600" /> Manual Check
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Regulatory Verification Centre
            </h1>
            <Badge variant="navy" size="sm" className="font-mono text-[11px]">
              Multi-Source Audits
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            Centralized operational dashboard verifying institutional credentials, university affiliation orders, revenue deeds, and digital seals under APH 2024–27.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Simulated Verification Framework · Sandbox Demonstration Mode
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500">
              Problem Statement: <strong className="text-slate-700">SIH26261</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const mitVrf = records.find((r) => r.applicationId === 'DEMO-EoA-2026-0142');
              if (mitVrf) setSelectedRecord(mitVrf);
            }}
            className="gap-1.5 text-xs text-slate-700"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Inspect Primary Case Record
          </Button>
        </div>
      </div>

      {/* 2. Five Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Total Verification Checks"
          value={metrics.totalChecks}
          description="Audits across active dossiers"
          category="primary"
          icon={<Layers className="h-4 w-4 text-blue-600" />}
        />
        <MetricCard
          title="Successful Matches"
          value={metrics.successfulMatches}
          change="Clean registry/signature checks"
          trend="up"
          category="success"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
        />
        <MetricCard
          title="Mismatches Flagged"
          value={metrics.mismatchesRequiringReview}
          change="Intake/expiry discrepancies"
          trend="down"
          category="danger"
          icon={<AlertOctagon className="h-4 w-4 text-rose-600" />}
        />
        <MetricCard
          title="Source Checks Unavailable"
          value={metrics.sourceChecksUnavailable}
          change="External gateway standby"
          trend="neutral"
          category="info"
          icon={<Cpu className="h-4 w-4 text-indigo-600" />}
        />
        <MetricCard
          title="Pending Manual Check"
          value={metrics.pendingManualVerification}
          change="Visual scan/OCSP review"
          trend="down"
          category="warning"
          icon={<Clock className="h-4 w-4 text-amber-600" />}
        />
      </div>

      {/* 3. Verification Methods Overview Grid */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Configured Verification Methods (APH 2024–27 Protocol)
              </CardTitle>
              <CardDescription className="text-xs">
                Automated multi-method checks executed for each institutional application dossier.
              </CardDescription>
            </div>
            <span className="font-mono text-[11px] text-slate-400">8 Standard Methods</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(VERIFICATION_METHOD_META).map(([key, meta]) => (
              <div
                key={key}
                onClick={() => setMethodFilter(key)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  methodFilter === key
                    ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 truncate">{meta.label}</span>
                  {methodFilter === key && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {meta.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Verification Queue Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Centralized Verification Operations Queue</CardTitle>
                <Badge variant="outline" size="sm" className="font-mono text-[11px]">
                  {filteredRecords.length} of {records.length} records
                </Badge>
              </div>
              <CardDescription>
                Auditable register of individual evidence evaluations with full traceability.
              </CardDescription>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative w-44 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search verification..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Result Filter */}
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Results</option>
                <option value="MATCH_PASSED">Match Passed</option>
                <option value="MISMATCH_FLAGGED">Mismatch Flagged</option>
                <option value="ANOMALY_DETECTED">Anomaly Flagged</option>
                <option value="SOURCE_UNAVAILABLE">Source Standby</option>
                <option value="PENDING_MANUAL">Pending Manual</option>
              </select>

              {/* Method Filter */}
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Methods</option>
                {Object.entries(VERIFICATION_METHOD_META).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.label}</option>
                ))}
              </select>

              {/* Application Filter */}
              <select
                value={appFilter}
                onChange={(e) => setAppFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none max-w-[160px] truncate"
              >
                <option value="ALL">All Applications</option>
                {appOptions.map(([appId, name]) => (
                  <option key={appId} value={appId}>
                    {appId} - {name}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 px-2 text-xs text-slate-500 hover:text-slate-900"
                  title="Reset filters"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredRecords.length === 0 ? (
            <div className="py-14 text-center">
              <AlertTriangle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No verification records found</p>
              <p className="text-xs text-slate-500 mt-1">
                No items match your selected filter criteria. Try clearing search keywords or selecting "All".
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-3 text-xs"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Verification ID</th>
                    <th className="py-2.5 px-4 font-semibold">Application Ref</th>
                    <th className="py-2.5 px-4 font-semibold">Institution Name</th>
                    <th className="py-2.5 px-4 font-semibold">Document / Target</th>
                    <th className="py-2.5 px-4 font-semibold">Method</th>
                    <th className="py-2.5 px-4 font-semibold">Evaluation Result</th>
                    <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((r) => {
                    const isPrimary = r.applicationId === 'DEMO-EoA-2026-0142';

                    return (
                      <tr
                        key={r.id}
                        className={`hover:bg-slate-50/80 transition-colors group ${
                          isPrimary ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {r.id}
                        </td>

                        <td className="py-3 px-4 font-mono font-medium text-slate-800">
                          <span className="flex items-center gap-1">
                            {r.applicationId}
                            {isPrimary && (
                              <span className="rounded bg-amber-200/80 text-amber-900 px-1 text-[9px] font-bold">
                                DEMO
                              </span>
                            )}
                          </span>
                        </td>

                        <td className="py-3 px-4 max-w-[200px]">
                          <div className="font-semibold text-slate-900 truncate">
                            {r.institutionName}
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-[220px]">
                          <div className="font-medium text-slate-800 truncate">
                            {r.targetChecked}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {r.documentName}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-700">
                          <span className="font-medium text-slate-800">{r.methodLabel}</span>
                        </td>

                        <td className="py-3 px-4">
                          {getResultBadge(r.result)}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {r.timestamp}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2.5 font-medium group-hover:border-blue-600 group-hover:text-blue-700 group-hover:bg-blue-50"
                            onClick={() => setSelectedRecord(r)}
                          >
                            Inspect Detail <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Protocol Notice */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-3">
        <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Operational Verification Integrity Protocol:</strong> All automated cross-checks reflect preliminary screening heuristics. Negative findings represent review flags for scrutiny committee inspection and are never treated as formal legal infractions without human adjudication.
        </div>
      </div>

      {/* Verification Detail Drawer */}
      <VerificationDetailDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
