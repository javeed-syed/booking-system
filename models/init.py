# db_init.py
# IMPORTANT: import all models

from extensions import engine, Base
from models.booking import Booking
from models.movie import Movie
from models.user import User

def init_db():
    Base.metadata.create_all(bind=engine)