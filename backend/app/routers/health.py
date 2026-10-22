from fastapi import APIRouter
from backend.app.schemas import SystemHealthSchema
from backend.app.config import settings
from backend.app.services.ocr_service import OCRService

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=SystemHealthSchema)
def get_health() -> SystemHealthSchema:
    ocr_available, ocr_info = OCRService.is_tesseract_available()
    return SystemHealthSchema(
        status="operational",
        version="1.0.0",
        ocrAvailable=ocr_available,
        ocrEngineInfo=ocr_info,
        pypdfAvailable=True,
        uploadDir=str(settings.UPLOAD_DIR),
        maxFileSizeMb=settings.MAX_FILE_SIZE_MB,
        evaluationCycle=settings.CURRENT_ACADEMIC_CYCLE,
        supportedFormats=settings.ALLOWED_EXTENSIONS,
    )
