# db_init.py
# IMPORTANT: import all models

from extensions import engine, Base
from models import * 

def init_db():
    Base.metadata.create_all(bind=engine)