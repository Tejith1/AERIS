import csv
import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import CitizenReport
from app.schemas.schemas import CitizenReportCreate, CitizenReportOut
from app.services.multimodal_service import multimodal_service

router = APIRouter(prefix="/reports", tags=["Citizen Reports"])

@router.get("/export/csv")
def export_reports_csv(city: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(CitizenReport)
    if city:
        query = query.filter(CitizenReport.city == city)
    reports = query.order_by(CitizenReport.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Title", "Category", "Severity", "City", "Latitude", "Longitude", "Status", "Confidence", "Created At"])
    for r in reports:
        writer.writerow([r.id, r.title, r.category, r.severity, r.city, r.latitude, r.longitude, r.status, r.confidence_score, r.created_at])

    return Response(content=output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=citizen_reports.csv"})

@router.post("", response_model=CitizenReportOut)
def create_report(report_in: CitizenReportCreate, db: Session = Depends(get_db)):
    # Run computer vision analysis if photo provided or simulated
    cv_res = multimodal_service.analyze_image(report_in.photo_url)

    # Run voice STT processing if voice audio provided
    voice_res = multimodal_service.process_voice_report(
        report_in.voice_audio_path,
        report_in.description or report_in.title,
        report_in.detected_language
    )

    report = CitizenReport(
        title=report_in.title,
        description=voice_res.get("normalized_english_text", report_in.description),
        category=report_in.category or voice_res.get("predicted_category", "Industrial smoke"),
        severity=report_in.severity,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        city=report_in.city,
        address=report_in.address,
        original_text=voice_res.get("original_text", report_in.title),
        detected_language=report_in.detected_language,
        voice_audio_path=report_in.voice_audio_path,
        photo_url=report_in.photo_url,
        cv_detected_event=cv_res.get("event"),
        cv_confidence=cv_res.get("confidence"),
        cv_possible_source=cv_res.get("possible_source"),
        cv_explanation=cv_res.get("explanation"),
        status="SUBMITTED",
        confidence_score=0.88
    )

    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("", response_model=List[CitizenReportOut])
def list_reports(city: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(CitizenReport)
    if city:
        query = query.filter(CitizenReport.city == city)
    return query.order_by(CitizenReport.created_at.desc()).all()

@router.get("/{report_id}", response_model=CitizenReportOut)
def get_report(report_id: str, db: Session = Depends(get_db)):
    report = db.query(CitizenReport).filter(CitizenReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.post("/{report_id}/analyze")
def analyze_report_media(report_id: str, db: Session = Depends(get_db)):
    report = db.query(CitizenReport).filter(CitizenReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    cv_res = multimodal_service.analyze_image(report.photo_url)
    report.cv_detected_event = cv_res["event"]
    report.cv_confidence = cv_res["confidence"]
    report.cv_possible_source = cv_res["possible_source"]
    report.cv_explanation = cv_res["explanation"]

    db.commit()
    db.refresh(report)
    return {
        "report_id": report_id,
        "computer_vision": cv_res
    }
