import csv
import io
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import Intervention
from app.schemas.schemas import InterventionOut, InterventionAssignRequest, InterventionStatusUpdate
from app.services.report_generator import report_generator

router = APIRouter(prefix="/incidents", tags=["Authority Interventions"])

@router.get("/export/csv")
def export_incidents_csv(db: Session = Depends(get_db)):
    incidents = db.query(Intervention).order_by(Intervention.created_at.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Incident Number", "Title", "Department", "Officer", "Priority", "Status", "Exposed Pop", "Risk Index", "Created At"])
    for i in incidents:
        writer.writerow([i.incident_number, i.title, i.assigned_department, i.assigned_officer, i.priority, i.status, i.exposed_population, i.risk_index, i.created_at])
    return Response(content=output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=incident_interventions.csv"})

@router.get("", response_model=List[InterventionOut])
def list_interventions(db: Session = Depends(get_db)):
    return db.query(Intervention).order_by(Intervention.created_at.desc()).all()

@router.post("/{incident_id}/assign", response_model=InterventionOut)
def assign_intervention(incident_id: str, req: InterventionAssignRequest, db: Session = Depends(get_db)):
    inv = db.query(Intervention).filter(Intervention.id == incident_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Incident intervention not found")

    inv.assigned_department = req.assigned_department
    inv.assigned_officer = req.assigned_officer
    inv.priority = req.priority
    inv.status = "ASSIGNED"
    if req.notes:
        inv.action_taken_notes = req.notes

    db.commit()
    db.refresh(inv)
    return inv

@router.post("/{incident_id}/resolve", response_model=InterventionOut)
def update_status(incident_id: str, req: InterventionStatusUpdate, db: Session = Depends(get_db)):
    inv = db.query(Intervention).filter(Intervention.id == incident_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Incident intervention not found")

    inv.status = req.status
    if req.action_taken_notes:
        inv.action_taken_notes = req.action_taken_notes

    db.commit()
    db.refresh(inv)
    return inv

@router.get("/{incident_id}/report", response_class=HTMLResponse)
def get_incident_html_report(incident_id: str, db: Session = Depends(get_db)):
    inv = db.query(Intervention).filter(Intervention.id == incident_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Incident not found")

    data = {
        "incident_number": inv.incident_number,
        "title": inv.title,
        "city": "Hyderabad",
        "priority": inv.priority,
        "status": inv.status,
        "assigned_department": inv.assigned_department,
        "current_pm25": 146.0,
        "current_aqi": 245,
        "forecast_3h": 172.0,
        "exposed_population": inv.exposed_population,
        "exposed_schools": inv.exposed_schools,
        "exposed_hospitals": inv.exposed_hospitals,
        "risk_index": inv.risk_index,
        "probable_source": "Industrial Activity"
    }

    html = report_generator.generate_html_report(data)
    return HTMLResponse(content=html)
