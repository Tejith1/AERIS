import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base, JSONEncodedDict

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="citizen")  # citizen, authority, admin
    department = Column(String(255), nullable=True)
    city = Column(String(100), default="Hyderabad")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CitizenReport(Base):
    __tablename__ = "citizen_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)  # Industrial smoke, Crop burning, Waste burning, Construction dust, Traffic, Chemical odor, Smoke, Unknown
    severity = Column(String(50), default="Moderate")  # Low, Moderate, High, Severe
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    city = Column(String(100), default="Hyderabad")
    address = Column(String(255), nullable=True)

    # Multilingual & Voice fields
    original_text = Column(Text, nullable=True)
    detected_language = Column(String(10), default="en")  # en, hi, te, ta, kn, mr, bn
    voice_audio_path = Column(String(500), nullable=True)

    # Computer Vision fields
    photo_url = Column(String(500), nullable=True)
    cv_detected_event = Column(String(255), nullable=True)
    cv_confidence = Column(Float, nullable=True)
    cv_possible_source = Column(String(255), nullable=True)
    cv_explanation = Column(Text, nullable=True)

    # Status & Verification
    status = Column(String(50), default="SUBMITTED")  # SUBMITTED, VERIFIED, MERGED_TO_HOTSPOT, REJECTED
    confidence_score = Column(Float, default=0.7)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", backref="reports")

class EnvironmentalObservation(Base):
    __tablename__ = "environmental_observations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    city = Column(String(100), nullable=False, index=True)
    station_id = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # Metrics
    aqi = Column(Integer, nullable=False)
    pm25 = Column(Float, nullable=False)
    pm10 = Column(Float, nullable=False)
    no2 = Column(Float, nullable=True)
    so2 = Column(Float, nullable=True)
    co = Column(Float, nullable=True)
    o3 = Column(Float, nullable=True)

    # Weather
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    wind_direction = Column(Float, nullable=True)  # Degrees
    rainfall = Column(Float, default=0.0)
    pressure = Column(Float, nullable=True)

    # Satellite
    satellite_no2_column = Column(Float, nullable=True)
    satellite_fire_detected = Column(Boolean, default=False)
    satellite_aod = Column(Float, nullable=True)

    # Metadata
    source_type = Column(String(50), default="DEMO_STREAM")  # LIVE, HISTORICAL, SIMULATED, SATELLITE
    data_quality_flag = Column(String(20), default="VALID")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

class Hotspot(Base):
    __tablename__ = "hotspots"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_km = Column(Float, default=1.5)

    severity = Column(String(50), default="HIGH")  # LOW, MODERATE, HIGH, CRITICAL
    status = Column(String(50), default="ACTIVE")  # ACTIVE, INVESTIGATING, CONTROLLED, RESOLVED
    event_category = Column(String(100), default="Industrial smoke")
    confidence_score = Column(Float, default=0.88)

    # Probable source
    probable_source = Column(String(255), default="Industrial Activity")
    source_confidence = Column(Float, default=0.85)

    # Current readings
    current_pm25 = Column(Float, nullable=False)
    current_pm10 = Column(Float, nullable=False)
    current_aqi = Column(Integer, nullable=False)
    current_no2 = Column(Float, nullable=True)

    # Evidence & Explanations (Stored as JSON)
    evidence_list = Column(JSONEncodedDict, default=list)  # List of string reasons
    contributing_report_count = Column(Integer, default=0)

    # Timestamps
    first_detected_at = Column(DateTime, default=datetime.utcnow)
    last_updated_at = Column(DateTime, default=datetime.utcnow)

class PollutionPrediction(Base):
    __tablename__ = "pollution_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hotspot_id = Column(String(36), ForeignKey("hotspots.id"), nullable=True)
    city = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    horizon_hours = Column(Integer, nullable=False)  # 1, 3, 6, 12, 24
    predicted_pm25 = Column(Float, nullable=False)
    predicted_pm10 = Column(Float, nullable=False)
    predicted_aqi = Column(Integer, nullable=False)
    predicted_no2 = Column(Float, nullable=True)

    confidence_interval_lower = Column(Float, nullable=True)
    confidence_interval_upper = Column(Float, nullable=True)
    model_version = Column(String(50), default="XGBoost-Spatiotemporal-v2.1")
    created_at = Column(DateTime, default=datetime.utcnow)

class PollutionPropagation(Base):
    __tablename__ = "pollution_propagation"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hotspot_id = Column(String(36), ForeignKey("hotspots.id"), nullable=False)
    horizon_hours = Column(Integer, nullable=False)  # 1, 3, 6

    # GeoJSON Polygon representing propagation zone
    polygon_geojson = Column(JSONEncodedDict, nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    wind_vector_deg = Column(Float, nullable=False)
    wind_speed_kmh = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class InfrastructureItem(Base):
    __tablename__ = "infrastructure"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)  # SCHOOL, HOSPITAL, INDUSTRIAL, RESIDENTIAL
    city = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity_or_size = Column(Integer, default=500)
    risk_sensitivity = Column(Float, default=1.0)  # High multiplier for schools/hospitals

class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_number = Column(String(50), unique=True, nullable=False)
    hotspot_id = Column(String(36), ForeignKey("hotspots.id"), nullable=False)
    title = Column(String(255), nullable=False)
    assigned_department = Column(String(255), default="State Pollution Control Board")
    assigned_officer = Column(String(255), default="Inspector R. Sharma")
    priority = Column(String(50), default="CRITICAL")  # LOW, MODERATE, HIGH, CRITICAL

    status = Column(String(50), default="DETECTED")  # DETECTED, VERIFIED, ASSIGNED, UNDER_INVESTIGATION, ACTION_TAKEN, RESOLVED
    recommended_action = Column(Text, nullable=True)
    action_taken_notes = Column(Text, nullable=True)

    exposed_population = Column(Integer, default=0)
    exposed_schools = Column(Integer, default=0)
    exposed_hospitals = Column(Integer, default=0)
    risk_index = Column(Float, default=85.4)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    alert_type = Column(String(50), default="CRITICAL")  # CRITICAL, HIGH, INFO
    city = Column(String(100), default="Hyderabad")
    hotspot_id = Column(String(36), ForeignKey("hotspots.id"), nullable=True)

    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class FederatedClientState(Base):
    __tablename__ = "federated_clients"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    city = Column(String(100), unique=True, nullable=False)
    sample_count = Column(Integer, default=15000)
    local_loss = Column(Float, default=0.12)
    local_accuracy = Column(Float, default=89.2)
    last_update = Column(DateTime, default=datetime.utcnow)

class FederatedRound(Base):
    __tablename__ = "federated_rounds"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    round_number = Column(Integer, nullable=False)
    participating_cities = Column(JSONEncodedDict, default=list)
    global_model_accuracy = Column(Float, default=90.1)
    global_loss = Column(Float, default=0.09)
    aggregation_timestamp = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    action = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(100), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.utcnow)
