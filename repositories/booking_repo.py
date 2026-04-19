from models.booking import Booking


def get_booked_seats(session, movie_id: str):
    rows = session.query(Booking.seats).filter(
        Booking.movie_id == movie_id,
        Booking.status == "confirmed"
    ).all()

    # flatten
    return [seat for row in rows for seat in row[0]]
