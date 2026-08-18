import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

 return (
  <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
    <div style={{ width: '100%', maxWidth: '380px' }}>
      <div className="hero-eyebrow">// welcome back</div>
      <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>Log in to VOLT</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
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
          Log In
        </button>
      </form>

      {error && <p className="error-text" style={{ marginTop: '14px' }}>{error}</p>}

      <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  </div>
);
}

export default Login;
