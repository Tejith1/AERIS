from fastapi import APIRouter
from app.services.simulation_service import simulation_runner

router = APIRouter(prefix="/simulation", tags=["Real-Time Simulation"])

@router.get("/status")
def get_simulation_status():
    return {
        "is_running": simulation_runner.is_running,
        "current_step": simulation_runner.current_step,
        "timeline": simulation_runner.timeline_events
    }

@router.post("/start")
def start_simulation():
    simulation_runner.start_simulation()
    return {"message": "Demo scenario simulation started", "status": "RUNNING"}

@router.post("/stop")
def stop_simulation():
    simulation_runner.stop_simulation()
    return {"message": "Simulation paused", "status": "PAUSED"}

@router.post("/tick")
def advance_tick():
    return simulation_runner.advance_tick()
