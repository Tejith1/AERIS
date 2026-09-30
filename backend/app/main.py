from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.seed.seed_data import seed_database
from app.api import auth, reports, hotspots, air_quality, exposure, incidents, alerts, federated, simulation, copilot, websockets

# Initialize database tables & seed initial demo data
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AERIS: AI Environmental Risk & Intelligence System API Gateway",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(hotspots.router, prefix=settings.API_V1_STR)
app.include_router(air_quality.router, prefix=settings.API_V1_STR)
app.include_router(exposure.router, prefix=settings.API_V1_STR)
app.include_router(incidents.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(federated.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(copilot.router, prefix=settings.API_V1_STR)
app.include_router(websockets.router)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "tagline": "From environmental signals to actionable climate intelligence.",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected",
        "ai_engine": "online",
        "federated_network": "active"
    }
