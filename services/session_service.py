import uuid
import json
from datetime import datetime, timedelta


def create_session(r, user_id, movie_id, seat_id):
    session_id = str(uuid.uuid4())
    session_key = f"session:{session_id}"
    user_session_key = f"user:{user_id}:session"

    expires_at = datetime.now().astimezone() + timedelta(minutes=5.0)

    session_data = {
        "session_id": session_id,
        "user_id": user_id,
        "movie_id": movie_id,
        "seat_id": seat_id,
        "expires_at": expires_at.isoformat(),
        "status": "locked",
    }

    r.set(session_key, json.dumps(session_data), ex=300)
    r.set(user_session_key, session_id, ex=300)
    return session_data


def get_session_by_id(r, session_id):
    raw = r.get(f"session:{session_id}")
    if not raw:
        return None
    return json.loads(raw)


def get_session_by_user(r, user_id):
    session_id = r.get(f"user:{user_id}:session")
    if not session_id:
        return None

    raw = r.get(f"session:{session_id}")
    if not raw:
        return None

    return json.loads(raw)


def get_session(r, user_id, session_id):
    raw = r.get(f"session:{session_id}")
    if not raw:
        return None

    session = json.loads(raw)

    if session["user_id"] != user_id:
        return None  # mismatch

    return session
