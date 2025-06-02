// client/src/components/Dashboard/Dashboard.js - Fixed and organized code
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { quotationService, partyService } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalParties: 0,
    totalQuotations: 0,
    draftQuotations: 0,
    sentQuotations: 0,
    lostQuotations: 0,
    soldQuotations: 0,
    totalRevenue: 0,
    totalProfit: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [quotationsRes, partiesRes] = await Promise.all([
          quotationService.getAll(),
          partyService.getAll()
        ]);
        
        const quotations = quotationsRes.data?.data || quotationsRes.data || [];
        const parties = partiesRes.data?.data || partiesRes.data || [];
        
        // Calculate stats
        const totalRevenue = quotations
          .filter(q => q.status === 'sold')
          .reduce((sum, q) => sum + (q.totalAmount || 0), 0);
          
        const totalProfit = quotations
          .filter(q => q.status === 'sold')
          .reduce((sum, q) => sum + ((q.totalAmount || 0) - (q.totalPurchase || 0)), 0);
        
        setStats({
          totalParties: parties.length,
          totalQuotations: quotations.length,
          draftQuotations: quotations.filter(q => q.status === 'draft').length,
          sentQuotations: quotations.filter(q => q.status === 'sent').length,
          lostQuotations: quotations.filter(q => q.status === 'lost').length,
          soldQuotations: quotations.filter(q => q.status === 'sold').length,
          totalRevenue,
          totalProfit
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .dashboard-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: calc(100vh - 80px);
            padding: 2rem 0;
          }
          
          .stat-card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            background: white;
            overflow: hidden;
            position: relative;
          }
          
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          }
          
          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--card-accent, #3498db);
          }
          
          .stat-card.revenue::before {
            background: linear-gradient(90deg, #27ae60, #2ecc71);
          }
          
          .stat-card.profit::before {
            background: linear-gradient(90deg, #3498db, #2980b9);
          }
          
          .stat-card.clients::before {
            background: linear-gradient(90deg, #9b59b6, #8e44ad);
          }
          
          .stat-card.quotations::before {
            background: linear-gradient(90deg, #e67e22, #d35400);
          }
          
          .stat-card.draft::before {
            background: linear-gradient(90deg, #95a5a6, #7f8c8d);
          }
          
          .stat-card.sent::before {
            background: linear-gradient(90deg, #3498db, #2980b9);
          }
          
          .stat-card.lost::before {
            background: linear-gradient(90deg, #e74c3c, #c0392b);
          }
          
          .stat-card.sold::before {
            background: linear-gradient(90deg, #27ae60, #2ecc71);
          }
          
          .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 0.5rem;
          }
          
          .stat-label {
            font-size: 1rem;
            font-weight: 500;
            color: #7f8c8d;
            margin-bottom: 1rem;
          }
          
          .stat-footer {
            background: #f8f9fa;
            padding: 0.75rem 1.25rem;
            margin: -1.25rem -1.25rem -1.25rem -1.25rem;
            margin-top: 1rem;
            border-radius: 0 0 12px 12px;
          }
          
          .stat-footer a {
            color: #6c757d;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: color 0.3s ease;
          }
          
          .stat-footer a:hover {
            color: #495057;
          }
          
          .welcome-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
          }
          
          .welcome-card .card-body {
            padding: 2rem;
          }
          
          .quick-actions {
            background: white;
            border: none;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          
          .quick-action-btn {
            display: block;
            width: 100%;
            padding: 1rem;
            margin-bottom: 0.5rem;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            color: #495057;
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 500;
          }
          
          .quick-action-btn:hover {
            background: #e9ecef;
            border-color: #dee2e6;
            color: #343a40;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .quick-action-btn i {
            width: 20px;
            margin-right: 10px;
            color: #6c757d;
          }
          
          .metric-icon {
            font-size: 1.2rem;
            margin-right: 0.5rem;
            opacity: 0.7;
          }
          
          .dashboard-title {
            color: #2c3e50;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          
          .dashboard-subtitle {
            color: #7f8c8d;
            margin-bottom: 2rem;
          }
          
          @media (max-width: 768px) {
            .stat-number {
              font-size: 2rem;
            }
            
            .dashboard-container {
              padding: 1rem 0;
            }
          }
        `
      }} />
      
      <div className="dashboard-container">
        <Container>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Welcome Section */}
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="welcome-card">
                <Card.Body>
                  <h1 className="dashboard-title text-white">Welcome to EmpressPC Dashboard</h1>
                  <p className="dashboard-subtitle text-white-50">
                    Monitor your business performance, manage clients, and track quotations all in one place.
                  </p>
                  <div className="d-flex flex-wrap gap-3 mt-3">
                    <div className="text-white-50">
                      <i className="fas fa-chart-line metric-icon"></i>
                      Real-time Analytics
                    </div>
                    <div className="text-white-50">
                      <i className="fas fa-users metric-icon"></i>
                      Client Management
                    </div>
                    <div className="text-white-50">
                      <i className="fas fa-file-invoice-dollar metric-icon"></i>
                      Quotation Tracking
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="quick-actions h-100">
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-bolt me-2"></i>
                    Quick Actions
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Link to="/parties/add" className="quick-action-btn">
                    <i className="fas fa-user-plus"></i>
                    Add New Client
                  </Link>
                  <Link to="/quotations" className="quick-action-btn">
                    <i className="fas fa-file-invoice"></i>
                    Create Quotation
                  </Link>
                  <Link to="/components" className="quick-action-btn">
                    <i className="fas fa-microchip"></i>
                    Manage Inventory
                  </Link>
                  <Link to="/parties" className="quick-action-btn">
                    <i className="fas fa-search"></i>
                    Search Clients
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Main Statistics */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-4">
              <Card className="stat-card clients h-100">
                <Card.Body className="text-center">
                  <div className="stat-number">{stats.totalParties}</div>
                  <div className="stat-label">Total Clients</div>
                  <div className="stat-footer">
                    <Link to="/parties">View All Clients →</Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <Card className="stat-card quotations h-100">
                <Card.Body className="text-center">
                  <div className="stat-number">{stats.totalQuotations}</div>
                  <div className="stat-label">Total Quotations</div>
                  <div className="stat-footer">
                    <Link to="/quotations">View All Quotations →</Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <Card className="stat-card revenue h-100">
                <Card.Body className="text-center">
                  <div className="stat-number">₹{stats.totalRevenue.toLocaleString()}</div>
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-footer">
                    <Link to="/quotations?status=sold">
                      Sold: {stats.soldQuotations} quotations →
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <Card className="stat-card profit h-100">
                <Card.Body className="text-center">
                  <div className="stat-number">₹{stats.totalProfit.toLocaleString()}</div>
                  <div className="stat-label">Total Profit</div>
                  <div className="stat-footer">
                    <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                      Margin: {stats.totalRevenue > 0 ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Quotation Status Breakdown */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-4">
              <Card className="stat-card draft h-100">
                <Card.Body className="text-center">
                  <div className="stat-number">{stats.draftQuotations}</div>
                  <div className="stat-label">Draft Quotations</div>
                  <div className="stat-footer">
                    <Link to="/quotations?status=draft">View Drafts →</Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <Card className="stat-card sent h-100">
                <Card.Body className="text-center">
                  <div className="stat-number">{stats.sentQuotations}</div>
                  <div className="stat-label">Sent Quotations</div>
                  <div className="stat-footer">
                    <Link to="/quotations?status=sent">View Sent →</Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <Card className="stat-card lost h-100">
                <Card.Body className="text-center">
                  <div className="stat-number">{stats.lostQuotations}</div>
                  <div className="stat-label">Lost Quotations</div>
                  <div className="stat-footer">
                    <Link to="/quotations?status=lost">View Lost →</Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <Card className="stat-card sold h-100">
                <Card.Body className="text-center">
                  <div className="stat-number">{stats.soldQuotations}</div>
                  <div className="stat-label">Sold Quotations</div>
                  <div className="stat-footer">
                    <Link to="/quotations?status=sold">View Sold →</Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Performance Summary */}
          {stats.totalQuotations > 0 && (
            <Row className="mt-5">
              <Col>
                <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
                  <Card.Header style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', borderRadius: '15px 15px 0 0' }}>
                    <h5 className="mb-0">
                      <i className="fas fa-chart-pie me-2"></i>
                      Business Performance Summary
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4} className="text-center">
                        <h6 className="text-muted">Conversion Rate</h6>
                        <h4 className="text-success">
                          {((stats.soldQuotations / stats.totalQuotations) * 100).toFixed(1)}%
                        </h4>
                        <small className="text-muted">
                          {stats.soldQuotations} out of {stats.totalQuotations} quotations
                        </small>
                      </Col>
                      <Col md={4} className="text-center">
                        <h6 className="text-muted">Average Quote Value</h6>
                        <h4 className="text-primary">
                          ₹{stats.totalQuotations > 0 ? 
                            Math.round((stats.totalRevenue + (stats.draftQuotations + stats.sentQuotations + stats.lostQuotations) * (stats.totalRevenue / Math.max(stats.soldQuotations, 1))) / stats.totalQuotations).toLocaleString() 
                            : 0}
                        </h4>
                        <small className="text-muted">Per quotation</small>
                      </Col>
                      <Col md={4} className="text-center">
                        <h6 className="text-muted">Profit Margin</h6>
                        <h4 className="text-info">
                          {stats.totalRevenue > 0 ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1) : 0}%
                        </h4>
                        <small className="text-muted">On sold quotations</small>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </>
  );
};

export default Dashboard;