from flask import Blueprint, request, jsonify
from services.seats_service import get_all_seats, lock_seat
from services.movies_service import get_all_movies
from services.session_service import create_session

movies_bp = Blueprint("movies", __name__, url_prefix="/movies")

@movies_bp.route("/")
def get_movies():
    movies = get_all_movies()
    return jsonify(movies)

@movies_bp.route("/<movie_id>/seats", methods=["GET"])
def get_movie_seats(movie_id):
    seats = get_all_seats(movie_id)
    return jsonify(seats)

@movies_bp.route("/<movie_id>/seats/<seat_id>/hold", methods=["POST"])
def start_session(movie_id, seat_id):
    data = request.get_json()
    user_id = data.get("user_id")

    success = lock_seat(movie_id, seat_id, user_id)

    if success:
        session_data = create_session(user_id, movie_id, seat_id)
        return jsonify(session_data)

    return jsonify({"status": False}), 409