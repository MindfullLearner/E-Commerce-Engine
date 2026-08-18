import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';

function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const createIntent = async () => {
      try {
        const res = await api.post('/checkout/create-payment-intent');
        setClientSecret(res.data.clientSecret);
        setAmount(res.data.amount);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not start checkout');
      }
    };

    createIntent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError('');

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
      return;
    }

    if (result.paymentIntent.status === 'succeeded') {
      try {
        await api.post('/checkout/confirm', {
          paymentIntentId: result.paymentIntent.id,
        });
        setSuccess(true);
        setTimeout(() => navigate('/'), 2200);
      } catch (err) {
        setError(err.response?.data?.message || 'Payment succeeded but confirmation failed');
      }
    }

    setProcessing(false);
  };

  if (success) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="hero-eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>
            // transaction complete
          </div>
          <h1 style={{ fontSize: '32px' }}>Payment confirmed.</h1>
          <p>Redirecting you back to the catalog…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="hero" style={{ paddingBottom: '30px' }}>
        <div className="hero-eyebrow">// secure checkout</div>
        <h1>Complete your order.</h1>
      </div>

      {amount > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px', marginRight: '10px' }}>
            AMOUNT DUE
          </span>
          <span className="price-chip" style={{ fontSize: '18px' }}>${amount.toFixed(2)}</span>
        </div>
      )}

      {error && <p className="error-text" style={{ marginBottom: '20px' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '420px' }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
          CARD DETAILS
        </label>
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '14px',
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '15px',
                  color: '#f5f5f7',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#8a8a93' },
                },
              },
            }}
          />
        </div>
        <button type="submit" disabled={!stripe || processing} style={{ marginTop: '18px', width: '100%', padding: '14px' }}>
          {processing ? 'Processing…' : `Pay $${amount ? amount.toFixed(2) : '0.00'}`}
        </button>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
          🔒 Payments are processed securely by Stripe. Card details never touch our servers.
        </p>
      </form>
    </div>
  );
}

export default Checkout;