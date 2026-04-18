def get_movies():
    path = pathlib.Path(__file__).resolve().parent / "movies.json"
    with open(path, 'r') as file:
        data = file.read()
        movies_json = json.loads(data)
    return jsonify(movies_json)