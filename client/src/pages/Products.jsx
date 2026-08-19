import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        <h1> Power your workflow.</h1>
        <p>From noise-cancelling headphones to 4K displays — gear that keeps up with you.</p>
      </div>

      {message && (
        <p className={message.includes('added') ? 'success-text' : 'error-text'} style={{ marginBottom: '20px' }}>
          {message}
        </p>
      )}
      <div className="product-grid">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-box" style={{ height: '150px', marginBottom: '12px' }} />
                <div className="skeleton-box" style={{ height: '18px', width: '70%', marginBottom: '8px' }} />
                <div className="skeleton-box" style={{ height: '13px', width: '90%', marginBottom: '14px' }} />
                <div className="skeleton-box" style={{ height: '32px', width: '80px', marginBottom: '10px' }} />
                <div className="skeleton-box" style={{ height: '38px' }} />
              </div>
            ))
          : products.map((product) => {
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
                  <button onClick={() => handleAddToCart(product._id)} disabled={outOfStock}>
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
