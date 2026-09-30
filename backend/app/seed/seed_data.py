from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.domain import User, CitizenReport, EnvironmentalObservation, Hotspot, InfrastructureItem, Intervention, Alert
from app.providers.demo_provider import DemoDataProvider

demo_provider = DemoDataProvider()

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if users exist
        if db.query(User).first():
            print("Database already seeded.")
            return

        print("Seeding AERIS Database with initial demo records...")

        # 1. Users
        admin_user = User(
            email="admin@aeris.gov.in",
            hashed_password=get_password_hash("Admin123!"),
            full_name="Dr. K. S. Rao (Chief Architect)",
            role="admin",
            department="Central Environmental Intelligence Board",
            city="Hyderabad"
        )
        authority_user = User(
            email="authority@pcb.gov.in",
            hashed_password=get_password_hash("Authority123!"),
            full_name="Inspector R. Sharma",
            role="authority",
            department="State Pollution Control Board",
            city="Hyderabad"
        )
        citizen_user = User(
            email="citizen@aeris.app",
            hashed_password=get_password_hash("Citizen123!"),
            full_name="Ananya Verma",
            role="citizen",
            city="Hyderabad"
        )

        db.add_all([admin_user, authority_user, citizen_user])
        db.commit()

        # 2. Infrastructure Items across cities
        cities = ["Hyderabad", "Bengaluru", "Chennai", "Delhi", "Mumbai"]
        for city in cities:
            infra_list = demo_provider.get_infrastructure(city)
            for item in infra_list:
                db_item = InfrastructureItem(
                    name=item["name"],
                    category=item["category"],
                    city=city,
                    latitude=item["latitude"],
                    longitude=item["longitude"],
                    capacity_or_size=item["capacity_or_size"],
                    risk_sensitivity=item["risk_sensitivity"]
                )
                db.add(db_item)

        # 3. Baseline Environmental Observations
        for city in cities:
            aq = demo_provider.get_air_quality(city, 17.3850, 78.4867)
            obs = EnvironmentalObservation(
                city=city,
                station_id=f"{city.upper()}_CENTRAL_01",
                latitude=aq["latitude"],
                longitude=aq["longitude"],
                aqi=aq["aqi"],
                pm25=aq["pm25"],
                pm10=aq["pm10"],
                no2=aq["no2"],
                temperature=30.2,
                humidity=62.0,
                wind_speed=11.5,
                wind_direction=225.0,
                source_type="LIVE"
            )
            db.add(obs)

        # 4. Active Demo Hotspots (Hyderabad)
        h1 = Hotspot(
            title="Industrial Corridor Anomaly #H1042",
            city="Hyderabad",
            latitude=17.4401,
            longitude=78.3489,
            radius_km=1.8,
            severity="CRITICAL",
            status="ACTIVE",
            event_category="Industrial smoke",
            confidence_score=0.91,
            probable_source="Industrial Activity",
            source_confidence=0.87,
            current_pm25=146.0,
            current_pm10=218.0,
            current_aqi=245,
            current_no2=68.5,
            evidence_list=[
                "PM2.5 increased 42% above baseline",
                "NO2 anomaly detected near chemical zone",
                "Sentinel-5P TROPOMI satellite NO2 plume correlation",
                "Low wind velocity (6 km/h SW)",
                "14 citizen smoke reports verified nearby"
            ],
            contributing_report_count=14
        )
        db.add(h1)
        db.commit()
        db.refresh(h1)

        # 5. Citizen Reports
        cr1 = CitizenReport(
            user_id=citizen_user.id,
            title="Dense Industrial Chemical Plume in Sanathnagar",
            description="Thick dark grey smoke rising from factory chimney, pungent chemical odor in air.",
            category="Industrial smoke",
            severity="High",
            latitude=17.4412,
            longitude=78.3495,
            city="Hyderabad",
            address="Sanathnagar Industrial Sector 3",
            cv_detected_event="Dense Industrial Smoke Plume Detected",
            cv_confidence=0.88,
            cv_possible_source="Industrial Emission",
            cv_explanation="Computer vision model detected dark grey particulate plume emanating from industrial stack.",
            status="VERIFIED",
            confidence_score=0.91
        )
        db.add(cr1)

        # 6. Interventions
        inv1 = Intervention(
            incident_number="INC-2041",
            hotspot_id=h1.id,
            title="Industrial Emissions Inspection & Compliance Mandate",
            assigned_department="State Pollution Control Board",
            assigned_officer="Inspector R. Sharma",
            priority="CRITICAL",
            status="UNDER_INVESTIGATION",
            recommended_action="1. Deploy field inspection team immediately.\n2. Issue temporary compliance audit notice to Sector 3 facility.\n3. Issue local health advisory for nearby primary schools.",
            action_taken_notes="Field inspection team dispatched to site. Stationary drone air sample collection initiated.",
            exposed_population=18420,
            exposed_schools=4,
            exposed_hospitals=1,
            risk_index=85.4
        )
        db.add(inv1)

        # 7. Alerts
        a1 = Alert(
            title="CRITICAL: Industrial Pollution Spike Detected",
            message="PM2.5 concentration reached 146 µg/m³ near Sanathnagar Industrial Sector. 4 schools affected.",
            alert_type="CRITICAL",
            city="Hyderabad",
            hotspot_id=h1.id,
            acknowledged=False
        )
        db.add(a1)

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
