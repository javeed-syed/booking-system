from dotenv import dotenv_values

config = dotenv_values(".env")

redis_config = {
    "host": config.get("REDIS_HOST", "localhost"),
    "port": int(config.get("REDIS_PORT") or "6379"),
    "decode_responses": True,
    "username": config.get("REDIS_USERNAME", None),
    "password": config.get("REDIS_PASSWORD", None)
}