import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.routers.documents import DOCUMENTS_STORE

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(autouse=True)
def isolate_documents_store():
    """Ensures each test has an isolated in-memory DOCUMENTS_STORE"""
    snapshot = dict(DOCUMENTS_STORE)
    DOCUMENTS_STORE.clear()
    yield
    DOCUMENTS_STORE.clear()
    DOCUMENTS_STORE.update(snapshot)
