// src/components/Layout/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .app-footer {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 2rem 0 1rem;
            margin-top: auto;
          }
          
          .footer-content {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 1.5rem;
            margin-bottom: 1rem;
          }
          
          .footer-brand {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          .footer-description {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1rem;
          }
          
          .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .footer-links li {
            margin-bottom: 0.5rem;
          }
          
          .footer-links a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: color 0.3s ease;
          }
          
          .footer-links a:hover {
            color: white;
          }
          
          .footer-social {
            display: flex;
            gap: 1rem;
          }
          
          .footer-social a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          
          .footer-social a:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
          
          .footer-bottom {
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
          }
          
          @media (max-width: 768px) {
            .footer-content {
              text-align: center;
            }
            
            .footer-social {
              justify-content: center;
            }
          }
        `
      }} />
      
      <footer className="app-footer">
        <Container>
          <div className="footer-content">
            <Row>
              <Col lg={4} className="mb-4">
                <div className="footer-brand">EmpressPC</div>
                <p className="footer-description">
                  Your trusted partner for computer solutions and business management. 
                  Streamline your operations with our comprehensive CRM and quotation system.
                </p>
                <div className="footer-social">
                  <a href="#" aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </Col>
              
              <Col lg={2} md={6} className="mb-4">
                <h6 className="text-white mb-3">Quick Links</h6>
                <ul className="footer-links">
                  <li><a href="/dashboard">Dashboard</a></li>
                  <li><a href="/parties">Clients</a></li>
                  <li><a href="/quotations">Quotations</a></li>
                  <li><a href="/components">Inventory</a></li>
                </ul>
              </Col>
              
              <Col lg={2} md={6} className="mb-4">
                <h6 className="text-white mb-3">Account</h6>
                <ul className="footer-links">
                  <li><a href="/profile">Profile</a></li>
                  <li><a href="/change-password">Security</a></li>
                  <li><a href="/settings">Settings</a></li>
                  <li><a href="/help">Help Center</a></li>
                </ul>
              </Col>
              
              <Col lg={4} className="mb-4">
                <h6 className="text-white mb-3">Contact Info</h6>
                <div className="footer-description">
                  <p className="mb-2">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    MS-101, Sector D, Aliganj, Lucknow
                  </p>
                  <p className="mb-2">
                    <i className="fas fa-phone me-2"></i>
                    +91 8881123430
                  </p>
                  <p className="mb-0">
                    <i className="fas fa-envelope me-2"></i>
                    sales@empresspc.in
                  </p>
                </div>
              </Col>
            </Row>
          </div>
          
          <div className="footer-bottom">
            <p className="mb-0">
              © {new Date().getFullYear()} EmpressPC. All rights reserved. 
              Built with <i className="fas fa-heart text-danger"></i> for better business management.
            </p>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default Footer;