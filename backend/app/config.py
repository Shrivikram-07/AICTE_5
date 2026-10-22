import os
from pathlib import Path
from typing import List, Set
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    PROJECT_NAME: str = "AICTE Intelligence Verification API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    UPLOAD_DIR: Path = UPLOAD_DIR
    MAX_FILE_SIZE_MB: int = 15
    MAX_FILE_SIZE_BYTES: int = 15 * 1024 * 1024
    ALLOWED_EXTENSIONS: Set[str] = {".pdf", ".png", ".jpg", ".jpeg", ".tiff"}
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ]
    CURRENT_ACADEMIC_CYCLE: str = "Academic Year 2026–2027"
    EVALUATION_CYCLE_YEAR: int = 2026

settings = Settings()
