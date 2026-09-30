import math
from typing import Dict, Any

class PropagationService:
    """
    Geospatial Pollution Propagation Engine.
    Simulates wind dispersion trajectories and pollutant transport cones.
    Returns GeoJSON Polygons for +1h, +3h, +6h.
    """

    def calculate_propagation_zone(
        self, lat: float, lng: float, wind_deg: float = 225.0, wind_speed_kmh: float = 12.0, horizon_hours: int = 3
    ) -> Dict[str, Any]:
        # Convert wind direction (direction wind comes FROM) to dispersion vector (where plume MOVES TO)
        plume_dir_rad = math.radians((wind_deg + 180.0) % 360)

        # Distance traveled in km
        travel_dist_km = (wind_speed_kmh * 0.75) * horizon_hours
        km_per_lat = 111.0
        km_per_lng = 111.0 * math.cos(math.radians(lat))

        # Core offset point
        center_offset_lat = (travel_dist_km * math.cos(plume_dir_rad)) / km_per_lat
        center_offset_lng = (travel_dist_km * math.sin(plume_dir_rad)) / km_per_lng

        # Dispersion cone spread angle (increases over time)
        spread_angle = math.radians(25.0 + 5.0 * horizon_hours)
        plume_left = plume_dir_rad - spread_angle / 2.0
        plume_right = plume_dir_rad + spread_angle / 2.0

        p_left_lat = lat + ((travel_dist_km * 1.2 * math.cos(plume_left)) / km_per_lat)
        p_left_lng = lng + ((travel_dist_km * 1.2 * math.sin(plume_left)) / km_per_lng)

        p_right_lat = lat + ((travel_dist_km * 1.2 * math.cos(plume_right)) / km_per_lat)
        p_right_lng = lng + ((travel_dist_km * 1.2 * math.sin(plume_right)) / km_per_lng)

        # GeoJSON Polygon
        coordinates = [
            [lng, lat],
            [p_left_lng, p_left_lat],
            [p_right_lng, p_right_lat],
            [lng, lat]
        ]

        return {
            "type": "Feature",
            "properties": {
                "horizon_hours": horizon_hours,
                "wind_speed_kmh": wind_speed_kmh,
                "wind_direction_deg": wind_deg,
                "travel_distance_km": round(travel_dist_km, 2)
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [coordinates]
            }
        }

propagation_service = PropagationService()
