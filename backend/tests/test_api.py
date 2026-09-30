import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["system"] == "AERIS - AI Environmental Risk & Intelligence System"

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_air_quality_endpoint():
    response = client.get("/api/v1/air-quality?city=Hyderabad")
    assert response.status_code == 200
    data = response.json()
    assert "air_quality" in data
    assert data["air_quality"]["city"] == "Hyderabad"
    assert "pm25" in data["air_quality"]

def test_forecast_endpoint():
    response = client.get("/api/v1/forecast?city=Hyderabad")
    assert response.status_code == 200
    data = response.json()
    assert len(data["horizons"]) == 5
    assert data["horizons"][0]["horizon_hours"] == 1

def test_hotspots_endpoint():
    response = client.get("/api/v1/hotspots?city=Hyderabad")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert "current_pm25" in data[0]

def test_exposure_endpoint():
    response = client.get("/api/v1/exposure?city=Hyderabad")
    assert response.status_code == 200
    data = response.json()
    assert "population_exposed" in data
    assert "risk_index" in data

def test_federated_endpoint():
    response = client.get("/api/v1/federated/status")
    assert response.status_code == 200
    data = response.json()
    assert data["current_round"] >= 12
    assert "global_accuracy" in data

def test_copilot_endpoint():
    response = client.post("/api/v1/copilot/ask", json={"question": "What are the critical hotspots?", "city": "Hyderabad"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "sources_used" in data

def test_export_csv_endpoints():
    r_reports = client.get("/api/v1/reports/export/csv?city=Hyderabad")
    assert r_reports.status_code == 200
    assert r_reports.headers["content-type"].startswith("text/csv")
    assert "ID,Title,Category" in r_reports.text

    r_incidents = client.get("/api/v1/incidents/export/csv")
    assert r_incidents.status_code == 200
    assert r_incidents.headers["content-type"].startswith("text/csv")
    assert "Incident Number,Title" in r_incidents.text

    r_hotspots = client.get("/api/v1/hotspots/export/csv?city=Hyderabad")
    assert r_hotspots.status_code == 200
    assert r_hotspots.headers["content-type"].startswith("text/csv")
    assert "ID,Title,City" in r_hotspots.text
