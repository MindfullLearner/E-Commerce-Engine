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
    return <p>{message || 'Loading cart...'}</p>;
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);

return (
  <div className="page">
    <h2>Your Cart</h2>
    {message && <p className="error-text">{message}</p>}

    {cart.items.length === 0 ? (
      <p>Your cart is empty. <Link to="/">Browse products</Link></p>
    ) : (
      <div>
        {cart.items.map((item) => (
          <div key={item.productId._id} className="cart-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img
              src={item.productId.image}
              alt={item.productId.name}
              style={{ width: '60px', height: '60px' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px' }}>{item.productId.name}</h4>
              <p style={{ margin: 0, color: '#a1a1aa' }}>${item.productId.price} each</p>
            </div>
            <button className="qty-btn" onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}>
              -
            </button>
            <span>{item.quantity}</span>
            <button className="qty-btn" onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}>
              +
            </button>
            <button onClick={() => handleRemove(item.productId._id)} style={{ backgroundColor: '#7f1d1d' }}>
              Remove
            </button>
          </div>
        ))}

        <h3>Total: ${total.toFixed(2)}</h3>
        <Link to="/checkout">
          <button>Proceed to Checkout</button>
        </Link>
      </div>
    )}
  </div>
);
}

export default Cart;
