from repositories.movie_repo import get_movies_from_db
from extensions import get_db

def get_all_movies():
    db = get_db()
    movies = get_movies_from_db(db)

    return [
        {
            "movie_id": movie.id,
            "title": movie.title,
            "img_url": movie.image_url,
            "rows": movie.rows,
            "seats_per_row": movie.seats_per_row,
        }
        for movie in movies
    ]
