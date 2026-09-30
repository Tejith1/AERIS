from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import Alert

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("")
def list_alerts(city: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Alert)
    if city:
        query = query.filter(Alert.city == city)
    return query.order_by(Alert.created_at.desc()).all()

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, acknowledged_by: str = "Inspector R. Sharma", db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledged = True
    alert.acknowledged_by = acknowledged_by
    db.commit()
    db.refresh(alert)
    return alert
