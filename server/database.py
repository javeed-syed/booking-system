from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import create_engine
from .config import db_engine_kwargs
from models import *
from flask import g

engine = create_engine(**db_engine_kwargs)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine)

# --- DB session (per request) ---
def get_db():
    if "db" not in g:
        g.db = SessionLocal()
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()
