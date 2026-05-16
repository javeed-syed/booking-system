from typing import Any

from authlib.integrations.flask_client import OAuth
from flask_jwt_extended import JWTManager
from config import oauth_config, JWT_SECRET_KEY, APP_SECRET_KEY
from server import app

oauth_client: Any = None

def init_oauth(app):
    global oauth_client
    app.secret_key = APP_SECRET_KEY
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    JWTManager(app)
    
    oauth = OAuth(app)
    oauth_client = oauth.register(**oauth_config)

