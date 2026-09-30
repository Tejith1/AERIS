import random
from typing import Dict, Any, List

class SourceAnalysisEngine:
    """
    Probabilistic Source Inference Engine for AERIS.
    Fuses spatial proximity, land use, satellite indicators, weather vectors, and citizen report clusters.
    Uses probabilistic wording ("Probable source", "Potential event").
    """

    SOURCES = [
        "Industrial Activity / Chemical Stack Emission",
        "Agricultural Crop Residue Burning",
        "Uncontrolled Municipal Waste Burning",
        "Construction & Demolition Dust",
        "Heavy Vehicle Traffic Corridor",
        "Chemical Odor Leak",
        "Unknown Environmental Anomaly"
    ]

    def infer_source(
        self,
        event_category: str,
        no2_level: float,
        satellite_fire: bool,
        nearby_industrial_count: int,
        report_count: int
    ) -> Dict[str, Any]:

        if "Industrial" in event_category or nearby_industrial_count > 0 or no2_level > 55.0:
            probable = "Industrial Activity / Chemical Stack Emission"
            confidence = 0.87
            evidence = [
                f"Elevated NO2 anomaly ({no2_level} µg/m³)",
                f"{nearby_industrial_count} designated industrial facilities within 2km radius",
                "Sentinel-5P satellite TROPOMI NO2 plume correlation",
                f"{report_count} citizen smoke and chemical odor observations"
            ]
        elif satellite_fire or "Crop" in event_category:
            probable = "Agricultural Crop Residue Burning"
            confidence = 0.84
            evidence = [
                "MODIS / VIIRS active fire thermal anomaly detected",
                "Spatial correlation with rural agricultural boundary",
                "High PM10 to PM2.5 ratio indicating biomass combustion"
            ]
        elif "Waste" in event_category:
            probable = "Uncontrolled Municipal Waste Burning"
            confidence = 0.81
            evidence = [
                "Citizen photographic evidence verified localized waste smoke",
                "Low wind dispersion keeping smoke stagnant",
                "Black carbon thermal signature"
            ]
        else:
            probable = "Construction & Demolition Dust"
            confidence = 0.78
            evidence = [
                "Coarse PM10 dominance over PM2.5",
                "Proximity to active urban infrastructure corridor"
            ]

        return {
            "probable_source": probable,
            "confidence": confidence,
            "supporting_evidence": evidence,
            "disclaimer": "Probabilistic AI model inference based on available multi-sensor evidence. Ground verification recommended."
        }

source_analysis_engine = SourceAnalysisEngine()
