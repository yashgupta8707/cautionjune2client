// client/src/components/Auth/LoginPage.js - Login & Register with AuthContext
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Register form
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminPassword: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/quotations';
      navigate(from, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, location]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(loginForm);
    setLoading(false);

    if (result.success) {
      // Redirect is handled by useEffect
      const from = location.state?.from?.pathname || '/quotations';
      navigate(from, { replace: true });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.adminPassword) {
      alert('Please fill in all fields including admin password');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Validate admin password (you can customize this)
    const ADMIN_PASSWORD = 'caution:itmayhurt'; // Change this!
    if (registerForm.adminPassword !== ADMIN_PASSWORD) {
      alert('Invalid admin password. Contact administrator for the correct password.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      adminPassword: registerForm.adminPassword // Send to backend for verification
    });
    setLoading(false);

    if (result.success) {
      // Clear form on success
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        adminPassword: ''
      });
      // Redirect is handled by useEffect
      navigate('/quotations', { replace: true });
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const result = await login({
      email: 'demo@example.com',
      password: 'demo123'
    });
    setLoading(false);

    if (!result.success) {
      // Demo might not exist, try creating a demo user
      alert('Demo login not available. Please use regular login or register.');
    }
  };

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }
          
          .login-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 480px;
            overflow: hidden;
          }
          
          .login-header {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            text-align: center;
            padding: 30px 25px;
          }
          
          .login-logo {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            font-weight: bold;
            margin: 0 auto 16px;
            backdrop-filter: blur(10px);
          }
          
          .login-title {
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .login-subtitle {
            opacity: 0.9;
            font-size: 1rem;
          }
          
          .login-body {
            padding: 30px;
          }
          
          .tab-buttons {
            display: flex;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 4px;
            margin-bottom: 30px;
          }
          
          .tab-button {
            flex: 1;
            padding: 12px 20px;
            background: none;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            color: #6c757d;
          }
          
          .tab-button.active {
            background: white;
            color: #3498db;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .tab-button:hover {
            color: #495057;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #2c3e50;
          }
          
          .form-input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: white;
          }
          
          .form-input:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          }
          
          .form-help {
            font-size: 0.85rem;
            color: #6c757d;
            margin-top: 4px;
          }
          
          .btn-primary {
            width: 100%;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            border: none;
            padding: 14px 20px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 16px;
          }
          
          .btn-primary:hover {
            background: linear-gradient(135deg, #2980b9, #21618c);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
          }
          
          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
          
          .btn-secondary {
            width: 100%;
            background: #6c757d;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .btn-secondary:hover {
            background: #5a6268;
            transform: translateY(-1px);
          }
          
          .divider {
            text-align: center;
            margin: 20px 0;
            position: relative;
          }
          
          .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e9ecef;
            z-index: 1;
          }
          
          .divider span {
            background: white;
            padding: 0 16px;
            color: #6c757d;
            font-size: 0.9rem;
            position: relative;
            z-index: 2;
          }
          
          .quick-access {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
          }
          
          .quick-access h6 {
            color: #3498db;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .quick-access p {
            color: #6c757d;
            font-size: 0.9rem;
            margin-bottom: 16px;
          }
          
          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .login-footer {
            text-align: center;
            padding: 20px;
            border-top: 1px solid #f1f3f4;
            color: #6c757d;
            font-size: 0.9rem;
          }
          
          /* Mobile responsive */
          @media (max-width: 768px) {
            .login-container {
              padding: 10px;
            }
            
            .login-card {
              max-width: 100%;
            }
            
            .login-header {
              padding: 25px 20px;
            }
            
            .login-body {
              padding: 25px 20px;
            }
          }
        `
      }} />

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">E</div>
            <div className="login-title">EmpressPC</div>
            <div className="login-subtitle">Business Solutions</div>
          </div>

          <div className="login-body">
            <div className="tab-buttons">
              <button 
                className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button 
                className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>

            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="form-input"
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="form-input"
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i>
                      Login
                    </>
                  )}
                </button>

                <div className="divider">
                  <span>or</span>
                </div>

                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={handleDemoLogin}
                  disabled={loading}
                >
                  <i className="fas fa-eye"></i>
                  Try Demo Login
                </button>
              </form>
            )}

            {activeTab === 'register' && (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    className="form-input"
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className="form-input"
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className="form-input"
                    required
                    minLength={6}
                    placeholder="Enter your password"
                  />
                  <div className="form-help">
                    Must be at least 6 characters long
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    className="form-input"
                    required
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Admin Password
                    <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="adminPassword"
                    value={registerForm.adminPassword}
                    onChange={handleRegisterChange}
                    className="form-input"
                    required
                    placeholder="Enter admin password to register"
                  />
                  <div className="form-help">
                    <i className="fas fa-shield-alt" style={{ color: '#e74c3c', marginRight: '6px' }}></i>
                    Required to create new accounts. Contact administrator if you don't have this password.
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i>
                      Create Account
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Access for Development */}
            <div className="quick-access">
              <h6>Quick Access (Development)</h6>
              <p>Skip authentication for testing purposes</p>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/quotations')}
              >
                <i className="fas fa-rocket"></i>
                Continue without Login
              </button>
            </div>
          </div>

          <div className="login-footer">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;