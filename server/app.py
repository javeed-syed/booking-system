from flask import Flask, app, jsonify, request, redirect

from extensions import init_app
from services.session_service import create_session, get_session
from services.seats_service import get_all_seats, lock_seat, confirm_seat, release_seat
from services.movies_service import get_all_movies
from models.init import init_db
from config import OAUTH_HOST
from oauth import init_oauth
from flask_jwt_extended import create_access_token, jwt_required

app = Flask(__name__)
google = init_oauth(app)
init_app(app)
init_db()


@app.route("/")
def home():
    return f"App is running healthly."

@app.route("/login")
def login():
    redirect_uri = f"{OAUTH_HOST}/login/callback"

    return google.authorize_redirect(redirect_uri)

@app.route("/login/callback")
def callback():
    token = google.authorize_access_token()

    user = token['userinfo']

    jwt_token = create_access_token(
        identity=user["email"]
    )

    return redirect(
        f"{OAUTH_HOST}/auth-success?token={jwt_token}"
        
    )

@app.route("/profile")
@jwt_required()
def profile():
    return {"message": "protected"}

@app.route("/movies")
def get_movies():
    movies = get_all_movies()
    return jsonify(movies)

@app.route("/movies/<movie_id>/seats", methods=["GET"])
def get_movie_seats(movie_id):
    seats = get_all_seats(movie_id)
    return jsonify(seats)

@app.route("/movies/<movie_id>/seats/<seat_id>/hold", methods=["POST"])
def start_session(movie_id, seat_id):
    data = request.get_json()
    user_id = data.get("user_id")

    success = lock_seat(movie_id, seat_id, user_id)

    if success:
        session_data = create_session(user_id, movie_id, seat_id)
        return jsonify(session_data)

    return jsonify({"status": False}), 409

@app.route("/sessions/<session_id>/confirm", methods=["PUT"])
def confirm_seat_route(session_id):
    data = request.get_json()
    user_id = data.get("user_id")

    session = get_session(user_id, session_id)

    if not session:
        return jsonify({"message": "Session not found."}), 401

    confirm_seat(
        session.get("movie_id"), session.get("seat_id"), session.get("user_id")
    )

    return jsonify({"success": True})


@app.route("/sessions/<session_id>", methods=["DELETE"])
def delete_seat_route(session_id):
    data = request.get_json()
    user_id = data.get("user_id")

    session = get_session(user_id, session_id)

    if not session:
        return jsonify({"message": "Session not found."})

    release_seat(
        session.get("movie_id"), session.get("seat_id"), session.get("user_id")
    )

    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
