import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentSignup, studentLogin } from '../services/api';
import '../styles/landingPage.css';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        const response = await studentLogin(formData.email, formData.password);
        
        if (response.success) {
          localStorage.setItem('student_token', response.data.token);
          localStorage.setItem('student_name', response.data.student.name);
          localStorage.setItem('student_email', response.data.student.email);
          navigate('/home');
        } else {
          setError(response.error || 'Login failed');
        }
      } else {
        // Signup
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const response = await studentSignup(
          formData.email,
          formData.password,
          formData.name
        );

        if (response.success) {
          localStorage.setItem('student_token', response.data.token);
          localStorage.setItem('student_name', response.data.student.name);
          localStorage.setItem('student_email', response.data.student.email);
          navigate('/home');
        } else {
          setError(response.error || 'Signup failed');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <div className="landing-logo">
            <img src="/logo.png" alt="SortMyHostel Logo" className="landing-logo-image" />
          </div>
          <h1 className="landing-title">SortMyHostel</h1>
          <p className="landing-subtitle">Your Hostel Food Feedback Platform</p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
                required
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className="auth-footer">
            <a href="/admin/login" className="admin-link">
              Admin Login →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

