import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sliders, Shield } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Engine Configuration & Regulatory Rulebase
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Parameters controlling deficiency tolerance, handbook versions, and AI confidence thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-blue-600" />
              <CardTitle>Validation Thresholds</CardTitle>
            </div>
            <CardDescription>
              Configure scoring thresholds for risk flags and automated approval readiness.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-700 font-medium">High Risk Flag Sensitivity</span>
              <Badge variant="primary">Threshold ≥ 70</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-700 font-medium">Faculty Ratio Strictness</span>
              <Badge variant="default">Exact 1:15 or 1:20 per program</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-700 font-medium">Land Contiguity Tolerance</span>
              <Badge variant="default">0.00% Variance Allowed</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <CardTitle>Regulatory Handbook Version</CardTitle>
            </div>
            <CardDescription>
              Active AICTE Approval Process Handbook (APH) definitions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-700 font-medium">Current Active Handbook</span>
              <Badge variant="success">APH 2024-2027 (Rev 3)</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-700 font-medium">Problem Statement Mapping</span>
              <Badge variant="navy">SIH26261</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-700 font-medium">AI Agent Mock Mode</span>
              <Badge variant="warning">Enabled (Synthetic Demo)</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
