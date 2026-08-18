import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '18px 30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link to="/" className="logo">
            VOLT<span>.</span>
          </Link>
          <div className="nav-links" style={{ display: 'flex', gap: '24px' }}>
            <Link to="/">Products</Link>
            <Link to="/cart">Cart</Link>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                {user.name}
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Login</Link>
              <Link to="/register">
                <button>Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;