from flask import Flask, app, jsonify
from flask_cors import CORS
from extensions import init_app
from config import FRONTEND_URL
from typing import Any

app = Flask(__name__)

CORS(
    app,
    supports_credentials=True,
    origins=[FRONTEND_URL or "*"]
)

init_app(app)

@app.route("/")
def home():
    return f"App is running healthly."

@app.errorhandler(Exception)
def handle_exception(e):
    print("An error occurred:", str(e))
    return jsonify({
        "success": False,
        "message": str(e)
    }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
