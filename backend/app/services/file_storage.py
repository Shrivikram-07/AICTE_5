import os
import uuid
import hashlib
from pathlib import Path
from typing import Tuple, Dict, Any, Optional
from fastapi import UploadFile, HTTPException
from backend.app.config import settings

# File Magic byte signatures
MAGIC_SIGNATURES = {
    b"%PDF": "application/pdf",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"\xff\xd8\xff": "image/jpeg",
    b"II*\x00": "image/tiff",
    b"MM\x00*": "image/tiff",
}

class FileStorageService:
    @staticmethod
    def validate_file_signature(content: bytes, filename: str) -> str:
        """
        Validates actual file header bytes against declared extensions.
        Rejects executable binaries and masked files.
        """
        if not content or len(content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Security rejection: Uploaded file is empty (0 bytes)."
            )

        ext = Path(filename).suffix.lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Security rejection: Unsupported file extension '{ext}'. Allowed extensions: {', '.join(sorted(settings.ALLOWED_EXTENSIONS))}"
            )

        for signature, mime in MAGIC_SIGNATURES.items():
            if content.startswith(signature):
                return mime
        
        # Check if ext is .pdf and starts with %PDF anywhere in first 1024 bytes (some pdfs have leading whitespace/bom)
        if ext == ".pdf" and b"%PDF" in content[:1024]:
            return "application/pdf"
            
        raise HTTPException(
            status_code=400,
            detail=f"Security rejection: File header signature does not match any allowed format for '{ext}'. Only valid digital PDFs and JPEG/PNG images are accepted."
        )

    @staticmethod
    def save_upload_file(file: UploadFile, content: bytes) -> Dict[str, Any]:
        """
        Safely saves file with UUID, avoiding collision and path traversal.
        """
        filename = os.path.basename(file.filename or "uploaded_document")
        ext = Path(filename).suffix.lower()

        if len(content) > settings.MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB} MB."
            )

        mime_type = FileStorageService.validate_file_signature(content, filename)
        
        # Compute SHA-256
        sha256_hash = hashlib.sha256(content).hexdigest()

        # Generate unique server-side document ID and safe storage name
        doc_id = f"doc-upl-{uuid.uuid4().hex[:8]}"
        safe_storage_name = f"{doc_id}{ext}"
        storage_path = settings.UPLOAD_DIR / safe_storage_name

        with open(storage_path, "wb") as f:
            f.write(content)

        return {
            "doc_id": doc_id,
            "original_filename": filename,
            "safe_storage_name": safe_storage_name,
            "storage_path": str(storage_path),
            "file_size_bytes": len(content),
            "mime_type": mime_type,
            "file_hash": sha256_hash,
            "extension": ext,
        }

    @staticmethod
    def get_file_path(doc_id: str) -> Optional[Path]:
        """
        Retrieves storage path for a given doc_id without path traversal risks.
        """
        if not doc_id:
            return None

        # Reject obvious path traversal characters immediately
        if ".." in doc_id or "/" in doc_id or "\\" in doc_id:
            return None

        # Sanitise doc_id
        safe_id = "".join(c for c in doc_id if c.isalnum() or c in "-_")
        if not safe_id:
            return None

        upload_root = settings.UPLOAD_DIR.resolve()
        for ext in settings.ALLOWED_EXTENSIONS:
            candidate = settings.UPLOAD_DIR / f"{safe_id}{ext}"
            if candidate.exists() and candidate.is_file():
                try:
                    candidate.resolve().relative_to(upload_root)
                    return candidate
                except (ValueError, RuntimeError):
                    return None
        return None
