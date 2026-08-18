import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Cart() {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState('');

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.put('/cart/update', { productId, quantity });
      fetchCart();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      fetchCart();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (!cart) {
    return (
      <div className="page">
        <p>{message || 'Loading cart...'}</p>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);

  return (
    <div className="page">
      <div className="hero" style={{ paddingBottom: '30px' }}>
        <div className="hero-eyebrow">// your cart</div>
        <h1>Ready to check out?</h1>
      </div>

      {message && <p className="error-text" style={{ marginBottom: '20px' }}>{message}</p>}

      {cart.items.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>Your cart is empty.</p>
          <Link to="/">Browse products →</Link>
        </div>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.productId._id} className="cart-item">
              <img src={item.productId.image} alt={item.productId.name} />
              <div className="info">
                <h4>{item.productId.name}</h4>
                <span className="price-chip">${item.productId.price.toFixed(2)}</span>
              </div>
              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                >
                  −
                </button>
                <span style={{ minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(item.productId._id)}>
                Remove
              </button>
            </div>
          ))}

          <div className="cart-total">
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              TOTAL
            </span>
            <span className="price-chip">${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout">
            <button style={{ width: '100%', marginTop: '20px', padding: '14px' }}>
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;