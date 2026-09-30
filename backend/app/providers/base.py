from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseDataProvider(ABC):
    @abstractmethod
    def get_air_quality(self, city: str, lat: float, lng: float) -> Dict[str, Any]:
        """Fetch AQ observations (AQI, PM2.5, PM10, NO2, etc.)"""
        pass

    @abstractmethod
    def get_weather(self, city: str, lat: float, lng: float) -> Dict[str, Any]:
        """Fetch meteorological observations (Temp, Humidity, Wind speed, Wind dir, Rainfall)"""
        pass

    @abstractmethod
    def get_satellite_data(self, city: str, lat: float, lng: float) -> Dict[str, Any]:
        """Fetch satellite observations (Sentinel-5P NO2, MODIS/VIIRS fire hotspots, AOD)"""
        pass

    @abstractmethod
    def get_population_grid(self, city: str, lat: float, lng: float, radius_km: float) -> int:
        """Fetch estimated population count around a spatial radius"""
        pass

    @abstractmethod
    def get_infrastructure(self, city: str) -> List[Dict[str, Any]]:
        """Fetch key infrastructure points (Schools, Hospitals, Industrial zones)"""
        pass
