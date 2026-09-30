import math
from typing import Dict, Any, List
from app.providers.demo_provider import DemoDataProvider

demo_provider = DemoDataProvider()

class ExposureVulnerabilityEngine:
    """
    Exposure & Vulnerability Calculation Engine.
    Calculates affected population, schools, hospitals, and computes Environmental Risk Index.
    """

    def calculate_exposure(self, city: str, lat: float, lng: float, radius_km: float = 2.0, pm25: float = 140.0) -> Dict[str, Any]:
        infra_items = demo_provider.get_infrastructure(city)

        nearby_schools = []
        nearby_hospitals = []
        nearby_industrial = []

        for item in infra_items:
            # Distance in km
            d_lat = (item["latitude"] - lat) * 111.0
            d_lng = (item["longitude"] - lng) * 111.0 * math.cos(math.radians(lat))
            dist_km = math.sqrt(d_lat**2 + d_lng**2)

            if dist_km <= radius_km * 1.5:
                item_copy = item.copy()
                item_copy["distance_km"] = round(dist_km, 2)
                if item["category"] == "SCHOOL":
                    nearby_schools.append(item_copy)
                elif item["category"] == "HOSPITAL":
                    nearby_hospitals.append(item_copy)
                elif item["category"] == "INDUSTRIAL":
                    nearby_industrial.append(item_copy)

        population = demo_provider.get_population_grid(city, lat, lng, radius_km)

        # Environmental Risk Index Formula:
        # Risk Index = (Pollution Severity Normalization) * 0.4 + (Vulnerability Density) * 0.35 + (Duration/Exposure Multiplier) * 0.25
        severity_factor = min(100.0, (pm25 / 150.0) * 100.0)
        vulnerability_score = min(100.0, (len(nearby_schools) * 12.0 + len(nearby_hospitals) * 18.0 + population / 500.0))
        risk_index = round(min(99.9, (severity_factor * 0.45) + (vulnerability_score * 0.35) + 20.0), 1)

        return {
            "city": city,
            "population_exposed": population,
            "schools_affected": len(nearby_schools),
            "hospitals_affected": len(nearby_hospitals),
            "industrial_facilities": len(nearby_industrial),
            "risk_index": risk_index,
            "vulnerability_breakdown": {
                "pollution_severity_score": round(severity_factor, 1),
                "vulnerable_population_density": round(population / (math.pi * radius_km**2), 1),
                "sensitive_infrastructure_weight": round(vulnerability_score, 1)
            },
            "nearby_schools": nearby_schools,
            "nearby_hospitals": nearby_hospitals,
            "nearby_industrial": nearby_industrial
        }

exposure_engine = ExposureVulnerabilityEngine()
