// client/src/components/Profile/ProfileDropdown.js - Profile Dropdown with Logout
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, getUserInitials } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#e74c3c',
      manager: '#f39c12',
      user: '#3498db'
    };
    return colors[role] || '#6c757d';
  };

  // If not authenticated, show login button
  if (!isAuthenticated) {
    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            .login-btn {
              color: #3498db !important;
              text-decoration: none !important;
              font-weight: 500;
              padding: 8px 16px;
              border: 2px solid #3498db;
              border-radius: 6px;
              transition: all 0.3s ease;
              background: transparent;
            }
            
            .login-btn:hover {
              background: #3498db;
              color: white !important;
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
            }
          `
        }} />
        <Link to="/login" className="login-btn">
          <i className="fas fa-sign-in-alt me-2"></i>
          Login
        </Link>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .profile-dropdown {
            position: relative;
            display: inline-block;
          }
          
          .profile-trigger {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            background: transparent;
            color: #6c757d;
            text-decoration: none;
          }
          
          .profile-trigger:hover {
            background: #f8f9fa;
            border-color: #e9ecef;
            color: #495057;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          
          .profile-trigger.active {
            background: #f8f9fa;
            border-color: #e9ecef;
            color: #495057;
          }
          
          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3498db, #2980b9);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
          }
          
          .user-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            line-height: 1.2;
          }
          
          .user-name {
            font-size: 0.9rem;
            font-weight: 600;
            color: #2c3e50;
          }
          
          .user-role {
            font-size: 0.75rem;
            padding: 2px 6px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            text-transform: uppercase;
            margin-top: 1px;
          }
          
          .dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 8px;
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            min-width: 280px;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
          }
          
          .dropdown-menu.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
          
          .dropdown-header {
            padding: 16px 20px;
            border-bottom: 1px solid #f1f3f4;
            background: #f8f9fa;
            border-radius: 12px 12px 0 0;
          }
          
          .dropdown-header .user-name {
            font-size: 1rem;
            margin-bottom: 2px;
          }
          
          .dropdown-header .user-email {
            color: #6c757d;
            font-size: 0.85rem;
          }
          
          .dropdown-body {
            padding: 8px 0;
          }
          
          .dropdown-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            color: #495057;
            text-decoration: none;
            transition: all 0.2s ease;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
          }
          
          .dropdown-item:hover {
            background: #f8f9fa;
            color: #2c3e50;
            text-decoration: none;
          }
          
          .dropdown-item i {
            width: 16px;
            text-align: center;
            color: #6c757d;
          }
          
          .dropdown-item.danger {
            color: #e74c3c;
          }
          
          .dropdown-item.danger:hover {
            background: #fdf2f2;
            color: #c0392b;
          }
          
          .dropdown-item.danger i {
            color: #e74c3c;
          }
          
          .dropdown-divider {
            height: 1px;
            background: #f1f3f4;
            margin: 8px 0;
          }
          
          .dropdown-arrow {
            margin-left: 4px;
            font-size: 0.8rem;
            transition: transform 0.3s ease;
          }
          
          .profile-trigger.active .dropdown-arrow {
            transform: rotate(180deg);
          }
          
          /* Mobile responsive */
          @media (max-width: 768px) {
            .user-info {
              display: none;
            }
            
            .dropdown-menu {
              right: -10px;
              min-width: 250px;
            }
          }
        `
      }} />

      <div className="profile-dropdown" ref={dropdownRef}>
        <div 
          className={`profile-trigger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="user-avatar">
            {getUserInitials()}
          </div>
          
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div 
              className="user-role" 
              style={{ backgroundColor: getRoleColor(user?.role) }}
            >
              {user?.role || 'user'}
            </div>
          </div>
          
          <i className={`fas fa-chevron-down dropdown-arrow`}></i>
        </div>

        <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
          {/* User Info Header */}
          <div className="dropdown-header">
            <div className="user-name">{user?.name || 'User Name'}</div>
            <div className="user-email">{user?.email || 'user@example.com'}</div>
            <div style={{ marginTop: '8px' }}>
              <span 
                className="user-role" 
                style={{ backgroundColor: getRoleColor(user?.role) }}
              >
                {user?.role || 'user'}
              </span>
              {user?.isActive && (
                <span 
                  style={{ 
                    backgroundColor: '#27ae60', 
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginLeft: '6px',
                    textTransform: 'uppercase',
                    fontWeight: '500'
                  }}
                >
                  Active
                </span>
              )}
            </div>
          </div>

          <div className="dropdown-body">
            {/* Navigation Items */}
            <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-user"></i>
              My Profile
            </Link>

            <Link to="/settings" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-cog"></i>
              Settings
            </Link>

            <Link to="/quotations" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-file-invoice"></i>
              My Quotations
            </Link>

            <Link to="/parties" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-users"></i>
              My Clients
            </Link>

            <div className="dropdown-divider"></div>

            <Link to="/help" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-question-circle"></i>
              Help & Support
            </Link>

            <Link to="/about" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-info-circle"></i>
              About
            </Link>

            <div className="dropdown-divider"></div>

            {/* Logout Button */}
            <button className="dropdown-item danger" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;