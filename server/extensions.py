from server.razorpay_ import init_razorpay
from server.database import init_db, close_db
from server.oauth import init_oauth
from server.routes import register_blueprints
from server.redis_ import close_redis

# --- Flask app init hook ---
def init_app(app):

    # Cleanup handlers
    app.teardown_appcontext(close_db)
    app.teardown_appcontext(close_redis)

    # Extensions/services
    init_db()
    init_razorpay(app)
    init_oauth(app)

    # Routes
    register_blueprints(app)