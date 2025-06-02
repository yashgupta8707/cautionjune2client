// src/components/Settings/ChangePassword.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('Password changed successfully!');
      navigate('/profile');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .change-password-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: calc(100vh - 80px);
            padding: 2rem 0;
          }
          
          .password-card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
            background: white;
          }
          
          .password-header {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 2rem;
            border-radius: 15px 15px 0 0;
            text-align: center;
          }
          
          .password-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 2rem;
            border: 3px solid rgba(255, 255, 255, 0.3);
          }
          
          .password-form {
            padding: 2rem;
          }
          
          .password-form .form-control {
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 12px 16px;
            transition: all 0.3s ease;
          }
          
          .password-form .form-control:focus {
            border-color: #e74c3c;
            box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.25);
          }
          
          .password-btn {
            border-radius: 10px;
            padding: 12px 24px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
          }
          
          .password-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          .security-tips {
            background: #f8f9fa;
            border-left: 4px solid #17a2b8;
            padding: 1rem;
            border-radius: 0 8px 8px 0;
            margin-bottom: 1rem;
          }
          
          .security-tips h6 {
            color: #17a2b8;
            margin-bottom: 0.5rem;
          }
          
          .security-tips ul {
            margin-bottom: 0;
            padding-left: 1.25rem;
          }
          
          .security-tips li {
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
            color: #6c757d;
          }
        `
      }} />
      
      <div className="change-password-container">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6}>
              <Card className="password-card">
                <div className="password-header">
                  <div className="password-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Change Password</h3>
                  <p className="mb-0 opacity-75">
                    Update your password to keep your account secure
                  </p>
                </div>
                
                <div className="password-form">
                  <div className="security-tips">
                    <h6>
                      <i className="fas fa-info-circle me-2"></i>
                      Password Requirements
                    </h6>
                    <ul>
                      <li>At least 6 characters long</li>
                      <li>Contains uppercase and lowercase letters</li>
                      <li>Contains at least one number</li>
                      <li>Different from your current password</li>
                    </ul>
                  </div>
                  
                  {errors.submit && (
                    <Alert variant="danger" className="mb-3">
                      {errors.submit}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                        isInvalid={!!errors.currentPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.currentPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        isInvalid={!!errors.newPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.newPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <div className="d-flex gap-3 flex-wrap">
                      <Button
                        type="submit"
                        variant="danger"
                        className="password-btn"
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
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-key me-2"></i>
                            Change Password
                          </>
                        )}
                      </Button>
                      
                      <Link to="/profile">
                        <Button variant="outline-secondary" className="password-btn">
                          <i className="fas fa-times me-2"></i>
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ChangePassword;