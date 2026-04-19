from flask import Flask, app, render_template, jsonify, request

import json

from extensions import get_db, get_redis, init_app
from repositories.movie_repo import get_movies_from_db
from services.seats_service import get_all_seats, lock_seat, confirm_seat, release_seat
from services.session_service import create_session, get_session
from models.init import init_db

app = Flask(__name__)
init_app(app)
init_db()

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/movies")
def get_movies():
    db = get_db()
    movies = get_movies_from_db(db)
    return jsonify(movies)


@app.route("/movies/<movie_id>/seats", methods=["GET"])
def get_movie_seats(movie_id):
    r = get_redis()
    seats = get_all_seats(r, movie_id)
    return jsonify(seats)


@app.route("/movies/<movie_id>/seats/<seat_id>/hold", methods=["POST"])
def start_session(movie_id, seat_id):
    data = request.get_json()
    user_id = data.get("user_id")

    r = get_redis()

    success = lock_seat(r, movie_id, seat_id, user_id)

    if success:
        session_data = create_session(r, user_id, movie_id, seat_id)
        return jsonify(session_data)

    return jsonify({"status": False}), 409


@app.route("/sessions/<session_id>/confirm", methods=["PUT"])
def confirm_seat_route(session_id):
    data = request.get_json()
    user_id = data.get("user_id")

    r = get_redis()
    session = get_session(r, user_id, session_id)

    if not session:
        return jsonify({"message": "Session not found."}), 401

    confirm_seat(
        r, session.get("movie_id"), session.get("seat_id"), session.get("user_id")
    )

    return jsonify({"success": True})


@app.route("/sessions/<session_id>", methods=["DELETE"])
def delete_seat_route(session_id):
    data = request.get_json()
    user_id = data.get("user_id")

    r = get_redis()
    session = get_session(r, user_id, session_id)

    if not session:
        return jsonify({"message": "Session not found."})

    release_seat(
        r, session.get("movie_id"), session.get("seat_id"), session.get("user_id")
    )

    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
