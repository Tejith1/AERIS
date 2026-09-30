from fastapi import APIRouter, Query
from app.providers.demo_provider import DemoDataProvider
from app.services.exposure_service import exposure_engine

router = APIRouter(tags=["Exposure & Infrastructure"])
demo_provider = DemoDataProvider()

@router.get("/exposure")
def get_exposure(city: str = Query("Hyderabad"), lat: float = Query(17.4401), lng: float = Query(78.3489), radius_km: float = Query(2.0)):
    res = exposure_engine.calculate_exposure(city, lat, lng, radius_km, pm25=146.0)
    return res

@router.get("/infrastructure")
def get_infrastructure(city: str = Query("Hyderabad")):
    return demo_provider.get_infrastructure(city)
