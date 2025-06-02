// client/src/components/Navigation.js - Updated with ProfileDropdown
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import ProfileDropdown from "./Profile/ProfileDropdown";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .elegant-navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 70px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
            border-bottom: 1px solid #e9ecef;
            z-index: 1030;
            display: flex;
            align-items: center;
            padding: 0 20px;
            backdrop-filter: blur(10px);
          }
          
          .navbar-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .navbar-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #2c3e50 !important;
            text-decoration: none;
            font-size: 1.4rem;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .navbar-brand:hover {
            color: #34495e !important;
            text-decoration: none;
            transform: scale(1.02);
          }
          
          .brand-logo {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            font-weight: bold;
            color: white;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
          }
          
          .navbar-brand img {
            height: 50px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          }
          
          .navbar-nav {
            display: flex;
            align-items: center;
            gap: 8px;
            list-style: none;
            margin: 0;
            padding: 0;
            flex-direction: row;
          }
          
          .navbar-nav li {
            display: inline-block;
          }
          
          .nav-link {
            color: #6c757d !important;
            text-decoration: none !important;
            font-weight: 500;
            font-size: 0.95rem;
            margin: 0 4px;
            padding: 10px 16px;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
            position: relative;
          }
          
          .nav-link:hover {
            color: #495057 !important;
            text-decoration: none !important;
            background-color: #f8f9fa;
            border-color: #e9ecef;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          
          .nav-link.active {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white !important;
            border-color: #2980b9;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
            font-weight: 600;
          }
          
          .nav-link.active:hover {
            background: linear-gradient(135deg, #2980b9, #21618c);
            color: white !important;
          }
          
          .nav-link i {
            font-size: 0.9rem;
            width: 16px;
            text-align: center;
          }
          
          .navbar-badge {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: 6px;
            font-weight: 500;
            display: inline-block;
            vertical-align: top;
            box-shadow: 0 2px 6px rgba(231, 76, 60, 0.3);
          }
          
          .navbar-toggle {
            display: none;
            background: transparent;
            border: 2px solid #dee2e6;
            color: #6c757d;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: all 0.3s ease;
          }
          
          .navbar-toggle:hover {
            background: #f8f9fa;
            border-color: #adb5bd;
            color: #495057;
          }
          
          .navbar-toggle:focus {
            outline: none;
            box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
          }
          
          .navbar-profile {
            margin-left: 12px;
          }
          
          /* Mobile styles */
          @media (max-width: 991px) {
            .elegant-navbar {
              height: auto;
              min-height: 70px;
              flex-direction: column;
              align-items: flex-start;
              padding: 15px 20px;
            }
            
            .navbar-container {
              flex-direction: column;
              align-items: flex-start;
              width: 100%;
            }
            
            .navbar-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
            }
            
            .navbar-toggle {
              display: block;
            }
            
            .navbar-nav {
              flex-direction: column;
              width: 100%;
              margin-top: 15px;
              gap: 8px;
              display: ${isMenuOpen ? 'flex' : 'none'};
            }
            
            .navbar-nav li {
              display: block;
              width: 100%;
            }
            
            .nav-link {
              width: 100%;
              text-align: left;
              justify-content: flex-start;
              margin: 0;
              padding: 12px 16px;
            }
            
            .navbar-profile {
              width: 100%;
              margin-left: 0;
              margin-top: 12px;
              padding-top: 12px;
              border-top: 1px solid #e9ecef;
            }
          }
          
          /* Body padding to prevent content hiding */
          body {
            padding-top: 80px !important;
          }
          
          @media (max-width: 991px) {
            body {
              padding-top: 90px !important;
            }
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Additional elegant touches */
          .nav-link::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            transition: all 0.3s ease;
            transform: translateX(-50%);
          }
          
          .nav-link:hover::before {
            width: 80%;
          }
          
          .nav-link.active::before {
            width: 0;
          }
        `
      }} />

      <nav className="elegant-navbar">
        <div className="navbar-container">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">
              <img
                src="/logo.png"
                alt="EmpressPC Logo"
                style={{ height: "50px" }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="brand-logo" style={{ display: 'none' }}>
                E
              </div>
              <div>
                <div style={{ fontSize: "1.4rem", lineHeight: "1.2", color: "#2c3e50" }}>
                  EMPRESSPC
                </div>
                <div style={{ fontSize: "0.75rem", color: "#7f8c8d", fontWeight: "400" }}>
                  Business Solutions
                </div>
              </div>
            </Link>
            
            <button 
              className="navbar-toggle"
              onClick={toggleMenu}
              aria-controls="basic-navbar-nav"
              aria-label="Toggle navigation"
            >
              <span>{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>

          <ul className="navbar-nav">
            <li>
              <NavLink
                to="/dashboard"
                className={`nav-link ${
                  location.pathname === "/dashboard" || location.pathname === "/" ? "active" : ""
                }`}
              >
                <i className="fas fa-chart-line"></i>
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/parties"
                className={`nav-link ${
                  location.pathname.includes("/parties") ? "active" : ""
                }`}
              >
                <i className="fas fa-users"></i>
                Clients
                <span className="navbar-badge">CRM</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/quotations"
                className={`nav-link ${
                  location.pathname.includes("/quotations") ? "active" : ""
                }`}
              >
                <i className="fas fa-file-invoice-dollar"></i>
                Quotations
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/components"
                className={`nav-link ${
                  location.pathname.includes("/components") ? "active" : ""
                }`}
              >
                <i className="fas fa-microchip"></i>
                Inventory
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/reports"
                className={`nav-link ${
                  location.pathname.includes("/reports") ? "active" : ""
                }`}
              >
                <i className="fas fa-chart-bar"></i>
                Reports
              </NavLink>
            </li>

            {/* Profile Dropdown - Replaces the old profile link */}
            <li className="navbar-profile">
              <ProfileDropdown />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;