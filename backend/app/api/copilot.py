from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import CopilotQuery, CopilotAnswer
from app.services.copilot_service import copilot_service

router = APIRouter(prefix="/copilot", tags=["AERIS AI Copilot"])

@router.post("/ask", response_model=CopilotAnswer)
def ask_copilot(query: CopilotQuery, db: Session = Depends(get_db)):
    res = copilot_service.answer_query(db, query.question, query.city or "Hyderabad")
    return res
