from flask import Blueprint, request, jsonify
from razorpay_ import razorpay_client
from razorpay.errors import SignatureVerificationError

payments_bp = Blueprint("payments", __name__, url_prefix="/payments")

@payments_bp.route("/create-order", methods=["POST"])
def create_order():
    data = request.get_json()
    order_data = {
        "amount": int(data["amount"]),
        "currency": "INR",
        "receipt": f"{data['session_id']}"
    }

    payment = razorpay_client.order.create(data=order_data)

    print("Created order:", payment)
    return jsonify({
        "order_id": payment['id'],
        "amount": payment['amount'],
        "receipt": payment['receipt']
    })

@payments_bp.route("/verify", methods=["POST"])
def verify_order():
    data = request.get_json()
    order_data = {
        'razorpay_order_id': data['order_id'],
        'razorpay_payment_id': data['payment_id'],
        'razorpay_signature': data['signature']
    }
    try:
        razorpay_client.utility.verify_payment_signature(order_data)

        return jsonify({
            "success": True,
            "message": "Payment verified"
        }), 200

    except SignatureVerificationError:

        return jsonify({
            "success": False,
            "message": "Invalid signature"
        }), 400