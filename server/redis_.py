from flask import g
import redis
from config import redis_config

# --- Redis (connection pooled internally) ---
def get_redis():
    if "redis" not in g:
        g.redis = redis.Redis(
            **redis_config
        )
    return g.redis

def close_redis(e=None):
    r = g.pop("redis", None)
    if r is not None:
        try:
            r.close()   
        except Exception:
            pass