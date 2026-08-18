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
      setMessage('Item added to cart!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <h2>Products</h2>
      {message && <p>{message}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}
          >
            <img src={product.image} alt={product.name} style={{ width: '100%' }} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => handleAddToCart(product._id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
