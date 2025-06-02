// src/components/Settings/Profile.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    const result = await updateProfile({
      name: formData.name.trim(),
      avatar: formData.avatar.trim()
    });
    
    setLoading(false);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setErrors({ submit: result.message });
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .profile-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: calc(100vh - 80px);
            padding: 2rem 0;
          }
          
          .profile-card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
            background: white;
          }
          
          .profile-header {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 2rem;
            border-radius: 15px 15px 0 0;
            text-align: center;
          }
          
          .profile-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 2.5rem;
            border: 4px solid rgba(255, 255, 255, 0.3);
          }
          
          .profile-form {
            padding: 2rem;
          }
          
          .profile-form .form-control {
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 12px 16px;
            transition: all 0.3s ease;
          }
          
          .profile-form .form-control:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
          }
          
          .profile-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }
          
          .profile-btn {
            border-radius: 10px;
            padding: 12px 24px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
          }
          
          .profile-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          .info-card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
            margin-bottom: 1rem;
          }
          
          .info-card .card-header {
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            border-radius: 12px 12px 0 0;
          }
          
          @media (max-width: 768px) {
            .profile-actions {
              flex-direction: column;
            }
          }
        `
      }} />
      
      <div className="profile-container">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  <h3>{user?.name}</h3>
                  <p className="mb-0 opacity-75">{user?.email}</p>
                  <small className="opacity-50">
                    Member since {new Date(user?.createdAt).toLocaleDateString()}
                  </small>
                </div>
                
                <div className="profile-form">
                  <h5 className="mb-4">Update Profile Information</h5>
                  
                  {message && (
                    <Alert variant="success" className="mb-3">
                      {message}
                    </Alert>
                  )}
                  
                  {errors.submit && (
                    <Alert variant="danger" className="mb-3">
                      {errors.submit}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
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
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            value={formData.email}
                            disabled
                            className="bg-light"
                          />
                          <Form.Text className="text-muted">
                            Email cannot be changed. Contact support if needed.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Avatar URL (Optional)</Form.Label>
                      <Form.Control
                        type="url"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        placeholder="https://example.com/your-avatar.jpg"
                      />
                      <Form.Text className="text-muted">
                        Provide a URL to your profile picture
                      </Form.Text>
                    </Form.Group>
                    
                    <div className="profile-actions">
                      <Button
                        type="submit"
                        variant="primary"
                        className="profile-btn"
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
                            <i className="fas fa-save me-2"></i>
                            Update Profile
                          </>
                        )}
                      </Button>
                      
                      <Link to="/change-password">
                        <Button variant="outline-secondary" className="profile-btn">
                          <i className="fas fa-key me-2"></i>
                          Change Password
                        </Button>
                      </Link>
                      
                      <Link to="/dashboard">
                        <Button variant="outline-primary" className="profile-btn">
                          <i className="fas fa-arrow-left me-2"></i>
                          Back to Dashboard
                        </Button>
                      </Link>
                    </div>
                  </Form>
                </div>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="info-card">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Account Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Role:</strong>
                    <span className="ms-2">
                      <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {user?.role?.toUpperCase()}
                      </span>
                    </span>
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong>
                    <span className="ms-2">
                      <span className={`badge ${user?.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {user?.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </span>
                  </div>
                  <div className="mb-3">
                    <strong>Last Login:</strong>
                    <div className="text-muted">
                      {user?.lastLogin ? 
                        new Date(user.lastLogin).toLocaleString() : 
                        'Never'
                      }
                    </div>
                  </div>
                  <div>
                    <strong>Joined:</strong>
                    <div className="text-muted">
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="info-card">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="fas fa-shield-alt me-2"></i>
                    Security
                  </h6>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted mb-3">
                    Keep your account secure by using a strong password and updating it regularly.
                  </p>
                  <Link to="/change-password" className="btn btn-outline-primary w-100">
                    <i className="fas fa-key me-2"></i>
                    Change Password
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Profile;