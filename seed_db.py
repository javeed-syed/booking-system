import json
import redis
import argparse

from config import redis_config
from extensions import SessionLocal
from models.init import init_db
from models.movie import Movie
from data import movies_data
from repositories.seat_repo import add_seats_to_redis

def get_redis():
    return redis.Redis(**redis_config)

def seed_seats_to_redis():
    r = get_redis()
    add_seats_to_redis(r)

def seed_movies_to_db():
    init_db()

    db = SessionLocal()
    try:
        for movie_id, data in movies_data.items():
            movie = db.get(Movie, movie_id)

            if movie is None:
                movie = Movie(id=movie_id)
                db.add(movie)

            movie.title = data["title"]
            movie.rows = data["rows"]
            movie.seats_per_row = data["seats_per_row"]
            movie.image_url = data["img_url"]

        db.commit()
    finally:
        db.close()



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--db-only",
        action="store_true",
        help="Seed only the SQL database and skip Redis seat data.",
    )
    args = parser.parse_args()

    seed_movies_to_db()

    if not args.db_only:
        seed_seats_to_redis()

    print("Seeded ✅")