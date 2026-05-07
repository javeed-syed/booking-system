import argparse

from extensions import SessionLocal
from models.init import init_db
from models.movie import Movie
from data import movies_data

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
        pass

    print("Seeded ✅")