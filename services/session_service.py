import uuid
import json
from datetime import datetime, timedelta

from extensions import get_redis
import repositories.session_repo as session_repo

def create_session(user_id, movie_id, seat_id):
    r = get_redis()
    session_id = str(uuid.uuid4())
    expires_at = datetime.now().astimezone() + timedelta(minutes=5.0)

    session_data = {
        "session_id": session_id,
        "user_id": user_id,
        "movie_id": movie_id,
        "seat_id": seat_id,
        "expires_at": expires_at.isoformat(),
        "status": "locked",
    }

    session_repo.store_session(r, session_data)
    session_repo.map_user_session(r, user_id, session_id)
    return session_data

def get_session(user_id, session_id):
    r = get_redis()
    return session_repo.get_session_by_user_id_and_session_id(r, user_id, session_id)
