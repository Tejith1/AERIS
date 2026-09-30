from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# Authentication
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "citizen"
    department: Optional[str] = None
    city: str = "Hyderabad"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Citizen Reports
class CitizenReportCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    severity: str = "Moderate"
    latitude: float
    longitude: float
    city: str = "Hyderabad"
    address: Optional[str] = None
    photo_url: Optional[str] = None
    voice_audio_path: Optional[str] = None
    detected_language: str = "en"

class CitizenReportOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    category: str
    severity: str
    latitude: float
    longitude: float
    city: str
    address: Optional[str]
    photo_url: Optional[str]
    cv_detected_event: Optional[str]
    cv_confidence: Optional[float]
    cv_possible_source: Optional[str]
    cv_explanation: Optional[str]
    status: str
    confidence_score: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Hotspots
class HotspotOut(BaseModel):
    id: str
    title: str
    city: str
    latitude: float
    longitude: float
    radius_km: float
    severity: str
    status: str
    event_category: str
    confidence_score: float
    probable_source: str
    source_confidence: float
    current_pm25: float
    current_pm10: float
    current_aqi: int
    current_no2: Optional[float]
    evidence_list: List[str]
    contributing_report_count: int
    first_detected_at: datetime
    last_updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Forecasting
class ForecastRequest(BaseModel):
    latitude: float
    longitude: float
    city: str = "Hyderabad"

class ForecastHorizon(BaseModel):
    horizon_hours: int
    predicted_pm25: float
    predicted_pm10: float
    predicted_aqi: int
    predicted_no2: Optional[float]
    confidence_lower: float
    confidence_upper: float

class ForecastResponse(BaseModel):
    city: str
    latitude: float
    longitude: float
    current_aqi: int
    model_version: str
    horizons: List[ForecastHorizon]
    mae: float = 4.2
    rmse: float = 6.1
    r2: float = 0.92

# Propagation
class PropagationResponse(BaseModel):
    hotspot_id: str
    horizon_hours: int
    wind_vector_deg: float
    wind_speed_kmh: float
    polygon_geojson: Dict[str, Any]

# Exposure
class ExposureSummary(BaseModel):
    hotspot_id: str
    population_exposed: int
    schools_affected: int
    hospitals_affected: int
    industrial_facilities: int
    risk_index: float
    vulnerability_breakdown: Dict[str, float]
    nearby_schools: List[Dict[str, Any]]
    nearby_hospitals: List[Dict[str, Any]]

# Interventions
class InterventionAssignRequest(BaseModel):
    assigned_department: str
    assigned_officer: str
    priority: str = "CRITICAL"
    notes: Optional[str] = None

class InterventionStatusUpdate(BaseModel):
    status: str
    action_taken_notes: Optional[str] = None

class InterventionOut(BaseModel):
    id: str
    incident_number: str
    hotspot_id: str
    title: str
    assigned_department: str
    assigned_officer: str
    priority: str
    status: str
    recommended_action: Optional[str]
    action_taken_notes: Optional[str]
    exposed_population: int
    exposed_schools: int
    exposed_hospitals: int
    risk_index: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Federated AI
class FederatedStatusResponse(BaseModel):
    current_round: int
    global_accuracy: float
    global_loss: float
    participating_cities: List[str]
    city_metrics: List[Dict[str, Any]]
    status: str = "Active"

# Copilot
class CopilotQuery(BaseModel):
    question: str
    city: Optional[str] = "Hyderabad"

class CopilotAnswer(BaseModel):
    question: str
    answer: str
    sources_used: List[str]
    context_data: Dict[str, Any]
