def generate_all_seats(movie_id, rows, seats_per_row, booked_data):
    """
    booked_data = {
    "<movie_id>": {
        "<seat_id>": {"seat_id": "<seat_id>", "confirmed": True, "booked": True, "user_id": "<user_id>"},
        ...
    },
    ...
    }
    """
    seats = {}

    for r in range(rows):
        row_char = chr(65 + r)  # A, B, C...
        for c in range(1, seats_per_row + 1):
            seat_id = f"{row_char}{c}"

            # default seat
            seats[seat_id] = {"seat_id": seat_id, "booked": False, "confirmed": False, "user_id": None}

    # override booked seats
    if movie_id in booked_data:
        for seat_id, data in booked_data[movie_id].items():
            seats[seat_id] = data

    return seats