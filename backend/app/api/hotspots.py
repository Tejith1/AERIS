import csv
import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import HotspotOut
from app.services.hotspot_service import hotspot_engine

router = APIRouter(prefix="/hotspots", tags=["Hotspots"])

@router.get("/export/csv")
def export_hotspots_csv(city: Optional[str] = Query("Hyderabad"), db: Session = Depends(get_db)):
    hotspots = hotspot_engine.detect_and_update_hotspots(db, city or "Hyderabad")
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Title", "City", "Latitude", "Longitude", "Severity", "Status", "AQI", "PM2.5", "Probable Source", "Confidence"])
    for h in hotspots:
        writer.writerow([h.id, h.title, h.city, h.latitude, h.longitude, h.severity, h.status, h.current_aqi, h.current_pm25, h.probable_source, h.confidence_score])
    return Response(content=output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=hotspots.csv"})

@router.get("", response_model=List[HotspotOut])
def get_hotspots(city: Optional[str] = Query("Hyderabad"), db: Session = Depends(get_db)):
    hotspots = hotspot_engine.detect_and_update_hotspots(db, city or "Hyderabad")
    return hotspots

@router.get("/{hotspot_id}", response_model=HotspotOut)
def get_hotspot(hotspot_id: str, db: Session = Depends(get_db)):
    hotspots = hotspot_engine.detect_and_update_hotspots(db, "Hyderabad")
    for h in hotspots:
        if h.id == hotspot_id:
            return h
    raise HTTPException(status_code=404, detail="Hotspot not found")
