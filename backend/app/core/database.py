import json
from sqlalchemy import create_engine, TypeDecorator, TEXT
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Engine setup supporting SQLite (standalone) & PostgreSQL/PostGIS
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Custom JSON type decorator for SQLite/PostgreSQL cross-compatibility
class JSONEncodedDict(TypeDecorator):
    impl = TEXT

    def process_bind_param(self, value, dialect):
        if value is not None:
            return json.dumps(value)
        return json.dumps({})

    def process_result_value(self, value, dialect):
        if value is not None:
            try:
                return json.loads(value)
            except Exception:
                return {}
        return {}
