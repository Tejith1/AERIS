from fastapi import APIRouter, Query
from app.providers.demo_provider import DemoDataProvider
from app.providers.openweathermap_provider import owm_provider
from app.schemas.schemas import ForecastResponse
from app.services.forecast_service import forecast_service
from app.services.propagation_service import propagation_service

router = APIRouter(tags=["Air Quality & Forecasting"])
demo_provider = DemoDataProvider()

@router.get("/air-quality")
def get_air_quality(city: str = Query("Hyderabad"), lat: float = Query(17.3850), lng: float = Query(78.4867)):
    # Attempt live telemetry from OpenWeatherMap
    live_aq = owm_provider.get_live_air_quality(lat, lng)
    live_w = owm_provider.get_live_weather(lat, lng)

    data = live_aq if live_aq else demo_provider.get_air_quality(city, lat, lng)
    weather = live_w if live_w else demo_provider.get_weather(city, lat, lng)
    satellite = demo_provider.get_satellite_data(city, lat, lng)

    return {
        "air_quality": data,
        "weather": weather,
        "satellite": satellite
    }

@router.get("/forecast", response_model=ForecastResponse)
def get_forecast(city: str = Query("Hyderabad"), lat: float = Query(17.4401), lng: float = Query(78.3489)):
    aq = demo_provider.get_air_quality(city, lat, lng)
    horizons = forecast_service.generate_forecast(
        current_pm25=146.0 if city == "Hyderabad" else aq["pm25"],
        current_pm10=218.0 if city == "Hyderabad" else aq["pm10"],
        current_aqi=245 if city == "Hyderabad" else aq["aqi"],
        current_no2=68.5
    )

    return {
        "city": city,
        "latitude": lat,
        "longitude": lng,
        "current_aqi": 245 if city == "Hyderabad" else aq["aqi"],
        "model_version": "XGBoost-Spatiotemporal-v2.1",
        "horizons": horizons,
        "mae": 4.2,
        "rmse": 6.1,
        "r2": 0.92
    }

@router.get("/propagation")
def get_propagation(hotspot_id: str = Query("HYD-1042"), horizon_hours: int = Query(3), lat: float = Query(17.4401), lng: float = Query(78.3489)):
    propagation_polygon = propagation_service.calculate_propagation_zone(
        lat=lat,
        lng=lng,
        wind_deg=225.0,
        wind_speed_kmh=12.0,
        horizon_hours=horizon_hours
    )
    return {
        "hotspot_id": hotspot_id,
        "horizon_hours": horizon_hours,
        "wind_vector_deg": 225.0,
        "wind_speed_kmh": 12.0,
        "polygon_geojson": propagation_polygon
    }
