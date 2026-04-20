from models.movie import Movie

def get_movies_from_db(db):
    movies = db.query(Movie).all()
    return movies