import asyncio
from datetime import datetime
from typing import Dict, Any, List

class SimulationRunner:
    """
    Real-Time Simulation Engine & Demo Scenario Orchestrator.
    Executes the complete industrial pollution event timeline.
    """

    def __init__(self):
        self.is_running = False
        self.current_step = 0
        self.timeline_events = [
            {"time_sec": 0, "event_type": "NORMAL_CONDITIONS", "title": "Normal Environmental Baseline", "description": "Air quality levels normal across Hyderabad region (AQI ~65).", "severity": "LOW"},
            {"time_sec": 30, "event_type": "POLLUTION_SPIKE", "title": "Environmental Anomaly Detected", "description": "PM2.5 sensor monitor recorded sudden 42% spike near Sanathnagar Industrial Sector.", "severity": "MODERATE"},
            {"time_sec": 60, "event_type": "CITIZEN_REPORT", "title": "Citizen Observations Received", "description": "14 citizen reports with photos & voice notes submitted describing dense chemical smoke.", "severity": "HIGH"},
            {"time_sec": 90, "event_type": "SATELLITE_ANOMALY", "title": "Satellite Sentinel-5P Thermal Detection", "description": "TROPOMI NO2 column density anomaly verified by Google Earth Engine pipeline.", "severity": "HIGH"},
            {"time_sec": 120, "event_type": "HOTSPOT_CREATED", "title": "AI Hotspot Pipeline Triggered", "description": "XGBoost Anomaly Model created Hotspot #HYD-1042 (Confidence: 91%).", "severity": "CRITICAL"},
            {"time_sec": 150, "event_type": "FORECAST_UPDATED", "title": "Spatiotemporal Forecast Generated", "description": "3-hour horizon predicts PM2.5 rise to 172 µg/m³ moving southwest.", "severity": "CRITICAL"},
            {"time_sec": 180, "event_type": "EXPOSURE_CALCULATED", "title": "Exposure Modeling Complete", "description": "PostGIS GIS query identified 18,420 residents, 4 schools, and 1 hospital in propagation vector.", "severity": "CRITICAL"},
            {"time_sec": 210, "event_type": "ALERT_CREATED", "title": "Authority Command Center Alert Dispatched", "description": "High-priority alert dispatched to State Pollution Control Board.", "severity": "CRITICAL"},
            {"time_sec": 240, "event_type": "INTERVENTION_UPDATED", "title": "Intervention Inspection Assigned", "description": "Incident #INC-2041 assigned to Inspection Team Alpha for immediate field investigation.", "severity": "CRITICAL"}
        ]

    def start_simulation(self):
        self.is_running = True
        self.current_step = 0

    def stop_simulation(self):
        self.is_running = False

    def advance_tick(self) -> Dict[str, Any]:
        if not self.is_running:
            return {"status": "PAUSED", "current_step": self.current_step}

        event = self.timeline_events[self.current_step % len(self.timeline_events)]
        self.current_step += 1

        return {
            "status": "RUNNING",
            "current_step": self.current_step,
            "event": event,
            "timestamp": datetime.utcnow().isoformat()
        }

simulation_runner = SimulationRunner()
