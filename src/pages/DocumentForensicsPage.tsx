import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileSearch, ShieldCheck, Fingerprint } from 'lucide-react';

export function DocumentForensicsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Document Authenticity & Forensics
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          AI-driven stamp detection, digital signature verification, and document tamper analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <CardHeader className="p-0 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-sm">Stamp & Seal Verifier</CardTitle>
            </div>
            <CardDescription>
              Detects authentic registrar/sub-registrar seals on sale deeds.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Badge variant="success" size="sm">Operational (Synthetic)</Badge>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="p-0 pb-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-sm">Signature Cross-Check</CardTitle>
            </div>
            <CardDescription>
              Compares principal & trustee signatures across submissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Badge variant="primary" size="sm">Active Model</Badge>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="p-0 pb-3">
            <div className="flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-sm">Metadata & Font Splicing</CardTitle>
            </div>
            <CardDescription>
              Scans PDFs for spliced text, altered numbers, or manipulated EXIF tags.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Badge variant="outline" size="sm">Ready for Scan</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
