def test_health_endpoint_response(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "operational"
    assert "ocrAvailable" in data
    assert isinstance(data["ocrAvailable"], bool)
    assert data["pypdfAvailable"] is True
    assert data["maxFileSizeMb"] == 15
    assert "Academic Year 2026" in data["evaluationCycle"]
    assert ".pdf" in data["supportedFormats"]
    assert ".png" in data["supportedFormats"]

def test_root_endpoint(client):
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["problem_statement"] == "SIH26261"
