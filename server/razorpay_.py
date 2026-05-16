import razorpay
from typing import Any

from server.config import RAZOR_PAY_API_KEY, RAZOR_PAY_API_SECRET

razorpay_client: Any = None

def init_razorpay(app):
    global razorpay_client

    razorpay_client = razorpay.Client(
        auth=(
            RAZOR_PAY_API_KEY,
            RAZOR_PAY_API_SECRET
        )
    )