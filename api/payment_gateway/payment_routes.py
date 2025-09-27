# awakenU-sentiment-analysis/api/payment_gateway/payment_routes.py
import os
import razorpay
from flask import Blueprint, request, jsonify
import hmac
import hashlib

# Initialize Flask Blueprint
payment_bp = Blueprint('payment', __name__)

# Initialize Razorpay Client (ensure these are loaded from environment variables)
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise ValueError("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set as environment variables.")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
razorpay_client.set_app_details("awakenU-sentiment-analysis", "1.0") # Optional, for Razorpay analytics

# Helper function for Razorpay signature verification
def verify_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
    # Create the string to sign
    message = f"{razorpay_order_id}|{razorpay_payment_id}"
    # Generate the HMAC-SHA256 signature
    dig = hmac.new(
        RAZORPAY_KEY_SECRET.encode('utf-8'),
        msg=message.encode('utf-8'),
        digestmod=hashlib.sha256
    ).hexdigest()
    return dig == razorpay_signature

@payment_bp.route('/create-order', methods=['POST'])
def create_order():
    try:
        data = request.json
        amount = data.get('amount')
        currency = data.get('currency', 'INR') # Default to INR if not provided
        receipt = data.get('receipt', f"receipt_order_{data.get('selectedPlanId', 'unknown')}_{hashlib.sha1(os.urandom(12)).hexdigest()}")

        if not amount:
            return jsonify({'message': 'Amount is required.'}), 400

        # Razorpay expects amount in paisa/cents
        razorpay_amount = int(amount * 100)

        order_options = {
            'amount': razorpay_amount,
            'currency': currency,
            'receipt': receipt,
            'payment_capture': 1 # Auto capture payment
        }

        order = razorpay_client.order.create(order_options)
        return jsonify(order), 200

    except Exception as e:
        print(f"Error creating Razorpay order: {e}")
        return jsonify({'message': f'Failed to create order: {str(e)}'}), 500


@payment_bp.route('/verify-payment', methods=['POST'])
def verify_payment():
    try:
        data = request.json
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        selected_plan_id = data.get('selectedPlanId') # For your internal logic

        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return jsonify({'message': 'Missing payment verification details.'}), 400

        if verify_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
            # Payment is authentic and verified
            # --- IMPORTANT: Your business logic here ---
            # 1. Update your database: Mark the order as paid, associate payment_id with user, etc.
            # 2. Grant service access: e.g., enable premium export features for `selected_plan_id`.
            # Example: user_id = get_user_from_session() or from request.headers
            #          update_user_plan(user_id, selected_plan_id, razorpay_payment_id)

            print(f"Payment verified successfully for Order ID: {razorpay_order_id}, Plan: {selected_plan_id}")
            return jsonify({'message': 'Payment verified successfully!', 'status': 'success'}), 200
        else:
            print(f"Payment verification failed for Order ID: {razorpay_order_id}")
            return jsonify({'message': 'Payment verification failed!', 'status': 'failure'}), 400

    except Exception as e:
        print(f"Error verifying payment: {e}")
        return jsonify({'message': f'An error occurred during verification: {str(e)}'}), 500