from models.booking import Booking


def get_booked_seats(session, movie_id: str):
    rows = session.query(Booking).filter(
        Booking.movie_id == movie_id,
        Booking.status == "confirmed"
    ).all()

    return {
        seat_id: {"seat_id": seat_id, "booked": True, "confirmed": True, "user_id": row.user_id}
        for row in rows for seat_id in row.seats
    }

def create_booking(session, user_id: str, movie_id: str, seats: list):
    booking = Booking(
        user_id=user_id,
        movie_id=movie_id,
        seats=seats,
        payment_id="dummy_payment_id",
        status="confirmed"
    )
    session.add(booking)
    session.commit()
    return booking