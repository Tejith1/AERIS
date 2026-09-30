import requests
from typing import Dict, Any, Optional
from app.core.config import settings

class OpenWeatherMapProvider:
    """
    Live OpenWeatherMap Integration for AERIS.
    Fetches real-time Air Pollution and Meteorological telemetry when API key is provided.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.WEATHER_API_KEY

    def get_live_air_quality(self, lat: float, lng: float) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            return None

        try:
            url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lng}&appid={self.api_key}"
            res = requests.get(url, timeout=5)
            if res.status_code == 200:
                data = res.json()
                components = data["list"][0]["components"]
                aqi_level = data["list"][0]["main"]["aqi"]  # 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor

                # Calculate estimated AQI (US EPA scale approximation)
                pm25 = components.get("pm2_5", 35.0)
                pm10 = components.get("pm10", 60.0)
                no2 = components.get("no2", 25.0)
                estimated_aqi = int(pm25 * 2.1)

                return {
                    "aqi": max(20, min(500, estimated_aqi)),
                    "pm25": round(pm25, 1),
                    "pm10": round(pm10, 1),
                    "no2": round(no2, 1),
                    "so2": round(components.get("so2", 10.0), 1),
                    "co": round(components.get("co", 400.0) / 1000.0, 2),
                    "o3": round(components.get("o3", 30.0), 1),
                    "owm_aqi_index": aqi_level,
                    "data_source": "OPENWEATHERMAP_LIVE_TELEMETRY",
                    "quality_flag": "VALID_LIVE"
                }
        except Exception as e:
            print(f"[OpenWeatherMapProvider] Error fetching air quality: {e}")

        return None

    def get_live_weather(self, lat: float, lng: float) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            return None

        try:
            url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={self.api_key}&units=metric"
            res = requests.get(url, timeout=5)
            if res.status_code == 200:
                data = res.json()
                main = data.get("main", {})
                wind = data.get("wind", {})

                return {
                    "temperature": round(main.get("temp", 28.0), 1),
                    "humidity": round(main.get("humidity", 60.0), 1),
                    "wind_speed": round(wind.get("speed", 3.0) * 3.6, 1),  # m/s to km/h
                    "wind_direction": wind.get("deg", 225.0),
                    "pressure": main.get("pressure", 1012),
                    "description": data.get("weather", [{}])[0].get("description", "Clear"),
                    "data_source": "OPENWEATHERMAP_LIVE_METEO"
                }
        except Exception as e:
            print(f"[OpenWeatherMapProvider] Error fetching weather: {e}")

        return None

owm_provider = OpenWeatherMapProvider()
