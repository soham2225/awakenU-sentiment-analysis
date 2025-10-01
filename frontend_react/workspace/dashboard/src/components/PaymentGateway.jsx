import React, { useState } from 'react';

const PaymentGateway = ({ onClose, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'basic',
      name: 'Basic Export',
      price: '$9.99',
      amount_cents: 999,
      features: ['Export up to 1,000 records', 'CSV format', 'Basic analytics', '24h support']
    },
    {
      id: 'pro',
      name: 'Pro Export',
      price: '$29.99',
      amount_cents: 2999,
      features: ['Export up to 10,000 records', 'Multiple formats (CSV, JSON, Excel)', 'Advanced analytics', 'Priority support', 'Custom filters']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Export',
      price: '$99.99',
      amount_cents: 9999,
      features: ['Unlimited exports', 'All formats + API access', 'Real-time data', 'Dedicated support', 'Custom integrations', 'White-label reports']
    }
  ];

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Call backend to create Stripe checkout session
      const response = await fetch('https://awakenu-sentiment-analysis.onrender.com/api/checkout', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          amount_cents: plans.find(p => p.id === selectedPlan)?.amount_cents,
          currency: 'usd'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const totalAmount = selectedPlanData ? (selectedPlanData.amount_cents / 100) + 0.99 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Export Data - Payment Required</h2>
              <p className="text-gray-300 mt-1">Choose your export plan to continue</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Plan Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Select Export Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="text-center mb-4">
                    <h4 className="text-white font-semibold">{plan.name}</h4>
                    <p className="text-2xl font-bold text-blue-400 mt-2">{plan.price}</p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-center">
                        <svg className="h-4 w-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-400 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Credit/Debit Card</p>
                    <p className="text-gray-300 text-sm">Visa, Mastercard, American Express</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-400 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PP</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">PayPal</p>
                    <p className="text-gray-300 text-sm">Pay with your PayPal account</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> You'll be redirected to Stripe's secure checkout page to complete your payment. 
                After successful payment, you'll be redirected back to download your data export.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h4 className="text-white font-semibold mb-3">Order Summary</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">{selectedPlanData?.name}</span>
              <span className="text-white font-medium">{selectedPlanData?.price}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Processing Fee</span>
              <span className="text-white font-medium">$0.99</span>
            </div>
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total</span>
                <span className="text-blue-400 font-bold text-lg">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={processing}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Checkout...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Proceed to Checkout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;