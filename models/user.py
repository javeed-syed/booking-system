from datetime import datetime, timezone

from sqlalchemy import Column, String
from extensions import Base
from uuid import uuid4

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    provider = Column(String, nullable=False)
    provider_user_id = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, nullable=False, unique=True)
    created_at = Column(String, nullable=False, default=lambda: datetime.now(timezone.utc).isoformat())