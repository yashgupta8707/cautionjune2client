// src/components/Auth/Register.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password
    });
    setLoading(false);
    
    if (!result.success) {
      setErrors({ submit: result.message });
    }
  };

  const fillDemoData = () => {
    setFormData({
      name: 'John Doe',
      email: 'john.doe@empresspc.in',
      password: 'Demo123',
      confirmPassword: 'Demo123'
    });
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
            max-width: 450px;
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
          
          .password-requirements {
            font-size: 0.85rem;
            color: #6c757d;
            margin-top: 0.5rem;
          }
          
          .password-requirements ul {
            margin: 0.5rem 0 0 1rem;
            padding: 0;
          }
          
          .password-requirements li {
            margin-bottom: 0.25rem;
          }

          .demo-helper {
            background: #e8f5e8;
            border: 1px solid #c3e6c3;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .demo-helper h6 {
            color: #155724;
            margin-bottom: 0.5rem;
          }

          .demo-fill-btn {
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .demo-fill-btn:hover {
            background: #218838;
            transform: translateY(-1px);
          }

          .strength-indicator {
            height: 4px;
            border-radius: 2px;
            margin-top: 0.5rem;
            background: #e9ecef;
            overflow: hidden;
          }

          .strength-bar {
            height: 100%;
            transition: all 0.3s ease;
            border-radius: 2px;
          }

          .strength-weak { background: #dc3545; width: 33%; }
          .strength-medium { background: #ffc107; width: 66%; }
          .strength-strong { background: #28a745; width: 100%; }

          .form-floating {
            position: relative;
          }

          .form-floating > .form-control {
            padding: 1rem 0.75rem;
          }

          .form-floating > label {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            padding: 1rem 0.75rem;
            pointer-events: none;
            border: 1px solid transparent;
            transform-origin: 0 0;
            transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
          }

          .form-floating > .form-control:focus ~ label,
          .form-floating > .form-control:not(:placeholder-shown) ~ label {
            opacity: 0.65;
            transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
          }
        `
      }} />
      
      <div className="auth-container">
        <Card className="auth-card">
          <Card.Body>
            <div className="auth-logo">
              <h2>EmpressPC</h2>
              <p>Create your account</p>
            </div>

            {/* Demo Helper */}
            <div className="demo-helper">
              <h6><i className="fas fa-magic me-2"></i>Quick Demo Fill</h6>
              <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                Click below to auto-fill the form with demo data
              </p>
              <button 
                className="demo-fill-btn"
                onClick={fillDemoData}
                type="button"
              >
                <i className="fas fa-bolt me-2"></i>
                Fill Demo Data
              </button>
            </div>
            
            <Form onSubmit={handleSubmit} className="auth-form">
              {errors.submit && (
                <Alert variant="danger" className="mb-3">
                  {errors.submit}
                </Alert>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              
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
              
              <Form.Group className="mb-3">
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="strength-indicator">
                    <div className={`strength-bar ${
                      formData.password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password) ? 'strength-strong' :
                      formData.password.length >= 6 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) ? 'strength-medium' :
                      'strength-weak'
                    }`}></div>
                  </div>
                )}
                
                <div className="password-requirements">
                  <small>Password requirements:</small>
                  <ul>
                    <li>At least 6 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                  </ul>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <small className={`d-block mt-1 ${
                    formData.password === formData.confirmPassword ? 'text-success' : 'text-danger'
                  }`}>
                    <i className={`fas ${
                      formData.password === formData.confirmPassword ? 'fa-check' : 'fa-times'
                    } me-1`}></i>
                    {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </small>
                )}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus me-2"></i>
                    Create Account
                  </>
                )}
              </Button>
            </Form>
            
            <div className="auth-footer">
              <p className="mb-0">
                Already have an account?{' '}
                <Link to="/login">Sign in here</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Register;