import io
import shutil
import os
from typing import Dict, Any, Tuple
from PIL import Image

class OCRService:
    @staticmethod
    def is_tesseract_available() -> Tuple[bool, str]:
        """
        Detects whether tesseract binary is installed and executable on the host system.
        """
        # Check standard PATH
        binary_path = shutil.which("tesseract")
        if binary_path:
            return True, f"Tesseract binary detected at {binary_path}"
        
        # Check standard Windows paths
        win_candidates = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
        ]
        for candidate in win_candidates:
            if os.path.exists(candidate):
                return True, f"Tesseract binary detected at {candidate}"
                
        return False, "Tesseract OCR binary not detected on host system. Digital text parsing active via pypdf."

    @staticmethod
    def process_image(image_bytes: bytes) -> Dict[str, Any]:
        """
        Extracts image metadata and attempts OCR if tesseract is available.
        """
        available, info = OCRService.is_tesseract_available()
        
        try:
            img = Image.open(io.BytesIO(image_bytes))
            width, height = img.size
            format_name = img.format or "UNKNOWN"
            mode = img.mode

            # Visual anomaly heuristic: aspect ratios, extremely low dpi or suspicious metadata
            is_anomaly = False
            anomaly_note = None

            # Detect compression noise / low resolution (< 150 DPI equivalent, e.g. < 800px width for a full A4 doc)
            if width < 800 or height < 1000:
                is_anomaly = True
                anomaly_note = f"Low resolution raster ({width}x{height}px); compression noise may obscure seal verification."

            extracted_text = ""
            if available:
                try:
                    import pytesseract
                    # If in Windows standard path, set it
                    win_exe = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
                    if os.path.exists(win_exe) and not shutil.which("tesseract"):
                        pytesseract.pytesseract.tesseract_cmd = win_exe
                    extracted_text = pytesseract.image_to_string(img)
                except Exception as e:
                    extracted_text = f"[OCR Execution Failed: {str(e)}]"
            else:
                extracted_text = (
                    f"[Scanned Image Content: {format_name} {width}x{height}px]\n"
                    f"[Status: Host system has no native Tesseract OCR binary configured. "
                    f"Visual raster logged for manual inspection.]"
                )

            return {
                "ocr_available": available,
                "engine_info": info,
                "extracted_text": extracted_text,
                "width": width,
                "height": height,
                "format": format_name,
                "mode": mode,
                "has_visual_anomaly": is_anomaly,
                "anomaly_details": anomaly_note,
            }
        except Exception as e:
            return {
                "ocr_available": available,
                "engine_info": info,
                "extracted_text": f"[Error reading image file: {str(e)}]",
                "width": 0,
                "height": 0,
                "format": "UNKNOWN",
                "mode": "UNKNOWN",
                "has_visual_anomaly": True,
                "anomaly_details": f"Corrupt or non-standard image raster: {str(e)}",
            }
