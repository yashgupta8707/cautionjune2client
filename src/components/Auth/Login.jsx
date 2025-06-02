// src/components/Auth/Login.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const result = await login(formData);
    setLoading(false);
    
    if (!result.success) {
      setErrors({ submit: result.message });
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .auth-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .auth-card {
            width: 100%;
            max-width: 400px;
            border: none;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
          }
          
          .auth-card .card-body {
            padding: 2.5rem;
          }
          
          .auth-logo {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .auth-logo h2 {
            color: #2c3e50;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          .auth-logo p {
            color: #7f8c8d;
            margin: 0;
          }
          
          .auth-form .form-control {
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          
          .auth-form .form-control:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
          }
          
          .auth-btn {
            width: 100%;
            padding: 12px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            border: none;
          }
          
          .auth-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
          }
          
          .auth-footer {
            text-align: center;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e9ecef;
          }
          
          .auth-footer a {
            color: #3498db;
            text-decoration: none;
            font-weight: 500;
          }
          
          .auth-footer a:hover {
            color: #2980b9;
            text-decoration: underline;
          }

          .demo-credentials {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
          }

          .demo-credentials h6 {
            color: #495057;
            margin-bottom: 0.5rem;
          }

          .demo-credentials p {
            margin: 0.25rem 0;
            color: #6c757d;
          }

          .quick-login-btn {
            background: #17a2b8;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 0.8rem;
            margin-left: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .quick-login-btn:hover {
            background: #138496;
          }
        `
      }} />
      
      <div className="auth-container">
        <Card className="auth-card">
          <Card.Body>
            <div className="auth-logo">
              <h2>EmpressPC</h2>
              <p>Sign in to your account</p>
            </div>

            {/* Demo Credentials Section */}
            <div className="demo-credentials">
              <h6><i className="fas fa-info-circle me-2"></i>Demo Access</h6>
              <p>
                <strong>Email:</strong> admin@empresspc.in
                <button 
                  className="quick-login-btn"
                  onClick={() => setFormData(prev => ({...prev, email: 'admin@empresspc.in'}))}
                  type="button"
                >
                  Use
                </button>
              </p>
              <p>
                <strong>Password:</strong> Admin123
                <button 
                  className="quick-login-btn"
                  onClick={() => setFormData(prev => ({...prev, password: 'Admin123'}))}
                  type="button"
                >
                  Use
                </button>
              </p>
              <small className="text-muted">Click "Use" buttons to auto-fill credentials</small>
            </div>
            
            <Form onSubmit={handleSubmit} className="auth-form">
              {errors.submit && (
                <Alert variant="danger" className="mb-3">
                  {errors.submit}
                </Alert>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Button
                type="submit"
                variant="primary"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </Form>
            
            <div className="auth-footer">
              <p className="mb-0">
                Don't have an account?{' '}
                <Link to="/register">Create one here</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Login;