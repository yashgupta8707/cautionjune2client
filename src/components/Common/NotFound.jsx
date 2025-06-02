// src/components/Common/NotFound.js
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .not-found-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: calc(100vh - 80px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 0;
          }
          
          .not-found-card {
            border: none;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            background: white;
            max-width: 500px;
            width: 100%;
          }
          
          .not-found-icon {
            font-size: 6rem;
            color: #6c757d;
            margin-bottom: 1rem;
          }
          
          .not-found-title {
            font-size: 3rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 1rem;
          }
          
          .not-found-subtitle {
            font-size: 1.25rem;
            color: #7f8c8d;
            margin-bottom: 2rem;
          }
          
          .not-found-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .not-found-btn {
            border-radius: 10px;
            padding: 12px 24px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            text-decoration: none;
          }
          
          .not-found-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            text-decoration: none;
          }
          
          @media (max-width: 768px) {
            .not-found-title {
              font-size: 2rem;
            }
            
            .not-found-subtitle {
              font-size: 1rem;
            }
            
            .not-found-actions {
              flex-direction: column;
            }
          }
        `
      }} />
      
      <div className="not-found-container">
        <Card className="not-found-card text-center">
          <Card.Body className="p-5">
            <div className="not-found-icon">
              <i className="fas fa-search"></i>
            </div>
            <h1 className="not-found-title">404</h1>
            <p className="not-found-subtitle">
              The page you're looking for doesn't exist.
            </p>
            <p className="text-muted mb-4">
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            <div className="not-found-actions">
              <Button 
                variant="primary" 
                className="not-found-btn"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Go Back
              </Button>
              
              <Link to="/dashboard" className="btn btn-outline-primary not-found-btn">
                <i className="fas fa-home me-2"></i>
                Dashboard
              </Link>
              
              <Link to="/parties" className="btn btn-outline-secondary not-found-btn">
                <i className="fas fa-users me-2"></i>
                Clients
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default NotFound;