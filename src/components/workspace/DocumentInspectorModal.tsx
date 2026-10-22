import { useState } from 'react';
import { ApplicationDocument, Finding } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  FileQuestion,
  Sparkles,
  Info,
  ExternalLink,
  ShieldCheck,
  FileCode,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface DocumentInspectorModalProps {
  document: ApplicationDocument | null;
  linkedFindings: Finding[];
  onClose: () => void;
  onOpenFinding?: (finding: Finding) => void;
}

export function DocumentInspectorModal({
  document,
  linkedFindings,
  onClose,
  onOpenFinding,
}: DocumentInspectorModalProps) {
  const [realDocTab, setRealDocTab] = useState<'stream' | 'text' | 'meta'>('stream');

  if (!document) return null;

  const isMissing = document.status === 'MISSING';
  const isRealUpload = !!document.isUploadedRealDoc;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-navy-950/70 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-navy-950 text-white p-4 sm:p-5 border-b border-navy-800 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {document.id.toUpperCase()}
              </span>
              <Badge
                variant={
                  isMissing
                    ? 'danger'
                    : document.status === 'FLAGGED'
                    ? 'warning'
                    : document.status === 'VERIFIED'
                    ? 'success'
                    : 'default'
                }
                size="sm"
              >
                {document.status.replace(/_/g, ' ')}
              </Badge>
              <span className="text-xs text-slate-300 font-medium">
                {document.documentType}
              </span>
            </div>
            <h2 className="mt-1.5 text-lg font-bold text-white tracking-tight">
              {document.name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              {document.issuingAuthority && (
                <span>Authority: <strong className="text-slate-200">{document.issuingAuthority}</strong></span>
              )}
              {document.referenceNumber && (
                <span>Ref: <strong className="text-slate-200 font-mono">{document.referenceNumber}</strong></span>
              )}
              {document.validityWindow && (
                <span>Validity: <strong className="text-slate-200">{document.validityWindow}</strong></span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-navy-800 hover:text-white transition-colors"
            aria-label="Close inspector"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Synthetic or Real Banner */}
        {isRealUpload ? (
          <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Genuine Ingested Evidence · Verified by Python Verification Engine (FastAPI)
            </span>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                Engine: {document.ocrEngineUsed || 'FastAPI'}
              </span>
              {document.fileHash && (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                  SHA-256: {document.fileHash.slice(0, 16)}...
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 px-5 py-2 border-b border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Simulated Document Intelligence · OCR text, layout analysis, and validation tags are synthetic demo representations.
            </span>
            <span className="font-mono text-[10px] text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded">
              SIH26261 Demo Mode
            </span>
          </div>
        )}

        {/* Modal Body: Two-Column Inspector */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Document Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-600" />
                Document Render View
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {isMissing ? 'Status: 0 KB (Omitted)' : `${document.fileSize || '2 MB'} · ${document.pagesCount || 1} Pages`}
              </span>
            </div>

            {isRealUpload ? (
              <div className="space-y-3">
                {/* Sub-Tabs for Real Document */}
                <div className="flex items-center gap-1.5 border-b border-slate-200 text-xs">
                  <button
                    onClick={() => setRealDocTab('stream')}
                    className={`pb-2 px-2.5 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
                      realDocTab === 'stream'
                        ? 'border-indigo-600 text-indigo-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>PDF File Stream</span>
                  </button>

                  <button
                    onClick={() => setRealDocTab('text')}
                    className={`pb-2 px-2.5 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
                      realDocTab === 'text'
                        ? 'border-indigo-600 text-indigo-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileCode className="h-3.5 w-3.5" />
                    <span>Raw Extracted Text</span>
                  </button>

                  <button
                    onClick={() => setRealDocTab('meta')}
                    className={`pb-2 px-2.5 font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
                      realDocTab === 'meta'
                        ? 'border-indigo-600 text-indigo-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Forensic Dossier</span>
                  </button>
                </div>

                {realDocTab === 'stream' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Live file stream served from FastAPI upload repository</span>
                      <a
                        href={`${API_BASE_URL}/documents/${document.id}/file`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                      >
                        <span>Open in new tab</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="rounded-xl border border-slate-300 overflow-hidden bg-slate-100 shadow-inner h-[500px]">
                      <iframe
                        src={`${API_BASE_URL}/documents/${document.id}/file`}
                        className="w-full h-full border-0"
                        title="Official Document Stream"
                      />
                    </div>
                  </div>
                )}

                {realDocTab === 'text' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Text character stream extracted via {document.ocrEngineUsed || 'Parser'}</span>
                      <span className="font-mono text-[11px] text-slate-600">
                        {(document.rawTextExcerpt || '').length} characters
                      </span>
                    </div>
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-y-auto max-h-[500px] whitespace-pre-wrap leading-relaxed shadow-inner">
                      {document.rawTextExcerpt || 'No raw characters extracted.'}
                    </div>
                  </div>
                )}

                {realDocTab === 'meta' && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Document Technical Characteristics
                    </h4>
                    <div className="divide-y divide-slate-100">
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Server Document ID:</span>
                        <span className="font-mono font-semibold text-slate-800">{document.id}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Original Filename:</span>
                        <span className="font-semibold text-slate-800">{document.name}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Extracted MIME Type:</span>
                        <span className="font-mono text-slate-800">{document.mimeType || 'application/pdf'}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">File Size:</span>
                        <span className="font-mono text-slate-800">{document.fileSize || 'N/A'}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Page Count:</span>
                        <span className="font-mono text-slate-800">{document.pagesCount || 1}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">SHA-256 Digest:</span>
                        <span className="font-mono text-[11px] text-slate-800 break-all">{document.fileHash || 'N/A'}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Processing Engine:</span>
                        <span className="font-mono text-indigo-700 font-semibold">{document.ocrEngineUsed || 'FastAPI'}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Visual Tamper Flag:</span>
                        <span className={`font-semibold ${document.hasVisualAnomaly ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {document.hasVisualAnomaly ? 'Anomaly Detected' : 'Passed Clean'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : isMissing ? (
              /* Missing Document Placeholder */
              <div className="rounded-xl border-2 border-dashed border-rose-300 bg-rose-50/40 p-8 text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                  <FileQuestion className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-rose-950">
                    Mandatory Statutory Dossier Missing
                  </h4>
                  <p className="text-xs text-rose-800 mt-1 max-w-md mx-auto leading-relaxed">
                    This document was not uploaded in the applicant's submission package. Under APH norms, this requirement is compulsory.
                  </p>
                </div>

                {document.missingDocumentDetails && (
                  <div className="text-left bg-white rounded-lg border border-rose-200 p-4 text-xs space-y-2">
                    <div>
                      <span className="font-bold text-slate-900">Required Document: </span>
                      <span className="text-slate-700">{document.missingDocumentDetails.requiredForm}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Statutory Norm Clause: </span>
                      <span className="font-mono text-blue-700">{document.missingDocumentDetails.handbookClause}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Instruction: </span>
                      <span className="text-slate-600">{document.missingDocumentDetails.instructions}</span>
                    </div>
                    <div className="pt-1 text-[11px] font-semibold text-rose-700">
                      Consequence: {document.missingDocumentDetails.consequences}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Document Simulated Sheet */
              <div className="rounded-lg border border-slate-300 bg-slate-50/70 p-6 shadow-inner font-sans space-y-4 text-xs text-slate-800">
                {document.samplePreviewText && (
                  <>
                    <div className="text-center pb-3 border-b border-slate-300">
                      <p className="font-serif font-bold text-sm tracking-wide text-slate-950 whitespace-pre-line">
                        {document.samplePreviewText.header}
                      </p>
                    </div>

                    <div className="space-y-3 py-2 leading-relaxed">
                      {document.samplePreviewText.bodyParagraphs.map((para, i) => (
                        <p
                          key={i}
                          className={`font-mono text-[11px] ${
                            para.includes('ANOMALY') || para.includes('Expired')
                              ? 'p-2 bg-amber-100/70 rounded border border-amber-300 text-amber-900 font-semibold'
                              : 'text-slate-700'
                          }`}
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    {document.samplePreviewText.anomalyCoordinates && (
                      <div className="rounded border border-amber-300 bg-amber-50 p-2.5 text-[11px] text-amber-900 font-mono flex items-center justify-between">
                        <span>Tamper Anomaly Tag: {document.samplePreviewText.anomalyCoordinates}</span>
                        <span className="text-rose-700 font-bold">Inspection Required</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Authenticated Signatures</div>
                        {document.samplePreviewText.signatures.map((sig, i) => (
                          <div key={i} className="font-serif italic text-xs text-slate-900 font-medium">
                            ✓ {sig}
                          </div>
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Official Registry Seals</div>
                        {document.samplePreviewText.stamps.map((stamp, i) => (
                          <div key={i} className="font-mono text-[10px] text-slate-600">
                            {stamp}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Extracted Fields & Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Extracted Fields */}
            <div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Extracted Data Fields ({document.extractedFields.length})
                </h3>
                <span className="text-[10px] text-slate-400">OCR Entities</span>
              </div>

              {document.extractedFields.length === 0 ? (
                <p className="mt-3 text-xs text-slate-400 italic">No fields extracted (file absent or unreadable).</p>
              ) : (
                <div className="mt-3 space-y-2.5">
                  {document.extractedFields.map((field, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs ${
                        field.isFlagged
                          ? 'border-amber-300 bg-amber-50/70 text-amber-950'
                          : 'border-slate-200 bg-white text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">{field.label}</span>
                        {field.isFlagged && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1 rounded">
                            Discrepancy
                          </span>
                        )}
                      </div>
                      <div className="mt-1 font-mono font-semibold text-xs">
                        {field.value}
                      </div>
                      {field.highlightNote && (
                        <div className="mt-1 text-[10px] text-amber-800">
                          {field.highlightNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Validation Checklist for this Document */}
            <div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Validation Checklist
                </h3>
              </div>

              <div className="mt-3 space-y-2">
                {document.validationChecks.map((chk) => (
                  <div
                    key={chk.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs flex items-start gap-2.5"
                  >
                    {chk.status === 'PASS' && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />}
                    {chk.status === 'FAIL' && <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
                    {chk.status === 'WARNING' && <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />}
                    {chk.status === 'SKIPPED' && <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{chk.name}</span>
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            chk.status === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : chk.status === 'FAIL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {chk.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600">{chk.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Findings */}
            {linkedFindings.length > 0 && (
              <div>
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Linked Regulatory Findings ({linkedFindings.length})
                  </h3>
                </div>

                <div className="mt-3 space-y-2">
                  {linkedFindings.map((fnd) => (
                    <div
                      key={fnd.id}
                      className="p-3 rounded-lg border border-rose-200 bg-rose-50/60 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-950">{fnd.title}</span>
                        <Badge variant="danger" size="sm">
                          {fnd.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-rose-900 leading-relaxed">
                        {fnd.description}
                      </p>
                      {onOpenFinding && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 h-6 text-[11px] bg-white text-rose-700 border-rose-300 hover:bg-rose-100"
                          onClick={() => onOpenFinding(fnd)}
                        >
                          Inspect Finding Details →
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Dossier ID: <strong className="font-mono text-slate-700">{document.id}</strong>
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done Inspecting
          </Button>
        </div>
      </div>
    </div>
  );
}
