import math
from typing import Dict, Any, List, Tuple

class GaussianPlumeDispersionModel:
    """
    Physics-Informed Gaussian Plume Atmospheric Dispersion Model.
    Computes pollutant concentration distribution C(x,y,z) downwind of emission sources
    and produces GeoJSON spatial dispersion cones using Pasquill-Gifford stability parameters.
    """

    def __init__(self):
        # Pasquill-Gifford dispersion parameters for Class D (Neutral stability)
        self.a = 0.13
        self.b = 0.903
        self.c = 0.10
        self.d = 0.88

    def calculate_sigma_y(self, x_meters: float) -> float:
        """Horizontal dispersion coefficient sigma_y."""
        return max(1.0, self.a * (x_meters ** self.b))

    def calculate_sigma_z(self, x_meters: float) -> float:
        """Vertical dispersion coefficient sigma_z."""
        return max(1.0, self.c * (x_meters ** self.d))

    def calculate_concentration(
        self,
        x_meters: float,
        y_meters: float,
        z_meters: float = 0.0,
        emission_rate_g_s: float = 120.0,
        wind_speed_m_s: float = 3.5,
        release_height_m: float = 25.0
    ) -> float:
        """
        Calculates ground-level or elevated pollutant concentration C(x,y,z) in g/m³.
        Gaussian Plume Formula:
        C(x,y,z) = (Q / (2 * pi * u * sigma_y * sigma_z)) * exp(-y² / (2 * sigma_y²)) * [exp(-(z-H)² / (2 * sigma_z²)) + exp(-(z+H)² / (2 * sigma_z²))]
        """
        if x_meters <= 0 or wind_speed_m_s <= 0:
            return 0.0

        sy = self.calculate_sigma_y(x_meters)
        sz = self.calculate_sigma_z(x_meters)
        Q = emission_rate_g_s
        u = wind_speed_m_s
        H = release_height_m

        term1 = Q / (2.0 * math.pi * u * sy * sz)
        term2 = math.exp(-(y_meters ** 2) / (2.0 * (sy ** 2)))
        term3 = math.exp(-((z_meters - H) ** 2) / (2.0 * (sz ** 2))) + math.exp(-((z_meters + H) ** 2) / (2.0 * (sz ** 2)))

        return term1 * term2 * term3

    def generate_plume_geojson(
        self,
        lat: float,
        lng: float,
        wind_deg: float = 225.0,
        wind_speed_kmh: float = 12.0,
        horizon_hours: int = 3
    ) -> Dict[str, Any]:
        """
        Calculates downwind physical plume transport polygon coordinates formatted as a standard GeoJSON Feature.
        """
        # Wind direction is where wind originates. Downwind vector is (wind_deg + 180) mod 360
        downwind_rad = math.radians((wind_deg + 180.0) % 360)
        
        # Effective transport distance with physical dispersion decay factor
        wind_m_s = wind_speed_kmh / 3.6
        travel_dist_km = (wind_speed_kmh * 0.70) * horizon_hours
        
        km_per_lat = 111.0
        km_per_lng = 111.0 * math.cos(math.radians(lat))

        # Plume spread angle expands with travel distance via sigma_y formulation
        downwind_meters = travel_dist_km * 1000.0
        sy = self.calculate_sigma_y(downwind_meters)
        half_width_km = (2.5 * sy) / 1000.0

        spread_angle_rad = math.atan2(half_width_km, travel_dist_km)

        left_rad = downwind_rad - spread_angle_rad
        right_rad = downwind_rad + spread_angle_rad

        # Key polygon boundary vertices
        tip_lat = lat + ((travel_dist_km * math.cos(downwind_rad)) / km_per_lat)
        tip_lng = lng + ((travel_dist_km * math.sin(downwind_rad)) / km_per_lng)

        p_left_lat = lat + ((travel_dist_km * 1.15 * math.cos(left_rad)) / km_per_lat)
        p_left_lng = lng + ((travel_dist_km * 1.15 * math.sin(left_rad)) / km_per_lng)

        p_right_lat = lat + ((travel_dist_km * 1.15 * math.cos(right_rad)) / km_per_lat)
        p_right_lng = lng + ((travel_dist_km * 1.15 * math.sin(right_rad)) / km_per_lng)

        coordinates = [
            [round(lng, 6), round(lat, 6)],
            [round(p_left_lng, 6), round(p_left_lat, 6)],
            [round(tip_lng, 6), round(tip_lat, 6)],
            [round(p_right_lng, 6), round(p_right_lat, 6)],
            [round(lng, 6), round(lat, 6)]
        ]

        return {
            "type": "Feature",
            "properties": {
                "horizon_hours": horizon_hours,
                "wind_speed_kmh": wind_speed_kmh,
                "wind_direction_deg": wind_deg,
                "travel_distance_km": round(travel_dist_km, 2),
                "dispersion_model": "Gaussian Plume (Pasquill Class D)",
                "plume_width_km": round(half_width_km * 2.0, 2)
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [coordinates]
            }
        }

gaussian_dispersion_model = GaussianPlumeDispersionModel()
