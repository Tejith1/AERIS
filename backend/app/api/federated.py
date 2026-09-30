from fastapi import APIRouter
from app.schemas.schemas import FederatedStatusResponse
from app.services.federated_service import federated_engine

router = APIRouter(prefix="/federated", tags=["Federated AI Network"])

@router.get("/status", response_model=FederatedStatusResponse)
def get_federated_status():
    return federated_engine.get_status()

@router.post("/train", response_model=FederatedStatusResponse)
def trigger_federated_round():
    return federated_engine.execute_training_round()
