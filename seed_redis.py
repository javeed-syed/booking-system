import json
import redis
import seats_service
from config import redis_config

seats_data = {}

# "movie_2": {
#     "A1": {"seat_id": "A1", "confirmed": True, "booked": True, "user_id": "u1"},
# }

movies_data = {
    "movie_1": {
        "title": "Spider-Man: Brand New Day",
        "rows": 3,
        "seats_per_row": 5,
        "img_url": "https://m.media-amazon.com/images/S/aplus-media/sota/c9e84ba5-b727-41cc-8563-a29b54b74f50.__CR0,0,970,300_PT0_SX970_V1___.jpg",
    },
    "movie_2": {
        "title": "Avengers: Doomsday",
        "rows": 3,
        "seats_per_row": 5,
        "img_url": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a58a7719-0dcf-4e0b-b7bb-d2b725dbbb8e/deu7no3-75f2aea5-d668-4ddd-8d73-9203f8b3004f.png/v1/fill/w_1500,h_500,q_80,strp/spider_man_no_way_home_banner_hd_by_andrewvm_deu7no3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTAwIiwicGF0aCI6Ii9mL2E1OGE3NzE5LTBkY2YtNGUwYi1iN2JiLWQyYjcyNWRiYmI4ZS9kZXU3bm8zLTc1ZjJhZWE1LWQ2NjgtNGRkZC04ZDczLTkyMDNmOGIzMDA0Zi5wbmciLCJ3aWR0aCI6Ijw9MTUwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.GLJ4oWnOISFMjjY0QcoOv3W9xGZcegwXTIYxX0rhxuM",
    },
}


def get_redis():
    return redis.Redis(**redis_config)


def generate_all_seats(movie_id, rows, seats_per_row, booked_data):
    seats = {}

    for r in range(rows):
        row_char = chr(65 + r)  # A, B, C...
        for c in range(1, seats_per_row + 1):
            seat_id = f"{row_char}{c}"

            # default seat
            seats[seat_id] = {"seat_id": seat_id, "booked": False, "user_id": None}

    # override booked seats
    if movie_id in booked_data:
        for seat_id, data in booked_data[movie_id].items():
            seats[seat_id] = data

    return seats


if __name__ == "__main__":
    r = get_redis()

    # Movies
    for movie_id, data in movies_data.items():
        r.hset("movies", movie_id, json.dumps(data))

        # generate full seat map
        seats = generate_all_seats(
            movie_id, data["rows"], data["seats_per_row"], seats_data
        )

        # store all seats
        for seat_id, seat_data in seats.items():
            seats_service.add_seat(r, movie_id, seat_id, seat_data)

    print("Seeded ✅")
