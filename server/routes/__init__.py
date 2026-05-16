from payments import payments_bp
from auth import auth_bp
from movies import movies_bp
from sessions import session_bp

def register_blueprints(app):
    app.register_blueprint(payments_bp, url_prefix="/payments")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(movies_bp, url_prefix="/movies")
    app.register_blueprint(session_bp, url_prefix="/sessions")
    return app