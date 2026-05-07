from authlib.integrations.flask_client import OAuth
from flask_jwt_extended import JWTManager
from config import oauth_config, JWT_SECRET_KEY, APP_SECRET_KEY

def init_oauth(app):
    app.secret_key = APP_SECRET_KEY
    
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    JWTManager(app)
    
    oauth = OAuth(app)
    google = oauth.register(**oauth_config)

    return google

