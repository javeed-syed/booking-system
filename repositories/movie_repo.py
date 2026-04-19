from models.movie import Movie

def get_movies_from_db(db):
    movies = db.query(Movie).all()

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
