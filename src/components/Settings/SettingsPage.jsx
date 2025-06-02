// client/src/components/Settings/SettingsPage.js - Application Settings
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('general');
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'en',
    currency: localStorage.getItem('currency') || 'INR',
    dateFormat: localStorage.getItem('dateFormat') || 'DD/MM/YYYY',
    notifications: JSON.parse(localStorage.getItem('notifications') || 'true'),
    autoSave: JSON.parse(localStorage.getItem('autoSave') || 'true'),
    compactView: JSON.parse(localStorage.getItem('compactView') || 'false'),
    soundEffects: JSON.parse(localStorage.getItem('soundEffects') || 'true'),
    emailNotifications: JSON.parse(localStorage.getItem('emailNotifications') || 'true')
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Save to localStorage
      localStorage.setItem(key, typeof value === 'boolean' ? JSON.stringify(value) : value);
      
      // Apply theme immediately
      if (key === 'theme') {
        document.documentElement.setAttribute('data-theme', value);
        document.body.className = value === 'dark' ? 'dark-theme' : '';
      }
      
      return newSettings;
    });

    // Show success feedback
    showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} updated successfully!`);
  };

  const showToast = (message) => {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1100;
      font-weight: 500;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const handleClearData = () => {
    // Clear all application data except auth token
    const keysToKeep = ['authToken', 'user'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Reset settings to defaults
    setSettings({
      theme: 'light',
      language: 'en',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      notifications: true,
      autoSave: true,
      compactView: false,
      soundEffects: true,
      emailNotifications: true
    });

    setShowClearDataModal(false);
    showToast('Application data cleared successfully!');
  };

  const getStorageUsage = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2); // Convert to KB
  };

  const exportSettings = () => {
    const exportData = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0',
      user: user?.name || 'Unknown'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `empressspc-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('Settings exported successfully!');
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (importData.settings) {
          Object.entries(importData.settings).forEach(([key, value]) => {
            handleSettingChange(key, value);
          });
          showToast('Settings imported successfully!');
        } else {
          throw new Error('Invalid settings file format');
        }
      } catch (error) {
        alert('Error importing settings: ' + error.message);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .settings-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            min-height: calc(100vh - 100px);
          }
          
          .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f3f4;
          }
          
          .settings-title {
            font-size: 2.2rem;
            font-weight: 600;
            color: #2c3e50;
            margin: 0;
          }
          
          .back-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: #6c757d;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
          }
          
          .back-btn:hover {
            background: #5a6268;
            color: white;
            text-decoration: none;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .settings-content {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 30px;
          }
          
          .settings-sidebar {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #f1f3f4;
            height: fit-content;
          }
          
          .sidebar-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            color: #6c757d;
            text-decoration: none;
            transition: all 0.3s ease;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
            border-bottom: 1px solid #f8f9fa;
          }
          
          .sidebar-item:hover {
            background: #f8f9fa;
            color: #495057;
            text-decoration: none;
          }
          
          .sidebar-item.active {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
          }
          
          .sidebar-item:last-child {
            border-bottom: none;
            border-radius: 0 0 12px 12px;
          }
          
          .sidebar-item:first-child {
            border-radius: 12px 12px 0 0;
          }
          
          .sidebar-item i {
            width: 20px;
            text-align: center;
          }
          
          .settings-main {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #f1f3f4;
            padding: 30px;
          }
          
          .section-title {
            font-size: 1.6rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f1f3f4;
          }
          
          .setting-group {
            margin-bottom: 32px;
          }
          
          .setting-group:last-child {
            margin-bottom: 0;
          }
          
          .setting-group-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 16px;
          }
          
          .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid #f8f9fa;
          }
          
          .setting-item:last-child {
            border-bottom: none;
          }
          
          .setting-info {
            flex: 1;
          }
          
          .setting-label {
            font-weight: 500;
            color: #2c3e50;
            margin-bottom: 4px;
          }
          
          .setting-description {
            font-size: 0.9rem;
            color: #6c757d;
          }
          
          .setting-control {
            margin-left: 20px;
          }
          
          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 52px;
            height: 28px;
          }
          
          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          
          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 28px;
          }
          
          .toggle-slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          
          input:checked + .toggle-slider {
            background-color: #3498db;
          }
          
          input:checked + .toggle-slider:before {
            transform: translateX(24px);
          }
          
          .form-select {
            padding: 8px 12px;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            background: white;
            color: #495057;
            font-size: 0.9rem;
            min-width: 150px;
            cursor: pointer;
          }
          
          .form-select:focus {
            outline: none;
            border-color: #3498db;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          
          .btn-primary:hover {
            background: linear-gradient(135deg, #2980b9, #21618c);
            transform: translateY(-1px);
          }
          
          .btn-secondary {
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          
          .btn-secondary:hover {
            background: #5a6268;
            transform: translateY(-1px);
          }
          
          .btn-danger {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          
          .btn-danger:hover {
            background: #c0392b;
            transform: translateY(-1px);
          }
          
          .storage-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          
          .storage-info h6 {
            margin-bottom: 12px;
            color: #2c3e50;
          }
          
          .storage-usage {
            font-size: 1.1rem;
            font-weight: 600;
            color: #3498db;
          }
          
          .danger-zone {
            background: #fdf2f2;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
          }
          
          .danger-zone h6 {
            color: #e74c3c;
            margin-bottom: 12px;
          }
          
          .danger-zone p {
            color: #721c24;
            margin-bottom: 16px;
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
          }
          
          .modal-content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 500px;
            margin: 20px;
          }
          
          .modal-header {
            padding: 20px 25px;
            border-bottom: 1px solid #f1f3f4;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .modal-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #e74c3c;
            margin: 0;
          }
          
          .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #6c757d;
            cursor: pointer;
            transition: color 0.3s ease;
          }
          
          .modal-close:hover {
            color: #495057;
          }
          
          .modal-body {
            padding: 25px;
          }
          
          .modal-footer {
            padding: 20px 25px;
            border-top: 1px solid #f1f3f4;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
          
          .warning-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 16px;
          }
          
          .warning-box i {
            color: #f39c12;
            margin-right: 8px;
          }
          
          .system-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          
          .system-info h6 {
            margin-bottom: 16px;
            color: #2c3e50;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          
          .info-item:last-child {
            border-bottom: none;
          }
          
          .info-label {
            color: #6c757d;
            font-weight: 500;
          }
          
          .info-value {
            color: #2c3e50;
            font-weight: 500;
          }
          
          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Mobile responsive */
          @media (max-width: 768px) {
            .settings-content {
              grid-template-columns: 1fr;
              gap: 20px;
            }
            
            .settings-header {
              flex-direction: column;
              gap: 16px;
              text-align: center;
            }
            
            .setting-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }
            
            .setting-control {
              margin-left: 0;
            }
          }
        `
      }} />

      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
        </div>

        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <button 
              className={`sidebar-item ${activeSection === 'general' ? 'active' : ''}`}
              onClick={() => setActiveSection('general')}
            >
              <i className="fas fa-cog"></i>
              General
            </button>
            <button 
              className={`sidebar-item ${activeSection === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveSection('appearance')}
            >
              <i className="fas fa-palette"></i>
              Appearance
            </button>
            <button 
              className={`sidebar-item ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              <i className="fas fa-bell"></i>
              Notifications
            </button>
            <button 
              className={`sidebar-item ${activeSection === 'data' ? 'active' : ''}`}
              onClick={() => setActiveSection('data')}
            >
              <i className="fas fa-database"></i>
              Data Management
            </button>
            <button 
              className={`sidebar-item ${activeSection === 'system' ? 'active' : ''}`}
              onClick={() => setActiveSection('system')}
            >
              <i className="fas fa-info-circle"></i>
              System Info
            </button>
          </div>

          {/* Main Content */}
          <div className="settings-main">
            {activeSection === 'general' && (
              <div>
                <h2 className="section-title">General Settings</h2>
                
                <div className="setting-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">Language</div>
                      <div className="setting-description">
                        Choose your preferred language
                      </div>
                    </div>
                    <div className="setting-control">
                      <select 
                        className="form-select"
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">Currency</div>
                      <div className="setting-description">
                        Default currency for quotations
                      </div>
                    </div>
                    <div className="setting-control">
                      <select 
                        className="form-select"
                        value={settings.currency}
                        onChange={(e) => handleSettingChange('currency', e.target.value)}
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">Date Format</div>
                      <div className="setting-description">
                        How dates should be displayed
                      </div>
                    </div>
                    <div className="setting-control">
                      <select 
                        className="form-select"
                        value={settings.dateFormat}
                        onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">Auto-save Forms</div>
                      <div className="setting-description">
                        Automatically save form data while typing
                      </div>
                    </div>
                    <div className="setting-control">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox"
                          checked={settings.autoSave}
                          onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div>
                <h2 className="section-title">Appearance Settings</h2>
                
                <div className="setting-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">Theme</div>
                      <div className="setting-description">
                        Choose your preferred color theme
                      </div>
                    </div>
                    <div className="setting-control">
                      <select 
                        className="form-select"
                        value={settings.theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">Compact View</div>
                      <div className="setting-description">
                        Reduces spacing for more information on screen
                      </div>
                    </div>
                    <div className="setting-control">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox"
                          checked={settings.compactView}
                          onChange={(e) => handleSettingChange('compactView', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div>
                <h2 className="section-title">Notification Settings</h2>
                
                <div className="setting-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">Browser Notifications</div>
                      <div className="setting-description">
                        Show notifications in browser
                      </div>
                    </div>
                    <div className="setting-control">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox"
                          checked={settings.notifications}
                          onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">Email Notifications</div>
                      <div className="setting-description">
                        Receive notifications via email
                      </div>
                    </div>
                    <div className="setting-control">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-label">Sound Effects</div>
                      <div className="setting-description">
                        Play sounds for notifications and actions
                      </div>
                    </div>
                    <div className="setting-control">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox"
                          checked={settings.soundEffects}
                          onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'data' && (
              <div>
                <h2 className="section-title">Data Management</h2>
                
                <div className="storage-info">
                  <h6>Storage Information</h6>
                  <p>
                    Local storage usage: <span className="storage-usage">{getStorageUsage()} KB</span>
                  </p>
                  <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                    Data is stored locally in your browser for better performance
                  </p>
                </div>

                <div className="setting-group">
                  <h6 className="setting-group-title">Backup & Restore</h6>
                  
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button className="btn-primary" onClick={exportSettings}>
                      <i className="fas fa-download"></i>
                      Export Settings
                    </button>
                    <label className="btn-secondary" style={{ margin: 0 }}>
                      <i className="fas fa-upload"></i>
                      Import Settings
                      <input 
                        type="file" 
                        accept=".json"
                        onChange={importSettings}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', color: '#6c757d', margin: 0 }}>
                    Export your settings to backup or import on another device
                  </p>
                </div>

                <div className="danger-zone">
                  <h6>Danger Zone</h6>
                  <p>
                    Clear all application data (except login information). 
                    This action cannot be undone.
                  </p>
                  <button 
                    className="btn-danger"
                    onClick={() => setShowClearDataModal(true)}
                  >
                    <i className="fas fa-trash"></i>
                    Clear All Data
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'system' && (
              <div>
                <h2 className="section-title">System Information</h2>
                
                <div className="system-info">
                  <h6>Application Details</h6>
                  <div className="info-item">
                    <span className="info-label">Version</span>
                    <span className="info-value">1.0.0</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Updated</span>
                    <span className="info-value">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Build</span>
                    <span className="info-value">Production</span>
                  </div>
                </div>

                <div className="system-info">
                  <h6>Browser Information</h6>
                  <div className="info-item">
                    <span className="info-label">Browser</span>
                    <span className="info-value">{navigator.userAgent.split(' ')[0]}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Platform</span>
                    <span className="info-value">{navigator.platform}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Language</span>
                    <span className="info-value">{navigator.language}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Online Status</span>
                    <span className="info-value">{navigator.onLine ? 'Online' : 'Offline'}</span>
                  </div>
                </div>

                <div className="system-info">
                  <h6>User Information</h6>
                  <div className="info-item">
                    <span className="info-label">User ID</span>
                    <span className="info-value">{user?._id?.slice(-8) || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Role</span>
                    <span className="info-value">{user?.role?.toUpperCase() || 'USER'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearDataModal && (
        <div className="modal-overlay" onClick={() => setShowClearDataModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Clear All Data</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowClearDataModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="warning-box">
                <i className="fas fa-exclamation-triangle"></i>
                This action will permanently delete all application data!
              </div>
              
              <p><strong>This will remove:</strong></p>
              <ul>
                <li>Application settings</li>
                <li>Cached data</li>
                <li>User preferences</li>
                <li>Temporary files</li>
              </ul>
              
              <p><strong>Your login information will be preserved.</strong></p>
              <p>Are you sure you want to continue?</p>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowClearDataModal(false)}
              >
                Cancel
              </button>
              <button className="btn-danger" onClick={handleClearData}>
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPage;