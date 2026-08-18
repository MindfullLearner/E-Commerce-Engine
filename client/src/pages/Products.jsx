import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Products() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setMessage('');

    if (!user) {
      setMessage('Please log in to add items to your cart.');
      return;
    }

    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      setMessage('Item added to cart.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-eyebrow">// full catalog</div>
        <h1>Gear for how you build.</h1>
        <p>Hand-picked hardware for developers — from your desk setup to your daily carry.</p>
      </div>

      {message && (
        <p className={message.includes('added') ? 'success-text' : 'error-text'} style={{ marginBottom: '20px' }}>
          {message}
        </p>
      )}

      <div className="product-grid">
        {products.map((product) => {
          const lowStock = product.stock > 0 && product.stock <= 5;
          const outOfStock = product.stock === 0;

          return (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="desc">{product.description}</p>
              <span className="price-chip">${product.price.toFixed(2)}</span>
              <span className={`stock-tag ${lowStock ? 'low' : ''}`}>
                {outOfStock ? 'OUT OF STOCK' : lowStock ? `ONLY ${product.stock} LEFT` : `${product.stock} IN STOCK`}
              </span>
              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={outOfStock}
              >
                {outOfStock ? 'Unavailable' : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;