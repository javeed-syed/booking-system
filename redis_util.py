from flask import g
import redis
from config import redis_config

def get_redis():
    if 'redis' not in g:
        g.redis = redis.Redis(**redis_config)
    return g.redis