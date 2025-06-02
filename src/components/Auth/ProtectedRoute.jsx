// src/components/Auth/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Spinner, Card, Button } from 'react-bootstrap';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            .auth-loading-container {
              min-height: 100vh;
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            
            .auth-loading-card {
              border: none;
              border-radius: 15px;
              box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
              background: white;
              padding: 3rem;
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            
            .loading-spinner {
              width: 3rem;
              height: 3rem;
              margin-bottom: 1.5rem;
            }
            
            .loading-text {
              color: #6c757d;
              font-size: 1.1rem;
              margin-bottom: 0.5rem;
            }
            
            .loading-subtext {
              color: #adb5bd;
              font-size: 0.9rem;
            }
            
            .loading-dots {
              display: inline-block;
              position: relative;
              width: 80px;
              height: 20px;
              margin-top: 1rem;
            }
            
            .loading-dots div {
              position: absolute;
              top: 8px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #3498db;
              animation: loading-dots 1.2s linear infinite;
            }
            
            .loading-dots div:nth-child(1) {
              left: 8px;
              animation-delay: 0s;
            }
            
            .loading-dots div:nth-child(2) {
              left: 32px;
              animation-delay: -0.4s;
            }
            
            .loading-dots div:nth-child(3) {
              left: 56px;
              animation-delay: -0.8s;
            }
            
            @keyframes loading-dots {
              0% {
                transform: scale(0);
              }
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1);
                opacity: 1;
              }
              100% {
                transform: scale(0);
                opacity: 0;
              }
            }
          `
        }} />
        
        <div className="auth-loading-container">
          <Card className="auth-loading-card">
            <Card.Body>
              <Spinner 
                animation="border" 
                variant="primary" 
                className="loading-spinner"
              />
              <div className="loading-text">Authenticating...</div>
              <div className="loading-subtext">Please wait while we verify your session</div>
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            .access-denied-container {
              min-height: 100vh;
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            
            .access-denied-card {
              border: none;
              border-radius: 15px;
              box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
              background: white;
              max-width: 500px;
              width: 100%;
            }
            
            .access-denied-header {
              background: linear-gradient(135deg, #e74c3c, #c0392b);
              color: white;
              padding: 2rem;
              border-radius: 15px 15px 0 0;
              text-align: center;
            }
            
            .access-denied-icon {
              font-size: 3rem;
              margin-bottom: 1rem;
            }
            
            .access-denied-body {
              padding: 2rem;
              text-align: center;
            }
            
            .access-denied-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              flex-wrap: wrap;
              margin-top: 1.5rem;
            }
            
            .access-denied-btn {
              border-radius: 10px;
              padding: 10px 20px;
              font-weight: 600;
              transition: all 0.3s ease;
              border: none;
              text-decoration: none;
            }
            
            .access-denied-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              text-decoration: none;
            }
            
            .user-info-card {
              background: #f8f9fa;
              border-radius: 8px;
              padding: 1rem;
              margin: 1rem 0;
            }
            
            .user-role-badge {
              display: inline-block;
              padding: 0.25rem 0.75rem;
              border-radius: 12px;
              font-size: 0.8rem;
              font-weight: 600;
              margin-left: 0.5rem;
            }
            
            .role-user {
              background: #d1ecf1;
              color: #0c5460;
            }
            
            .role-admin {
              background: #f8d7da;
              color: #721c24;
            }
          `
        }} />
        
        <div className="access-denied-container">
          <Card className="access-denied-card">
            <div className="access-denied-header">
              <div className="access-denied-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Access Denied</h3>
              <p className="mb-0 opacity-75">
                You don't have permission to access this page
              </p>
            </div>
            
            <div className="access-denied-body">
              <div className="user-info-card">
                <strong>Your Account:</strong>
                <div className="mt-2">
                  <div>
                    <i className="fas fa-user me-2"></i>
                    {user?.name || 'Unknown User'}
                  </div>
                  <div className="mt-1">
                    <i className="fas fa-envelope me-2"></i>
                    {user?.email || 'No email'}
                  </div>
                  <div className="mt-1">
                    <i className="fas fa-tag me-2"></i>
                    Current Role:
                    <span className={`user-role-badge role-${user?.role || 'user'}`}>
                      {(user?.role || 'user').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-muted mb-3">
                This page requires <strong>{requiredRole?.toUpperCase()}</strong> role access. 
                Please contact your administrator if you believe this is an error.
              </p>
              
              <div className="access-denied-actions">
                <Button 
                  variant="primary" 
                  className="access-denied-btn"
                  onClick={() => window.history.back()}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Go Back
                </Button>
                
                <Button 
                  variant="outline-secondary" 
                  className="access-denied-btn"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <i className="fas fa-home me-2"></i>
                  Dashboard
                </Button>
                
                <Button 
                  variant="outline-info" 
                  className="access-denied-btn"
                  onClick={() => window.location.href = '/profile'}
                >
                  <i className="fas fa-user-cog me-2"></i>
                  Profile
                </Button>
              </div>
              
              <div className="mt-4 pt-3 border-top">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Need access? Contact your system administrator
                </small>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }

  // User is authenticated and has required role (if specified)
  return children;
};

// Higher-order component for admin-only routes
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
};

// Higher-order component for user routes (allows both user and admin)
export const UserRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user?.role === 'admin' || user?.role === 'user') {
    return (
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute requiredRole="user">
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;