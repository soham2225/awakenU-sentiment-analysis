import React, { useState } from 'react';

const PaymentGateway = ({ onClose, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'basic',
      name: 'Basic Export',
      price: '₹499',
      amount_cents: 49900,
      features: ['Export up to 1,000 records', 'CSV format', 'Basic analytics', '24h support']
    },
    {
      id: 'pro',
      name: 'Pro Export',
      price: '₹999',
      amount_cents: 99900,
      features: ['Export up to 10,000 records', 'CSV, JSON, Excel', 'Advanced analytics', 'Priority support', 'Custom filters']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Export',
      price: '₹1999',
      amount_cents: 199900,
      features: ['Unlimited exports', 'API access', 'Real-time data', 'Dedicated support', 'Custom integrations', 'White-label reports']
    }
  ];

  // ✅ Load Razorpay SDK before payment
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Handle Payment
  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Failed to load Razorpay SDK. Check your internet connection.');
      setProcessing(false);
      return;
    }

    try {
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      const amount = selectedPlanData?.amount_cents / 100;

      // 1️⃣ Create Razorpay order
      const response = await fetch('https://awakenu-sentiment-analysis.onrender.com/api/payment_gateway/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          selectedPlanId: selectedPlan
        })
      });

      const orderData = await response.json();
      if (!response.ok || !orderData.id) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // 2️⃣ Configure Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AwakenU Premium Export',
        description: selectedPlanData.name,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 3️⃣ Verify Payment
            const verifyResponse = await fetch('https://awakenu-sentiment-analysis.onrender.com/api/payment_gateway/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                selectedPlanId: selectedPlan
              })
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.status === 'success') {
              onSuccess();
            } else {
              setError('Payment verification failed.');
            }
          } catch {
            setError('Error verifying payment.');
          } finally {
            setProcessing(false);
          }
        },
        theme: { color: '#3399cc' },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            onClose();
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setError(err.message);
      setProcessing(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const totalAmount = selectedPlanData ? selectedPlanData.amount_cents / 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 max-w-3xl w-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Export Data - Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {error && <p className="text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded mb-4">{error}</p>}

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedPlan === plan.id ? 'bg-blue-600/30 border-blue-400' : 'bg-gray-800 border-gray-700 hover:bg-gray-700/50'
              } border`}
            >
              <h3 className="text-white text-lg font-semibold">{plan.name}</h3>
              <p className="text-blue-400 font-bold text-xl mt-2">{plan.price}</p>
              <ul className="text-gray-300 text-sm mt-3 space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 border-t border-gray-700 pt-4">
          <span className="text-gray-300">Total Amount:</span>
          <span className="text-blue-400 font-bold text-lg">₹{totalAmount}</span>
        </div>

        <div className="flex mt-6 gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
