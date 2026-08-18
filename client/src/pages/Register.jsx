import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

return (
  <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
    <div style={{ width: '100%', maxWidth: '380px' }}>
      <div className="hero-eyebrow">// join volt</div>
      <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>Create your account</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '13px', marginTop: '4px' }}>
          Create Account
        </button>
      </form>

      {error && <p className="error-text" style={{ marginTop: '14px' }}>{error}</p>}

      <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  </div>
);
}

export default Register;
