// client/src/App.jsx - Updated with Daily Report and enhanced features
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

// NEW: Daily Report Component
import DailyReport from './components/Reports/DailyReport';

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
                          
                          {/* NEW: Daily Report Routes */}
                          <Route path="/daily-report" element={<DailyReport />} />
                          <Route path="/reports/daily" element={<DailyReport />} />
                          
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
                          
                          {/* Reports Routes - Enhanced with Daily Report */}
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
    <h2>📚 Help & Support</h2>
    <p className="text-muted mb-4">Welcome to the EmpressPC Help Center</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>📖 User Guide</h4>
        <p className="text-muted">Learn how to use all features</p>
        <button className="btn btn-outline-primary btn-sm">View Guide</button>
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>❓ FAQ</h4>
        <p className="text-muted">Frequently asked questions</p>
        <button className="btn btn-outline-primary btn-sm">Browse FAQ</button>
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>📞 Contact Support</h4>
        <p className="text-muted">Get help from our team</p>
        <button className="btn btn-outline-primary btn-sm">Contact Us</button>
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>🎥 Video Tutorials</h4>
        <p className="text-muted">Watch step-by-step guides</p>
        <button className="btn btn-outline-primary btn-sm">Watch Now</button>
      </div>
    </div>
    
    {/* Quick Help Section */}
    <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
      <h5>🚀 Quick Start</h5>
      <div className="text-start" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <ol>
          <li><strong>Add Clients:</strong> Go to Clients → Add New Client</li>
          <li><strong>Create Quotations:</strong> Select a client → Create Quotation</li>
          <li><strong>Generate PDFs:</strong> View quotation → Download PDF</li>
          <li><strong>Track Progress:</strong> Use Daily Report for insights</li>
        </ol>
      </div>
    </div>
  </div>
);

const AboutPage = () => (
  <div style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
    <h2>🏢 About EmpressPC</h2>
    <p className="text-muted mb-4">Your trusted partner for computer solutions and business management.</p>
    
    <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '8px', marginTop: '30px', border: '1px solid #e9ecef' }}>
      <h4>🚀 Our Mission</h4>
      <p>To provide innovative computer solutions and streamlined business management tools that help businesses grow and succeed.</p>
      
      <h4 className="mt-4">✨ Key Features</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
        <div className="text-start">
          <strong>👥 Client Management (CRM)</strong>
          <p className="small text-muted">Complete customer relationship management</p>
        </div>
        <div className="text-start">
          <strong>📄 Quotation System</strong>
          <p className="small text-muted">Professional quotation generation</p>
        </div>
        <div className="text-start">
          <strong>📦 Inventory Management</strong>
          <p className="small text-muted">Track components and products</p>
        </div>
        <div className="text-start">
          <strong>📊 Daily Reports</strong>
          <p className="small text-muted">Business insights and analytics</p>
        </div>
        <div className="text-start">
          <strong>📑 PDF Generation</strong>
          <p className="small text-muted">Professional document creation</p>
        </div>
        <div className="text-start">
          <strong>📈 Business Analytics</strong>
          <p className="small text-muted">Performance tracking and insights</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h5>📞 Contact Information</h5>
        <p><strong>Email:</strong> sales@empresspc.in</p>
        <p><strong>Phone:</strong> 8881123430</p>
        <p><strong>Address:</strong> MS-101, Sector D, Aliganj, Lucknow</p>
      </div>
    </div>
  </div>
);

const SupportPage = () => (
  <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
    <h2>📞 Contact Support</h2>
    <p className="text-muted mb-4">Need help? We're here for you!</p>
    
    <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '8px', marginTop: '30px', textAlign: 'left', border: '1px solid #e9ecef' }}>
      <div className="mb-4">
        <h4>📧 Email Support</h4>
        <p><strong>General Support:</strong> support@empresspc.com</p>
        <p><strong>Sales Inquiries:</strong> sales@empresspc.in</p>
        <p><strong>Technical Support:</strong> tech@empresspc.com</p>
      </div>
      
      <div className="mb-4">
        <h4>📞 Phone Support</h4>
        <p><strong>Primary:</strong> 8881123430</p>
        <p><strong>Toll Free:</strong> 1800-XXX-XXXX</p>
      </div>
      
      <div className="mb-4">
        <h4>🕒 Business Hours</h4>
        <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
        <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
        <p><strong>Sunday:</strong> Closed</p>
      </div>
      
      <div className="mb-4">
        <h4>📍 Office Address</h4>
        <p>MS-101, Sector D, Aliganj<br />Lucknow, Uttar Pradesh<br />India</p>
      </div>
      
      <div className="text-center">
        <button className="btn btn-primary me-2">📧 Send Email</button>
        <button className="btn btn-outline-primary">📞 Request Callback</button>
      </div>
    </div>
  </div>
);

const ReportsPage = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>📊 Reports & Analytics</h2>
    <p className="text-muted mb-4">Comprehensive business insights and reports</p>
    
    {/* Featured Report - Daily Report */}
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
      <h3>📅 Daily Report - Featured</h3>
      <p>Get detailed insights into your daily business activities</p>
      <a href="/daily-report" className="btn btn-light btn-lg">
        View Daily Report
      </a>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>📈 Sales Reports</h4>
        <p className="text-muted">Track your sales performance and revenue trends</p>
        <button className="btn btn-outline-primary btn-sm">Coming Soon</button>
      </div>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>👥 Client Reports</h4>
        <p className="text-muted">Analyze client interactions and relationships</p>
        <button className="btn btn-outline-primary btn-sm">Coming Soon</button>
      </div>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>💰 Revenue Analysis</h4>
        <p className="text-muted">Monitor revenue trends and profitability</p>
        <button className="btn btn-outline-primary btn-sm">Coming Soon</button>
      </div>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>📦 Inventory Reports</h4>
        <p className="text-muted">Track component usage and inventory levels</p>
        <button className="btn btn-outline-primary btn-sm">Coming Soon</button>
      </div>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>🎯 Performance Metrics</h4>
        <p className="text-muted">Monitor KPIs and business performance</p>
        <button className="btn btn-outline-primary btn-sm">Coming Soon</button>
      </div>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>📅 Custom Reports</h4>
        <p className="text-muted">Create custom reports for specific needs</p>
        <button className="btn btn-outline-primary btn-sm">Coming Soon</button>
      </div>
    </div>
    
    {/* Quick Access to Current Reports */}
    <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
      <h5>🚀 Available Now</h5>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <a href="/daily-report" className="btn btn-success">📅 Daily Report</a>
        <a href="/dashboard" className="btn btn-outline-success">📊 Dashboard</a>
        <a href="/quotations" className="btn btn-outline-success">📄 Quotations List</a>
        <a href="/parties" className="btn btn-outline-success">👥 Clients List</a>
      </div>
    </div>
  </div>
);

const AnalyticsPage = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>📊 Business Analytics</h2>
    <p className="text-muted mb-4">Deep insights into your business performance</p>
    
    <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
      <h3>🚀 Analytics Dashboard</h3>
      <p>Advanced analytics and business intelligence coming soon!</p>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>📈 Trend Analysis</h4>
        <p className="text-muted">Identify patterns and trends in your business data</p>
      </div>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>🎯 Conversion Tracking</h4>
        <p className="text-muted">Monitor lead to customer conversion rates</p>
      </div>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>💡 Predictive Analytics</h4>
        <p className="text-muted">Forecast future business performance</p>
      </div>
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h4>🔍 Customer Insights</h4>
        <p className="text-muted">Understand customer behavior and preferences</p>
      </div>
    </div>
    
    {/* Temporary redirect to available features */}
    <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', marginTop: '30px', border: '1px solid #ffeaa7' }}>
      <h5>🔗 Available Analytics</h5>
      <p>While we work on advanced analytics, check out these current features:</p>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <a href="/daily-report" className="btn btn-warning">📅 Daily Business Report</a>
        <a href="/dashboard" className="btn btn-outline-warning">📊 Dashboard Overview</a>
      </div>
    </div>
  </div>
);

export default App;