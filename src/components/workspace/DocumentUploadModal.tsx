import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Server,
  X,
  ShieldAlert,
  ArrowRight,
  FileCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  checkBackendHealth,
  uploadDocumentApi,
  DocumentUploadResponseDto,
  BackendHealth,
  API_BASE_URL,
} from '@/lib/api';
import { useApplicationContext } from '@/context/ApplicationContext';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  institutionName: string;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  applicationId,
  institutionName,
}: DocumentUploadModalProps) {
  const { addUploadedDocument } = useApplicationContext();

  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>('Affiliation & Approvals');
  const [documentType, setDocumentType] = useState<string>('University Affiliation Order');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<DocumentUploadResponseDto | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Probe backend health on mount and open
  useEffect(() => {
    if (isOpen) {
      checkBackendHealth().then((health) => {
        setBackendHealth(health);
      });
    }
  }, [isOpen]);

  // Reset state when modal closes
  const handleClose = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setUploadError(null);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    setUploadResult(null);

    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.tiff'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      setUploadError(`Unsupported file format. Please upload a PDF or image (${allowed.join(', ')}).`);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File exceeds 15 MB limit.');
      return;
    }

    setSelectedFile(file);

    // Auto-detect sensible document type name
    const stem = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setDocumentType(stem.charAt(0).toUpperCase() + stem.slice(1));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Quick load of sample demonstration documents
  const loadSampleDoc = async (filename: string, sampleCategory: string, sampleDocType: string) => {
    try {
      setUploadError(null);
      setUploadResult(null);
      setUploadStage('Fetching sample PDF from backend repository...');
      const res = await fetch(`${API_BASE_URL}/documents/samples/file/${filename}`);
      if (!res.ok) throw new Error('Sample document could not be retrieved from server.');
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'application/pdf' });
      setSelectedFile(file);
      setCategory(sampleCategory);
      setDocumentType(sampleDocType);
      setUploadStage('');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to load sample document.');
      setUploadStage('');
    }
  };

  // Perform genuine backend processing
  const handleProcessUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      setUploadStage('1/4: Ingesting file & verifying magic header bytes...');
      await new Promise((r) => setTimeout(r, 250));

      setUploadStage('2/4: Extracting digital stream & inspecting raster typography...');
      await new Promise((r) => setTimeout(r, 300));

      setUploadStage('3/4: Parsing domain entities (Order No, AY, Expiry, Intake, Land)...');
      const response = await uploadDocumentApi(
        selectedFile,
        category,
        documentType,
        applicationId
      );

      setUploadStage('4/4: Evaluating APH 2024–27 regulatory compliance rules...');
      await new Promise((r) => setTimeout(r, 250));

      setUploadResult(response);
      setUploadStage('');
    } catch (err: any) {
      setUploadError(err.message || 'Verification engine failed to parse document.');
    } finally {
      setIsUploading(false);
    }
  };

  // Commit evidence to application context
  const handleCommitToApplication = () => {
    if (!uploadResult) return;
    addUploadedDocument(applicationId, uploadResult);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center shadow-sm">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">
                  Upload & Verify Regulatory Evidence
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                  SIH26261 Real Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Application: <span className="font-semibold text-slate-700">{applicationId}</span> · {institutionName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Backend health status badge */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                backendHealth?.isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={backendHealth?.ocrEngineInfo || 'Backend status'}
            >
              <Server className="w-3.5 h-3.5" />
              <span>
                {backendHealth?.isOnline ? 'FastAPI Connected (Port 8000)' : 'FastAPI Offline'}
              </span>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workflow Progress Stepper (Uploaded -> Processing -> Processed / Partially Processed / Failed) */}
        <div className="bg-slate-100/80 px-6 py-2.5 border-b border-slate-200">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 max-w-xl mx-auto">
            <div className={`flex items-center gap-1.5 ${selectedFile ? 'text-indigo-900 font-bold' : 'text-slate-700'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                selectedFile ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-300 text-slate-700'
              }`}>1</span>
              <span>Select</span>
            </div>

            <div className={`h-0.5 w-6 sm:w-12 ${selectedFile ? 'bg-indigo-500' : 'bg-slate-300'}`} />

            <div className={`flex items-center gap-1.5 ${isUploading || uploadResult ? 'text-indigo-900 font-bold' : selectedFile ? 'text-indigo-700' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                uploadResult ? 'bg-emerald-600 text-white' : isUploading ? 'bg-indigo-600 text-white animate-pulse' : selectedFile ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-slate-200 text-slate-400'
              }`}>2</span>
              <span>Uploaded</span>
            </div>

            <div className={`h-0.5 w-6 sm:w-12 ${uploadResult ? 'bg-emerald-500' : isUploading ? 'bg-indigo-400' : 'bg-slate-300'}`} />

            <div className={`flex items-center gap-1.5 ${isUploading ? 'text-indigo-900 font-bold' : uploadResult ? 'text-emerald-900 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                uploadResult ? 'bg-emerald-600 text-white' : isUploading ? 'bg-indigo-600 text-white animate-spin' : 'bg-slate-200 text-slate-400'
              }`}>3</span>
              <span>Processing</span>
            </div>

            <div className={`h-0.5 w-6 sm:w-12 ${uploadResult ? 'bg-emerald-500' : 'bg-slate-300'}`} />

            <div className={`flex items-center gap-1.5 ${uploadResult ? 'text-emerald-900 font-bold' : uploadError ? 'text-rose-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                uploadResult
                  ? uploadResult.status === 'VERIFIED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                  : uploadError
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-200 text-slate-400'
              }`}>4</span>
              <span>
                {uploadResult
                  ? uploadResult.status === 'VERIFIED'
                    ? 'Processed (Clean)'
                    : uploadResult.status === 'FLAGGED'
                    ? 'Processed (Deficiencies)'
                    : 'Partially Processed'
                  : uploadError
                  ? 'Failed'
                  : 'Processed'}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Offline Warning Banner */}
          {backendHealth && !backendHealth.isOnline && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">FastAPI Verification Server Not Detected</p>
                <p className="text-amber-800 mt-0.5">
                  The Python document verification service must be running at <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">http://127.0.0.1:8000</code>.
                  Launch it in terminal via <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000</code>.
                </p>
              </div>
            </div>
          )}

          {!uploadResult ? (
            <>
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.tiff"
                  onChange={handleFileChange}
                />

                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3 shadow-inner">
                  {selectedFile ? (
                    <FileCheck className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB · Ready for OCR & rule verification
                    </p>
                    <span className="inline-block mt-2 text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Click or drag a different file to replace
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Drag and drop official regulatory document here, or <span className="text-indigo-600 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports high-resolution digital PDFs, scanned documents, and statutory orders (Max 15 MB)
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-3 text-[11px] text-slate-400 font-mono">
                      <span>.PDF</span>
                      <span>·</span>
                      <span>.PNG</span>
                      <span>·</span>
                      <span>.JPG</span>
                      <span>·</span>
                      <span>.TIFF</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Regulatory Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  >
                    <option value="Affiliation & Approvals">Affiliation & Approvals</option>
                    <option value="Mandatory Documentation">Mandatory Documentation</option>
                    <option value="Academic & Seat Intake">Academic & Seat Intake</option>
                    <option value="Land & Infrastructure">Land & Infrastructure</option>
                    <option value="Visual & Forensic Analysis">Visual & Forensic Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Document Type Title
                  </label>
                  <input
                    type="text"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    placeholder="e.g. University Affiliation Order"
                    className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                </div>
              </div>

              {/* Sample Documents Test Bench */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Quick Test Bench · Seeded Synthetic Demonstration Fixtures</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Pre-generated test PDFs structured to APH 2024–27 specifications
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      loadSampleDoc(
                        'affiliation_order_valid_2026.pdf',
                        'Affiliation & Approvals',
                        'University Affiliation Order AY 2026-27'
                      )
                    }
                    className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors flex items-start space-x-2"
                  >
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-slate-800">Valid Affiliation Order (AY 2026-27)</p>
                        <span className="text-[9px] font-bold px-1 rounded bg-slate-100 text-slate-600">SYNTHETIC</span>
                      </div>
                      <p className="text-[11px] text-slate-500">420 Intake · 7.82 Acres · APH Clause 2.4.1 Compliant</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      loadSampleDoc(
                        'affiliation_order_expired_2024.pdf',
                        'Affiliation & Approvals',
                        'Expired Affiliation Certificate AY 2024-25'
                      )
                    }
                    className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50/40 transition-colors flex items-start space-x-2"
                  >
                    <span className="text-red-600 font-bold shrink-0 mt-0.5">⚠️</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-slate-800">Expired Affiliation (AY 2024-25)</p>
                        <span className="text-[9px] font-bold px-1 rounded bg-rose-100 text-rose-700">SYNTHETIC</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Triggers Expired Clause Deficiency (+25 Risk Score)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      loadSampleDoc(
                        'intake_approval_discrepancy_360.pdf',
                        'Academic & Seat Intake',
                        'State Admission Committee Intake Order'
                      )
                    }
                    className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 transition-colors flex items-start space-x-2"
                  >
                    <span className="text-amber-600 font-bold shrink-0 mt-0.5">⚠️</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-slate-800">Intake Discrepancy (360 Seats)</p>
                        <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-700">SYNTHETIC</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Triggers Intake Delta Discrepancy (+18 Risk Score)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      loadSampleDoc(
                        'fire_safety_noc_compliant.pdf',
                        'Mandatory Documentation',
                        'Municipal Fire Safety NOC'
                      )
                    }
                    className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors flex items-start space-x-2"
                  >
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-slate-800">Fire Safety NOC (Valid 2027)</p>
                        <span className="text-[9px] font-bold px-1 rounded bg-slate-100 text-slate-600">SYNTHETIC</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Certified Hydrant & Wet Riser System · APH § 5.1.2</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                  <AlertOctagon className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Progress State */}
              {isUploading && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
                    <span className="flex items-center space-x-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span>Processing Document via Python Engine...</span>
                    </span>
                    <span className="font-mono text-[11px]">Port 8000</span>
                  </div>
                  <p className="text-xs text-indigo-700">{uploadStage}</p>
                  <div className="w-full bg-indigo-200/60 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Upload & Verification Results Inspection Panel */
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Status Header */}
              <div
                className={`p-4 rounded-xl border flex items-start justify-between ${
                  uploadResult.status === 'VERIFIED'
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : uploadResult.status === 'FLAGGED'
                    ? 'bg-red-50/70 border-red-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {uploadResult.status === 'VERIFIED' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : uploadResult.status === 'FLAGGED' ? (
                      <AlertOctagon className="w-6 h-6 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        Document Ingested & Evaluated: {uploadResult.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          uploadResult.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : uploadResult.status === 'FLAGGED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {uploadResult.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      Engine: <code className="font-mono bg-white/70 px-1 py-0.5 rounded text-slate-800">{uploadResult.ocrEngineUsed}</code> · Processing Time:{' '}
                      <span className="font-semibold">{uploadResult.processingTimeMs} ms</span> · Pages: {uploadResult.pagesCount} ({uploadResult.fileSize})
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      SHA-256 Hash: {uploadResult.fileHash.slice(0, 24)}...
                    </p>
                  </div>
                </div>
              </div>

              {/* Extracted Compliance Fields */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-navy-800" />
                  <span>Extracted Domain Entities ({uploadResult.extractedFields.length})</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {uploadResult.extractedFields.map((field, idx) => {
                    const isAvailable =
                      field.value &&
                      field.value.trim() !== '' &&
                      field.value.toLowerCase() !== 'not detected' &&
                      field.value.toLowerCase() !== 'none' &&
                      field.value.toLowerCase() !== 'n/a';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs ${
                          field.isFlagged
                            ? 'bg-red-50/60 border-red-200'
                            : 'bg-white border-slate-200 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-slate-500 mb-1">
                          <span className="font-semibold text-slate-700">{field.label}</span>
                          {field.isFlagged ? (
                            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                              {field.highlightNote || 'Flagged'}
                            </span>
                          ) : isAvailable ? (
                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Extracted
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Review Needed
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-slate-900 break-words">
                          {isAvailable ? (
                            <span>{field.value}</span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px] flex items-center gap-1 font-sans">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                              Unavailable / Requires Officer Review
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Validation Engine Checks */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-navy-800" />
                  <span>Rule Verification Engine Checks ({uploadResult.validationChecks.length})</span>
                </h4>

                <div className="rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs bg-white">
                  {uploadResult.validationChecks.map((chk) => (
                    <div key={chk.id} className="p-3 flex items-start space-x-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 shrink-0 ${
                          chk.status === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : chk.status === 'FAIL'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {chk.status}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800">{chk.name}</div>
                        <div className="text-slate-600 text-[11px] mt-0.5">{chk.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Findings Alert */}
              {uploadResult.findingsGenerated && uploadResult.findingsGenerated.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-red-900">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>
                      {uploadResult.findingsGenerated.length} Deficiency Finding(s) Generated from Document
                    </span>
                  </div>
                  {uploadResult.findingsGenerated.map((fnd, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white border border-red-100 text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-red-800">{fnd.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                          +{fnd.riskWeight} Risk Weight
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">{fnd.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500">
            {uploadResult ? (
              <span>Ready to attach evidence to institutional docket.</span>
            ) : selectedFile ? (
              <span>File loaded: {selectedFile.name}</span>
            ) : (
              <span>Select or load a file to begin verification.</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            {!uploadResult ? (
              <button
                type="button"
                disabled={!selectedFile || isUploading}
                onClick={handleProcessUpload}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Verification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCommitToApplication}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm flex items-center space-x-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Attach Evidence & Update Risk Score</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
