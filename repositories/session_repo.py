import json

def store_session(r, session_data):
    key = f"session:{session_data['session_id']}"
    r.set(key, json.dumps(session_data), ex=300)

def map_user_session(r, user_id, session_id):
    key = f"user:{user_id}:session"
    r.set(key, session_id, ex=300)

def get_session_by_user_id_and_session_id(r, user_id, session_id):
    raw = r.get(f"session:{session_id}")
    if not raw:
        return None

    session = json.loads(raw)

    if session["user_id"] != user_id:
        return None

    return session