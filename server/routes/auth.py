from flask import Blueprint, make_response, redirect, jsonify
from config import BACKEND_URL, FRONTEND_URL, ENV
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from oauth import oauth_client

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/google/login")
def login():
    redirect_uri = f"{BACKEND_URL}/login/callback"

    return oauth_client.authorize_redirect(redirect_uri)

# Todo: change to auth
@auth_bp.route("/login/callback")
def callback():
    token = oauth_client.authorize_access_token()

    user = token['userinfo']

    jwt_token = create_access_token(
    identity=user["email"],
    additional_claims={
        "name": user["name"],
        "picture": user["picture"]
    }
)

    response = make_response(
        redirect(f"{FRONTEND_URL}")
    )

    response.set_cookie(
        "access_token_cookie",
        jwt_token,
        httponly=True,
        secure=ENV == "prod", 
        samesite="Lax",
        max_age=60 * 60 * 24 * 7
    )

    return response

@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "logged out"})

    response.set_cookie(
        "access_token_cookie",
        "",
        expires=0,
        httponly=True,
        samesite="Lax"
    )

    return response

@auth_bp.route("/me")
@jwt_required()
def profile():
    email = get_jwt_identity()
    claims = get_jwt()

    return {
            "email": email,
            "name": claims["name"],
            "picture": claims["picture"]
    }, 200