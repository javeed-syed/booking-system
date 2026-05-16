from flask import Blueprint, request, jsonify
from services.session_service import get_session
from services.seats_service import confirm_seat, release_seat

session_bp = Blueprint("sessions", __name__, url_prefix="/sessions")

@session_bp.route("/<session_id>/confirm", methods=["PUT"])
def confirm_seat_route(session_id):
    data = request.get_json()
    user_id = data.get("user_id")
    payment_id = data.get("payment_id")

    session = get_session(user_id, session_id)

    if not session:
        return jsonify({"message": "Session not found."}), 401

    confirm_seat(
        session.get("movie_id"), session.get("seat_id"), session.get("user_id"), payment_id
    )

    return jsonify({"success": True})


@session_bp.route("/<session_id>", methods=["DELETE"])
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
