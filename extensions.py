from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from flask import g, current_app
import redis
from config import redis_config

DATABASE_URL = "sqlite:///app.db"

# Engine (pooling + sane defaults)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite only
    pool_pre_ping=True,
    pool_size=5,          # tune based on load (guess: small app)
    max_overflow=10,
    echo=False            # disable in prod
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()


# --- DB session (per request) ---
def get_db():
    if "db" not in g:
        g.db = SessionLocal()
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


# --- Redis (connection pooled internally) ---
def get_redis():
    if "redis" not in g:
        g.redis = redis.Redis(
            decode_responses=True,  # avoid bytes handling
            **redis_config
        )
    return g.redis


def close_redis(e=None):
    r = g.pop("redis", None)
    if r is not None:
        try:
            r.close()   # safe for redis-py >=4
        except Exception:
            pass


# --- Flask app init hook ---
def init_app(app):
    app.teardown_appcontext(close_db)
    app.teardown_appcontext(close_redis)

