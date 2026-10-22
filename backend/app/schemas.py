from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ExtractedFieldSchema(BaseModel):
    label: str
    value: str
    confidence: Optional[float] = 1.0
    isFlagged: Optional[bool] = False
    highlightNote: Optional[str] = None

class ValidationCheckSchema(BaseModel):
    id: str
    name: str
    status: str # PASS | FAIL | WARNING | SKIPPED
    detail: str

class DocumentUploadResponse(BaseModel):
    id: str
    name: str
    documentType: str
    category: str
    uploadDate: str
    status: str # VERIFIED | FLAGGED | MISSING | MANUAL_INSPECTION | OFFLINE_STANDBY
    fileSize: str
    fileSizeBytes: int
    pagesCount: int
    fileHash: str
    mimeType: str
    applicationId: Optional[str] = None
    issuingAuthority: Optional[str] = None
    referenceNumber: Optional[str] = None
    validityWindow: Optional[str] = None
    extractedIntakeValue: Optional[int] = None
    extractedFields: List[ExtractedFieldSchema] = []
    validationChecks: List[ValidationCheckSchema] = []
    associatedFindingIds: List[str] = []
    rawTextExcerpt: Optional[str] = None
    processingTimeMs: int = 0
    ocrEngineUsed: Optional[str] = None
    isScanned: bool = False
    hasVisualAnomaly: bool = False
    anomalyDetails: Optional[str] = None
    duplicateHashDetected: bool = False
    findingsGenerated: List[Dict[str, Any]] = []

class DocumentDetailSchema(DocumentUploadResponse):
    fullRawText: Optional[str] = None
    downloadUrl: str

class CrossDocumentVerificationRequest(BaseModel):
    applicationId: str
    documentIds: Optional[List[str]] = None

class CrossDocumentVerificationResponse(BaseModel):
    applicationId: str
    documentsAnalyzedCount: int
    hasMismatch: bool
    comparedIntakes: List[Dict[str, Any]] = []
    validationChecks: List[ValidationCheckSchema] = []
    findingsGenerated: List[Dict[str, Any]] = []

class SystemHealthSchema(BaseModel):
    status: str
    version: str
    ocrAvailable: bool
    ocrEngineInfo: str
    pypdfAvailable: bool
    uploadDir: str
    maxFileSizeMb: int
    evaluationCycle: str
    supportedFormats: List[str]
