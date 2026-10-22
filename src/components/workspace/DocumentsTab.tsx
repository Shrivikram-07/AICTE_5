import { useState, useMemo } from 'react';
import { ApplicationDocument } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  FileQuestion,
  CheckCircle2,
  Eye,
  Filter,
  Search,
  AlertOctagon,
  UploadCloud,
  FileCheck,
} from 'lucide-react';

interface DocumentsTabProps {
  documents: ApplicationDocument[];
  onInspectDocument: (doc: ApplicationDocument) => void;
  onUploadClick?: () => void;
}

export function DocumentsTab({ documents, onInspectDocument, onUploadClick }: DocumentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        doc.name.toLowerCase().includes(q) ||
        doc.documentType.toLowerCase().includes(q) ||
        (doc.issuingAuthority && doc.issuingAuthority.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'ALL' || doc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [documents, searchQuery, statusFilter]);

  const getStatusBadge = (status: ApplicationDocument['status']) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            <AlertOctagon className="h-3 w-3 text-rose-600" /> Flagged Deficit
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-900 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
            <FileQuestion className="h-3 w-3 text-rose-700" /> Mandatory Missing
          </span>
        );
      case 'MANUAL_INSPECTION':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <Eye className="h-3 w-3 text-amber-600" /> Manual Inspection
          </span>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <Card>
        <CardContent className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search document name, authority..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-slate-200 bg-white py-1 px-2.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Documents ({documents.length})</option>
              <option value="FLAGGED">Flagged</option>
              <option value="MISSING">Missing</option>
              <option value="MANUAL_INSPECTION">Manual Scrutiny</option>
              <option value="VERIFIED">Verified</option>
            </select>

            {onUploadClick && (
              <Button
                variant="primary"
                size="sm"
                className="h-8 text-xs px-3 font-semibold bg-navy-900 hover:bg-navy-800 text-white gap-1.5 shrink-0"
                onClick={onUploadClick}
              >
                <UploadCloud className="h-3.5 w-3.5 text-indigo-300" />
                <span>Upload Real Document</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => {
          const isMissing = doc.status === 'MISSING';

          return (
            <div
              key={doc.id}
              className={`rounded-xl border p-4 transition-all ${
                isMissing
                  ? 'border-rose-300 bg-rose-50/40 border-l-4 border-l-rose-600'
                  : doc.status === 'FLAGGED'
                  ? 'border-slate-200 bg-white border-l-4 border-l-rose-500 hover:shadow-md'
                  : doc.status === 'MANUAL_INSPECTION'
                  ? 'border-slate-200 bg-white border-l-4 border-l-amber-500 hover:shadow-md'
                  : 'border-slate-200 bg-white border-l-4 border-l-emerald-500 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isMissing
                        ? 'bg-rose-100 text-rose-700'
                        : doc.status === 'FLAGGED'
                        ? 'bg-rose-50 text-rose-600'
                        : doc.status === 'MANUAL_INSPECTION'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {isMissing ? (
                      <FileQuestion className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.2 rounded">
                        {doc.id.toUpperCase()}
                      </span>
                      {getStatusBadge(doc.status)}
                      {doc.isUploadedRealDoc && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 uppercase">
                          <FileCheck className="h-3 w-3 text-indigo-600" /> Real Upload
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500">
                        {doc.documentType}
                      </span>
                    </div>

                    <h4 className="mt-1 text-sm font-bold text-slate-900">
                      {doc.name}
                    </h4>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {doc.isUploadedRealDoc && doc.ocrEngineUsed && (
                        <span>Engine: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">{doc.ocrEngineUsed}</code></span>
                      )}
                      {doc.issuingAuthority && (
                        <span>Authority: <strong className="text-slate-700">{doc.issuingAuthority}</strong></span>
                      )}
                      {doc.validityWindow && (
                        <span>Validity: <strong className="text-slate-700">{doc.validityWindow}</strong></span>
                      )}
                      <span>Uploaded: <strong className="font-mono text-slate-700">{doc.uploadDate}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-3 font-semibold text-blue-700 hover:bg-blue-50 border-blue-200"
                    onClick={() => onInspectDocument(doc)}
                  >
                    {isMissing ? 'View Missing Prerequisite' : 'Inspect Dossier & OCR'}
                  </Button>
                </div>
              </div>

              {/* Extracted Fields Preview Strip */}
              {doc.extractedFields.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                  {doc.extractedFields.map((f, i) => (
                    <div
                      key={i}
                      className={`p-1.5 rounded border truncate ${
                        f.isFlagged ? 'bg-amber-50/70 border-amber-200 text-amber-950 font-medium' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{f.label}</span>
                      <span className="truncate block font-mono">{f.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
