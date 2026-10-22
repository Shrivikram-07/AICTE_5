import { ApplicationRecord } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Fingerprint,
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Clock,
  Sparkles,
} from 'lucide-react';

interface VerificationTabProps {
  application: ApplicationRecord;
  onInspectDocumentById?: (docId: string) => void;
}

export function VerificationTab({
  application,
  onInspectDocumentById,
}: VerificationTabProps) {
  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-blue-950">Synthetic Forensic & Registry Integration Engine:</strong>{' '}
          Analyzing application <strong className="font-mono text-blue-950">{application.applicationId}</strong>. This panel displays simulated document tamper heuristics, electronic registrar seal cross-matching, and mock state trust registry verification under Problem Statement SIH26261.
        </div>
      </div>

      {/* Grid of Verification Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Visual Forensic & Tamper Inspection */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-sm">Document Forensic & Tamper Scan</CardTitle>
              </div>
              <Badge variant="warning">Manual Inspection Needed</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Heuristic neural scan examines document raster artifacts, localized JPEG compression disparity, and font baseline continuity across submitted deeds.
            </p>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-950 space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  Flagged Anomaly: Survey No. 142/A Deed
                </span>
                <span className="font-mono text-[10px] bg-amber-200/80 px-1.5 py-0.2 rounded font-bold">
                  Score: 0.82
                </span>
              </div>
              <p className="text-[11px] text-amber-900">
                Localized edge compression noise detected around the Tahsildar seal on Page 3. Scrutiny Officer visual inspection required to confirm physical revenue stamp.
              </p>
              {onInspectDocumentById && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 h-7 text-xs bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
                  onClick={() => onInspectDocumentById('doc-05')}
                >
                  Inspect Land Deed Page 3 →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pillar 2: Sponsoring Society & Trust Registry */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-sm">Public Trust & Society Registry</CardTitle>
              </div>
              <Badge variant="success">Registry Match Confirmed</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Cross-checks sponsoring trust legal title against state Charity Commissioner schemas and Society Registration Directorate records.
            </p>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-950 space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  Registration No. MH/2004/00188/P
                </span>
                <span className="font-mono text-[10px] bg-emerald-200/80 px-1.5 py-0.2 rounded font-bold">
                  ACTIVE TRUST
                </span>
              </div>
              <div className="text-[11px] text-emerald-900 space-y-0.5">
                <div>Entity: <strong>Meridian Educational & Charitable Trust</strong></div>
                <div>Charity Division: <strong>Pune Division (Entry E-1422)</strong></div>
                <div>Trustee PAN: <strong>AAATM4120E (Validated)</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pillar 3: Digital Signatures & University Seals */}
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm">Digital Signature Certificate (DSC) Audit</CardTitle>
              </div>
              <Badge variant="primary">Cryptographically Valid</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Validates x.509 certificates and PKI signatures embedded in university orders and institutional affidavits.
            </p>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">MSTU Registrar DSC:</span>
                <span className="text-emerald-700 font-bold">PASS (Valid Key)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">College Principal DSC:</span>
                <span className="text-emerald-700 font-bold">PASS (Class 3 DSC)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">OCSP Revocation Status:</span>
                <span className="text-slate-700">Good (Unrevoked)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pillar 4: External Gateways (NAD / Digilocker) */}
        <Card className="border-l-4 border-l-slate-400">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-sm">National Academic Depository (NAD)</CardTitle>
              </div>
              <Badge variant="outline">Offline Standby</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Automated faculty degree and diploma credential queries via Digilocker/NAD API gateways.
            </p>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5 text-slate-700 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                <Clock className="h-3.5 w-3.5" />
                Gateway Status: Simulated Offline Mode
              </div>
              <p className="text-slate-500">
                Direct live gateway connection is disabled in sandboxed prototype mode. Faculty qualification checks fall back to manual appointment order verification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
