from repositories.booking_repo import get_booked_seats
from services import seats_service
from utils import generate_all_seats
from data import movies_data

def add_seats_to_redis(r, seats_data = None):
    for movie_id, data in movies_data.items():

        seats = generate_all_seats(
            movie_id, data["rows"], data["seats_per_row"], seats_data or {}
        )

        for seat_id, seat_data in seats.items():
            seats_service.add_seat(r, movie_id, seat_id, seat_data)

def load_seats_to_redis(r, db, movie_id):
    try:
        seats = get_booked_seats(db, movie_id)
        add_seats_to_redis(r, seats)
    except Exception as e:
        print(f"Error loading seats to Redis for movie {movie_id}: {e}")