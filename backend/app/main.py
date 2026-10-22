import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.config import settings
from backend.app.routers import health, documents, verification

app = FastAPI(
    title="AICTE Intelligence - Regulatory Verification Backend",
    description="Backend engine for AI-Powered Application Validation, Document Authentication & Regulatory Compliance (SIH26261)",
    version="1.0.0"
)

# CORS setup for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(verification.router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": "AICTE Intelligence Verification Engine",
        "problem_statement": "SIH26261",
        "api_docs": "/docs",
        "health": "/api/health",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
