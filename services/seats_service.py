import json

from extensions import get_db, get_redis
from repositories.producer_repo import produce_event_to_stream
from repositories.seat_repo import get_movie_seats, movie_seats_exists, add_seat, create_lock_seat, update_lock_seat_confirm, update_lock_seat_release, validate_lock
from repositories.booking_repo import create_booking, get_booked_seats
from utils import generate_all_seats
from data import movies_data


def get_all_seats(movie_id):
    r = get_redis()
    
    seats_exists = movie_seats_exists(r, movie_id)

    if not seats_exists:
        try:
            db = get_db()
            booked_seats = get_booked_seats(db, movie_id)

            for movie_id, data in movies_data.items():

                seats = generate_all_seats(
                    movie_id, data["rows"], data["seats_per_row"], booked_seats or {}
                )

                for seat_id, seat_data in seats.items():
                    add_seat(r, movie_id, seat_id, seat_data)
                    
        except Exception as e:
            print(f"Error loading seats to Redis for movie {movie_id}: {e}")

    return get_movie_seats(r, movie_id)

def lock_seat(movie_id, seat_id, user_id):
    
    r = get_redis()
    return create_lock_seat(r, movie_id, seat_id, user_id)

def confirm_seat(movie_id, seat_id, user_id):
    r = get_redis()
    db = get_db()
    validate_lock(r, movie_id, seat_id, user_id)
    create_booking(db, user_id, movie_id, [seat_id])
    update_lock_seat_confirm(r, movie_id, seat_id, user_id)

def release_seat(movie_id, seat_id, user_id):
    r = get_redis()
    return update_lock_seat_release(r, movie_id, seat_id, user_id)