import json

# redis

def add_seat(r, movie_id, seat_id, data):
    seat_key = f"seat:{movie_id}:{seat_id}"
    seats_set_key = f"movie:{movie_id}:seats"

    # store seat
    r.set(seat_key, json.dumps(data))

    # add to index
    r.sadd(seats_set_key, seat_id)

def create_lock_seat(r, movie_id, seat_id, user_id):
    seat_key = f"seat:{movie_id}:{seat_id}"
    lock_key = f"lock:{movie_id}:{seat_id}"

    raw = r.get(seat_key)
    if not raw:
        return False

    seat = json.loads(raw)

    if seat.get("booked"):
        return False

    return r.set(lock_key, user_id, ex=300, nx=True)

def update_lock_seat_confirm(r, movie_id, seat_id, user_id):
    lock_key = f"lock:{movie_id}:{seat_id}"
    seat_key = f"seat:{movie_id}:{seat_id}"

    raw = r.get(seat_key)
    if not raw:
        return False

    seat = json.loads(raw)

    # already booked → reject
    if seat.get("confirmed"):
        return False

    # validate lock ownership
    if r.get(lock_key) != user_id:
        return False

    # update safely
    seat["confirmed"] = True
    seat["user_id"] = user_id

    r.set(seat_key, json.dumps(seat))
    r.delete(lock_key)

    return True

def update_lock_seat_release(r, movie_id, seat_id, user_id):
    lock_key = f"lock:{movie_id}:{seat_id}"

    # validate lock ownership
    if r.get(lock_key) != user_id:
        return False

    r.delete(lock_key)
    return True

def update_seat(r, movie_id, seat_id, updates: dict):
    seat_key = f"seat:{movie_id}:{seat_id}"

    raw = r.get(seat_key)
    if not raw:
        return False  # seat doesn't exist

    seat = json.loads(raw)

    # merge updates
    seat.update(updates)

    r.set(seat_key, json.dumps(seat))
    return True

def movie_seats_exists(r, movie_id):
    seats_set_key = f"movie:{movie_id}:seats"
    return r.exists(seats_set_key)

def get_movie_seats(r, movie_id):

    seat_ids = r.smembers(f"movie:{movie_id}:seats")

    seats = []
    for seat_id in seat_ids:
        seat = json.loads(r.get(f"seat:{movie_id}:{seat_id}"))

        lock = r.get(f"lock:{movie_id}:{seat_id}")

        if lock:
            seat["booked"] = True
            seat["user_id"] = lock

        seats.append(seat)

    return seats
