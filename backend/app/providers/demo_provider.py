import math
import random
from typing import List, Dict, Any
from app.providers.base import BaseDataProvider

# Coordinates center for major Indian cities
CITY_COORDINATES = {
    "Hyderabad": {"lat": 17.3850, "lng": 78.4867},
    "Bengaluru": {"lat": 12.9716, "lng": 77.5946},
    "Chennai": {"lat": 13.0827, "lng": 80.2707},
    "Delhi": {"lat": 28.6139, "lng": 77.2090},
    "Mumbai": {"lat": 19.0760, "lng": 72.8777}
}

class DemoDataProvider(BaseDataProvider):
    """
    Demo/Simulated Data Provider for AERIS.
    Provides realistic environmental, satellite, meteorological, and infrastructure data for Indian metropolitan regions.
    """

    def get_air_quality(self, city: str, lat: float, lng: float) -> Dict[str, Any]:
        base_coords = CITY_COORDINATES.get(city, CITY_COORDINATES["Hyderabad"])
        dist = math.sqrt((lat - base_coords["lat"])**2 + (lng - base_coords["lng"])**2)

        # Baseline calculation with synthetic anomaly factor based on spatial proximity
        pm25 = round(65.0 + random.uniform(-10, 15) + (20.0 if dist < 0.05 else 0.0), 1)
        pm10 = round(pm25 * 1.5 + random.uniform(-5, 10), 1)
        no2 = round(32.0 + random.uniform(-8, 12), 1)
        aqi = int(pm25 * 1.8 + random.randint(-10, 15))

        return {
            "city": city,
            "latitude": lat,
            "longitude": lng,
            "aqi": max(30, min(500, aqi)),
            "pm25": pm25,
            "pm10": pm10,
            "no2": no2,
            "so2": round(14.2 + random.uniform(-3, 4), 1),
            "co": round(1.2 + random.uniform(-0.2, 0.5), 2),
            "o3": round(28.4 + random.uniform(-5, 5), 1),
            "data_source": "SIMULATED_DEMO_STREAM",
            "quality_flag": "VALID"
        }

    def get_weather(self, city: str, lat: float, lng: float) -> Dict[str, Any]:
        return {
            "city": city,
            "temperature": round(29.5 + random.uniform(-2, 3), 1),
            "humidity": round(64.0 + random.uniform(-5, 10), 1),
            "wind_speed": round(12.4 + random.uniform(-3, 4), 1),  # km/h
            "wind_direction": 225.0,  # SW wind
            "rainfall": 0.0,
            "pressure": 1011.5,
            "data_source": "METEO_DEMO_STREAM"
        }

    def get_satellite_data(self, city: str, lat: float, lng: float) -> Dict[str, Any]:
        # Sentinel-5P & MODIS/VIIRS anomaly simulation
        has_fire = random.random() < 0.25
        return {
            "city": city,
            "sentinel5p_no2_column": round(1.85e-4 + random.uniform(0, 0.5e-4), 6),
            "modis_fire_detected": has_fire,
            "fire_confidence": 0.89 if has_fire else 0.0,
            "aod_550nm": round(0.48 + random.uniform(-0.05, 0.15), 2),
            "satellite_source": "SENTINEL_5P_TROPOMI"
        }

    def get_population_grid(self, city: str, lat: float, lng: float, radius_km: float) -> int:
        # Urban density calculation ~12,000 people per sq km in Indian tier-1 cities
        area_sq_km = math.pi * (radius_km ** 2)
        base_density = 11500 + random.randint(-1500, 2500)
        return int(area_sq_km * base_density)

    def get_infrastructure(self, city: str) -> List[Dict[str, Any]]:
        base = CITY_COORDINATES.get(city, CITY_COORDINATES["Hyderabad"])
        blat, blng = base["lat"], base["lng"]

        items = [
            # Schools
            {"name": f"{city} Public Model School", "category": "SCHOOL", "latitude": blat + 0.012, "longitude": blng + 0.008, "capacity_or_size": 1200, "risk_sensitivity": 1.5},
            {"name": "St. Jude Primary Academy", "category": "SCHOOL", "latitude": blat - 0.015, "longitude": blng + 0.018, "capacity_or_size": 850, "risk_sensitivity": 1.5},
            {"name": "Vidya Bharti High School", "category": "SCHOOL", "latitude": blat + 0.024, "longitude": blng - 0.011, "capacity_or_size": 1400, "risk_sensitivity": 1.5},
            {"name": "Greenwood International School", "category": "SCHOOL", "latitude": blat - 0.008, "longitude": blng - 0.022, "capacity_or_size": 950, "risk_sensitivity": 1.5},

            # Hospitals
            {"name": "City General Hospital", "category": "HOSPITAL", "latitude": blat + 0.005, "longitude": blng - 0.012, "capacity_or_size": 650, "risk_sensitivity": 1.8},
            {"name": "Apollo Super Specialty Care", "category": "HOSPITAL", "latitude": blat - 0.018, "longitude": blng - 0.005, "capacity_or_size": 400, "risk_sensitivity": 1.8},
            {"name": "Government Chest & Respiratory Center", "category": "HOSPITAL", "latitude": blat + 0.019, "longitude": blng + 0.025, "capacity_or_size": 300, "risk_sensitivity": 2.0},

            # Industrial Zones
            {"name": "Panchal Industrial Estate Cluster A", "category": "INDUSTRIAL", "latitude": blat + 0.028, "longitude": blng + 0.032, "capacity_or_size": 45, "risk_sensitivity": 0.8},
            {"name": "Balanagar Thermal & Chemical Zone", "category": "INDUSTRIAL", "latitude": blat - 0.031, "longitude": blng + 0.041, "capacity_or_size": 60, "risk_sensitivity": 0.8},
            {"name": "Sanathnagar Heavy Foundry Sector", "category": "INDUSTRIAL", "latitude": blat + 0.035, "longitude": blng - 0.028, "capacity_or_size": 30, "risk_sensitivity": 0.8}
        ]

        for item in items:
            item["city"] = city

        return items
