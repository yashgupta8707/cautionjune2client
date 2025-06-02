// client/src/App.jsx - Updated with new Profile & Settings components
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import LoginPage from './components/Auth/LoginPage'; // New unified login/register page
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Layout Components
import Navigation from './components/Navigation';
import Footer from './components/Layout/Footer';

// Dashboard
import Dashboard from './components/Dashboard/Dashboard';

// Party Components
import PartyList from './components/Party/PartyList';
import PartyForm from './components/Party/PartyForm';
import PartyDetail from './components/Party/PartyDetail';

// Quotation Components
import QuotationList from './components/Quotation/QuotationList';
import QuotationForm from './components/Quotation/QuotationForm';
import QuotationDetail from './components/Quotation/QuotationDetail';
import QuotationPDFButton from './components/Quotation/QuotationPDFButton';

// Component Library
import ComponentsList from './components/ComponentLibrary/ComponentsList';
import SearchBar from './components/ComponentSelector/SearchBar';

// Common Components
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingSpinner from './components/Common/LoadingSpinner';
import NotFound from './components/Common/NotFound';

// Settings Components (Existing)
import Profile from './components/Settings/Profile';
import ChangePassword from './components/Settings/ChangePassword';

// NEW: Enhanced Profile & Settings Components
import ProfilePage from './components/Profile/ProfilePage';
import SettingsPage from './components/Settings/SettingsPage';

// Other Components
import EstimatePrint from './components/EstimatePrint';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <NotificationProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public Routes - Multiple login options */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/register" element={<LoginPage />} />
                  <Route path="/auth/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <Navigation />
                      <main className="main-container">
                        <Routes>
                          {/* Dashboard */}
                          <Route path="/" element={<Navigate to="/dashboard" />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          
                          {/* Party Routes */}
                          <Route path="/parties" element={<PartyList />} />
                          <Route path="/parties/add" element={<PartyForm />} />
                          <Route path="/parties/edit/:id" element={<PartyForm />} />
                          <Route path="/parties/:id" element={<PartyDetail />} />
                          
                          {/* Quotation Routes */}
                          <Route path="/quotations" element={<QuotationList />} />
                          <Route path="/quotations/add/:partyId" element={<QuotationForm />} />
                          <Route path="/quotations/edit/:id" element={<QuotationForm />} />
                          <Route path="/quotations/revise/:reviseId" element={<QuotationForm />} />
                          <Route path="/quotations/:id" element={<QuotationDetail />} />
                          
                          {/* Component Library */}
                          <Route path="/components" element={<ComponentsList />} />
                          <Route path="/inventory" element={<ComponentsList />} />
                          
                          {/* ENHANCED: Profile & Settings Routes */}
                          {/* New enhanced profile page */}
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/my-profile" element={<ProfilePage />} />
                          
                          {/* New enhanced settings page */}
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="/app-settings" element={<SettingsPage />} />
                          
                          {/* Legacy Settings Routes (keeping for backward compatibility) */}
                          <Route path="/settings/profile" element={<Profile />} />
                          <Route path="/settings/change-password" element={<ChangePassword />} />
                          <Route path="/legacy-profile" element={<Profile />} />
                          
                          {/* Help & Support Routes */}
                          <Route path="/help" element={<HelpPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/support" element={<SupportPage />} />
                          
                          {/* Reports Routes (if you have them) */}
                          <Route path="/reports" element={<ReportsPage />} />
                          <Route path="/analytics" element={<AnalyticsPage />} />
                          
                          {/* Utility Routes */}
                          <Route path="/estimate" element={<EstimatePrint />} />
                          
                          {/* 404 Route */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </Router>
          </NotificationProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Placeholder components for missing routes
const HelpPage = () => (
  <div style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
    <h2>Help & Support</h2>
    <p>Welcome to the EmpressPC Help Center</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h4>📚 User Guide</h4>
        <p>Learn how to use all features</p>
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h4>❓ FAQ</h4>
        <p>Frequently asked questions</p>
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h4>📞 Contact Support</h4>
        <p>Get help from our team</p>
      </div>
    </div>
  </div>
);

const AboutPage = () => (
  <div style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
    <h2>About EmpressPC</h2>
    <p>Your trusted partner for computer solutions and business management.</p>
    <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '8px', marginTop: '30px' }}>
      <h4>🚀 Mission</h4>
      <p>To provide innovative computer solutions and streamlined business management tools.</p>
      <h4>✨ Features</h4>
      <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
        <li>Client Management (CRM)</li>
        <li>Quotation Generation</li>
        <li>Inventory Management</li>
        <li>PDF Generation</li>
        <li>Business Analytics</li>
      </ul>
    </div>
  </div>
);

const SupportPage = () => (
  <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
    <h2>Contact Support</h2>
    <p>Need help? We're here for you!</p>
    <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '8px', marginTop: '30px', textAlign: 'left' }}>
      <h4>📧 Email Support</h4>
      <p>support@empresspc.com</p>
      
      <h4>📞 Phone Support</h4>
      <p>+91 12345 67890</p>
      
      <h4>🕒 Business Hours</h4>
      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
      <p>Saturday: 10:00 AM - 4:00 PM</p>
    </div>
  </div>
);

const ReportsPage = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>Reports & Analytics</h2>
    <p>Business insights and reports</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h4>📊 Sales Reports</h4>
        <p>Track your sales performance</p>
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h4>👥 Client Reports</h4>
        <p>Analyze client interactions</p>
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h4>💰 Revenue Analysis</h4>
        <p>Monitor revenue trends</p>
      </div>
    </div>
  </div>
);

const AnalyticsPage = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>Business Analytics</h2>
    <p>Deep insights into your business performance</p>
    <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '8px', marginTop: '30px' }}>
      <p>Analytics dashboard coming soon...</p>
    </div>
  </div>
);

export default App;