import json

STREAM = "booking_stream"

def produce_event_to_stream(r, user_id, seat_id):
    event = {
        "user_id": user_id,
        "seat_id": seat_id
    }
    r.xadd(STREAM, {"data": json.dumps(event)}, maxlen=10000, approximate=True)
    return True