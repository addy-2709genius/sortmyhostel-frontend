import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/adminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'sortmyhostel@aaditya.com';
  const ADMIN_PASSWORD = 'sorted@123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store authentication token
      const authToken = btoa(`${email}:${Date.now()}`);
      sessionStorage.setItem('admin_auth', authToken);
      sessionStorage.setItem('admin_email', email);
      
      // Redirect to admin dashboard
      navigate('/admin');
    } else {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <img src="/logo.png" alt="SortMyHostel Logo" className="login-logo-image" />
          </div>
          <h1 className="login-title">SortMyHostel Admin</h1>
          <p className="login-subtitle">Sign in to access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="back-link">← Back to Student View</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;






