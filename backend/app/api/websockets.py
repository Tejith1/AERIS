import asyncio
import json
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.simulation_service import simulation_runner

router = APIRouter(prefix="/ws", tags=["WebSockets Real-Time Stream"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

@router.websocket("/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Send real-time telemetry every 3 seconds
            tick = simulation_runner.advance_tick() if simulation_runner.is_running else {"status": "PAUSED"}
            payload = {
                "event_type": "TELEMETRY_UPDATE",
                "timestamp": asyncio.get_event_loop().time(),
                "simulation": tick
            }
            await websocket.send_json(payload)
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.websocket("/simulation")
async def websocket_simulation(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(2)
            if simulation_runner.is_running:
                tick = simulation_runner.advance_tick()
                await websocket.send_json({"event_type": "SIMULATION_TICK", "data": tick})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
