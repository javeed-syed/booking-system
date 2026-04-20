from sqlalchemy import Column, String, DateTime, Index, JSON
from extensions import Base
from uuid import uuid4
from datetime import datetime


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, nullable=False)

    movie_id = Column(String, nullable=False, index=True)  # critical index

    seats = Column(JSON, nullable=False)  # ["A1","A2"]

    payment_id = Column(String, nullable=True) 

    status = Column(String, nullable=False, index=True)  # confirmed/failed

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_movie_status", "movie_id", "status"),  # fast startup sync
    )