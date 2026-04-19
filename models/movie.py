from sqlalchemy import Column, Integer, String
from extensions import Base
from uuid import uuid4

class Movie(Base):
    __tablename__ = "movies"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    rows = Column(Integer, nullable=False, default=5)
    seats_per_row = Column(Integer, nullable=False, default=8)