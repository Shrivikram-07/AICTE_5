import io
from pathlib import Path
from typing import Dict, Any, List
from pypdf import PdfReader

class PDFExtractionService:
    @staticmethod
    def extract_pdf_data(file_bytes: bytes) -> Dict[str, Any]:
        """
        Extracts digital text, metadata, page count, and scan characteristics using pypdf.
        """
        reader = PdfReader(io.BytesIO(file_bytes))
        pages_count = len(reader.pages)
        page_texts: List[str] = []
        total_chars = 0

        for i, page in enumerate(reader.pages):
            try:
                text = page.extract_text() or ""
                page_texts.append(text)
                total_chars += len(text.strip())
            except Exception as e:
                page_texts.append(f"[Error extracting page {i+1}: {str(e)}]")

        full_text = "\n\n--- Page Break ---\n\n".join(page_texts)

        # Heuristic: If average chars per page < 80, the PDF is likely scanned or image-heavy
        avg_chars_per_page = total_chars / max(1, pages_count)
        is_scanned = avg_chars_per_page < 80

        # Extract metadata
        pdf_meta = {}
        if reader.metadata:
            for k, v in reader.metadata.items():
                clean_k = str(k).lstrip("/").replace(" ", "_")
                pdf_meta[clean_k] = str(v)

        return {
            "pages_count": pages_count,
            "full_text": full_text,
            "total_chars": total_chars,
            "avg_chars_per_page": avg_chars_per_page,
            "is_scanned": is_scanned,
            "metadata": pdf_meta,
        }
