// client/src/components/Profile/ProfilePage.js - Elegant Profile Management
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, getUserInitials, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Profile form data
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Password form data
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileForm.name.trim()) {
      alert('Name is required');
      return;
    }

    if (!profileForm.email.trim()) {
      alert('Email is required');
      return;
    }

    setSaving(true);
    const result = await updateProfile(profileForm);
    setSaving(false);

    if (result.success) {
      // Profile updated successfully (toast handled by AuthContext)
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword) {
      alert('Current password is required');
      return;
    }

    if (!passwordForm.newPassword) {
      alert('New password is required');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setSaving(true);
    const result = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    setSaving(false);

    if (result.success) {
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const getRoleColor = (role) => {
    const roleColors = {
      admin: '#e74c3c',
      user: '#3498db',
      manager: '#f39c12'
    };
    return roleColors[role] || '#6c757d';
  };

  if (!user) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h3>Access Denied</h3>
        <p>You need to be logged in to view this page.</p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(135deg, #3498db, #2980b9)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .profile-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            min-height: calc(100vh - 100px);
          }

          .profile-header {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #e9ecef;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
          }

          .profile-header-left {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .profile-avatar-large {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: 600;
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
          }

          .profile-info h1 {
            margin: 0 0 8px 0;
            color: #2c3e50;
            font-size: 2rem;
            font-weight: 600;
          }

          .profile-info p {
            margin: 4px 0;
            color: #6c757d;
            font-size: 1.1rem;
          }

          .profile-role-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            color: white;
            margin-top: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }

          .profile-header-right {
            display: flex;
            gap: 12px;
            align-items: center;
          }

          .btn {
            padding: 10px 20px;
            border-radius: 8px;
            border: 1px solid transparent;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
          }

          .btn-primary {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            border-color: #2980b9;
          }

          .btn-primary:hover {
            background: linear-gradient(135deg, #2980b9, #21618c);
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
          }

          .btn-secondary {
            background: #f8f9fa;
            color: #6c757d;
            border-color: #e9ecef;
          }

          .btn-secondary:hover {
            background: #e9ecef;
            color: #495057;
            border-color: #adb5bd;
          }

          .btn-outline-warning {
            background: transparent;
            color: #f39c12;
            border-color: #f39c12;
          }

          .btn-outline-warning:hover {
            background: #f39c12;
            color: white;
          }

          .profile-content {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 30px;
          }

          .profile-sidebar {
            background: white;
            border-radius: 16px;
            padding: 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #e9ecef;
            height: fit-content;
            overflow: hidden;
          }

          .sidebar-header {
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            padding: 20px;
            border-bottom: 1px solid #f1f3f5;
          }

          .sidebar-nav {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .sidebar-nav-item {
            margin: 0;
          }

          .sidebar-nav-link {
            display: block;
            padding: 16px 20px;
            color: #6c757d;
            text-decoration: none;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
          }

          .sidebar-nav-link:hover {
            background: #f8f9fa;
            color: #495057;
            text-decoration: none;
          }

          .sidebar-nav-link.active {
            background: #e3f2fd;
            color: #1976d2;
            border-left-color: #1976d2;
            font-weight: 600;
          }

          .sidebar-nav-link i {
            width: 20px;
            margin-right: 12px;
            text-align: center;
          }

          .profile-main {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #e9ecef;
          }

          .form-group {
            margin-bottom: 24px;
          }

          .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2c3e50;
            font-size: 0.95rem;
          }

          .form-control {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: #fff;
          }

          .form-control:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
          }

          .form-control:disabled {
            background: #f8f9fa;
            color: #6c757d;
          }

          .form-text {
            margin-top: 6px;
            font-size: 0.85rem;
            color: #6c757d;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .stat-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            border: 1px solid #f1f3f5;
            transition: all 0.3s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 8px;
          }

          .stat-label {
            color: #6c757d;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1050;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .modal-overlay.show {
            opacity: 1;
            visibility: visible;
          }

          .modal-content {
            background: white;
            border-radius: 16px;
            padding: 0;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transform: scale(0.9);
            transition: all 0.3s ease;
          }

          .modal-overlay.show .modal-content {
            transform: scale(1);
          }

          .modal-header {
            padding: 20px 30px;
            border-bottom: 1px solid #f1f3f5;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-title {
            margin: 0;
            color: #2c3e50;
            font-size: 1.25rem;
            font-weight: 600;
          }

          .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #6c757d;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .modal-close:hover {
            background: #f8f9fa;
            color: #495057;
          }

          .modal-body {
            padding: 30px;
          }

          .modal-footer {
            padding: 20px 30px;
            border-top: 1px solid #f1f3f5;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
          }

          .activity-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .activity-item {
            padding: 16px 0;
            border-bottom: 1px solid #f8f9fa;
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .activity-item:last-child {
            border-bottom: none;
          }

          .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e3f2fd;
            color: #1976d2;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
          }

          .activity-content h6 {
            margin: 0 0 4px 0;
            color: #2c3e50;
            font-weight: 600;
          }

          .activity-content p {
            margin: 0;
            color: #6c757d;
            font-size: 0.9rem;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .profile-container {
              padding: 15px;
            }

            .profile-header {
              padding: 20px;
              text-align: center;
            }

            .profile-header-left {
              flex-direction: column;
              text-align: center;
            }

            .profile-content {
              grid-template-columns: 1fr;
              gap: 20px;
            }

            .form-row {
              grid-template-columns: 1fr;
            }

            .stats-grid {
              grid-template-columns: 1fr;
            }

            .modal-content {
              margin: 20px;
              width: calc(100% - 40px);
            }
          }
        `
      }} />

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-left">
            <div className="profile-avatar-large">
              {getUserInitials()}
            </div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <div 
                className="profile-role-badge"
                style={{ backgroundColor: getRoleColor(user.role) }}
              >
                {user.role?.toUpperCase() || 'USER'}
                {isAdmin() && ' • ADMIN'}
              </div>
            </div>
          </div>
          <div className="profile-header-right">
            <button 
              className="btn btn-outline-warning"
              onClick={() => setShowPasswordModal(true)}
            >
              <i className="fas fa-lock"></i>
              Change Password
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
              Back
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="sidebar-header">
              <h6 style={{ margin: 0, color: '#2c3e50', fontWeight: 600 }}>Account Settings</h6>
            </div>
            <ul className="sidebar-nav">
              <li className="sidebar-nav-item">
                <a 
                  href="#"
                  className={`sidebar-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}
                >
                  <i className="fas fa-user"></i>
                  Profile Information
                </a>
              </li>
              <li className="sidebar-nav-item">
                <a 
                  href="#"
                  className={`sidebar-nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setActiveTab('activity'); }}
                >
                  <i className="fas fa-chart-line"></i>
                  Activity & Stats
                </a>
              </li>
              <li className="sidebar-nav-item">
                <a 
                  href="/settings"
                  className="sidebar-nav-link"
                  onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
                >
                  <i className="fas fa-cog"></i>
                  App Settings
                </a>
              </li>
              <li className="sidebar-nav-item">
                <a 
                  href="/quotations"
                  className="sidebar-nav-link"
                  onClick={(e) => { e.preventDefault(); navigate('/quotations'); }}
                >
                  <i className="fas fa-file-invoice"></i>
                  My Quotations
                </a>
              </li>
              <li className="sidebar-nav-item">
                <a 
                  href="/parties"
                  className="sidebar-nav-link"
                  onClick={(e) => { e.preventDefault(); navigate('/parties'); }}
                >
                  <i className="fas fa-users"></i>
                  My Clients
                </a>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            {activeTab === 'profile' && (
              <div>
                <h3 style={{ marginBottom: '30px', color: '#2c3e50' }}>Profile Information</h3>
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={profileForm.name}
                        onChange={handleProfileFormChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={profileForm.email}
                        onChange={handleProfileFormChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user.role?.toUpperCase() || 'USER'}
                        disabled
                      />
                      <div className="form-text">Role cannot be changed by users</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Account Status</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user.isActive ? 'Active' : 'Inactive'}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Member Since</label>
                    <input
                      type="text"
                      className="form-control"
                      value={new Date(user.createdAt).toLocaleDateString()}
                      disabled
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 style={{ marginBottom: '30px', color: '#2c3e50' }}>Activity & Statistics</h3>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Quotations Created</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Clients Managed</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">₹0</div>
                    <div className="stat-label">Total Value</div>
                  </div>
                </div>

                <h5 style={{ marginBottom: '20px', color: '#2c3e50' }}>Recent Activity</h5>
                <ul className="activity-list">
                  <li className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="activity-content">
                      <h6>Account Created</h6>
                      <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </li>
                  {user.lastLogin && (
                    <li className="activity-item">
                      <div className="activity-icon">
                        <i className="fas fa-sign-in-alt"></i>
                      </div>
                      <div className="activity-content">
                        <h6>Last Login</h6>
                        <p>{new Date(user.lastLogin).toLocaleDateString()}</p>
                      </div>
                    </li>
                  )}
                  <li className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-info-circle"></i>
                    </div>
                    <div className="activity-content">
                      <h6>Activity Tracking</h6>
                      <p>Detailed activity tracking will be available soon</p>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <div className={`modal-overlay ${showPasswordModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Change Password</h4>
            <button 
              className="modal-close"
              onClick={() => setShowPasswordModal(false)}
            >
              ×
            </button>
          </div>
          <form onSubmit={handlePasswordSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordFormChange}
                  required
                  placeholder="Enter your current password"
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordFormChange}
                  required
                  minLength={6}
                  placeholder="Enter your new password"
                />
                <div className="form-text">Must be at least 6 characters long</div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordFormChange}
                  required
                  placeholder="Confirm your new password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;