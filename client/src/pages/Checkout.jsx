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
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Payment succeeded but confirmation failed');
      }
    }

    setProcessing(false);
  };

  if (success) {
    return <p>Payment successful! Redirecting you to products...</p>;
  }

  return (
    <div>
      <h2>Checkout</h2>
      {amount > 0 && <h3>Total: ${amount.toFixed(2)}</h3>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#fff' } } }} />
        <button type="submit" disabled={!stripe || processing} style={{ marginTop: '15px' }}>
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
