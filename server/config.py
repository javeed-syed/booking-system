import os

from dotenv import dotenv_values

config = dotenv_values(".env")

redis_config = {
    "host": config.get("REDIS_HOST", "localhost"),
    "port": int(config.get("REDIS_PORT") or "6379"),
    "decode_responses": True,
    "username": config.get("REDIS_USERNAME", None),
    "password": config.get("REDIS_PASSWORD", None)
}

oauth_config = {
    "name": "google",
    "client_id": config.get("GOOGLE_CLIENT_ID", None),
    "client_secret": config.get("GOOGLE_CLIENT_SECRET", None),
    "server_metadata_url": "https://accounts.google.com/.well-known/openid-configuration",
    "client_kwargs": {
        "scope": "openid email profile"
    }
}

JWT_SECRET_KEY = config.get("JWT_SECRET_KEY", os.urandom(24))
APP_SECRET_KEY = config.get("APP_SECRET_KEY", os.urandom(24))
OAUTH_HOST = config.get("OAUTH_HOST", "http://localhost:8000")