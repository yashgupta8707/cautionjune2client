// client/src/components/DailyReport/DailyReport.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Button, 
  Alert,
  Spinner,
  Table,
  ListGroup,
  Form
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dailyReportService } from '../../services/api';

const DailyReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDailyReport();
  }, [selectedDate]);

  const fetchDailyReport = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📊 Fetching daily report for:', selectedDate);
      const response = await dailyReportService.getDailyReport(selectedDate);
      
      console.log('✅ Daily report data:', response.data);
      setReportData(response.data);
      
    } catch (error) {
      console.error('❌ Error fetching daily report:', error);
      setError(`Failed to load daily report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    const icons = {
      new_client: '👤',
      new_quotation: '📄',
      quotation_update: '📝',
      follow_up: '📅'
    };
    return icons[type] || '📌';
  };

  const getActivityColor = (type) => {
    const colors = {
      new_client: 'success',
      new_quotation: 'primary',
      quotation_update: 'warning',
      follow_up: 'info'
    };
    return colors[type] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading daily report...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Daily Report</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={fetchDailyReport}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!reportData || !reportData.data) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>No Data Available</Alert.Heading>
          <p>No daily report data available for the selected date.</p>
        </Alert>
      </Container>
    );
  }

  // Extract data from the correct nested structure
  const { data: report } = reportData;
  const today = report.today || {};
  const newClients = today.newClients || { count: 0, clients: [] };
  const quotations = today.quotations || { new: { count: 0, quotations: [] }, updated: { count: 0, quotations: [] } };
  const followUps = today.followUps || { scheduled: { count: 0, clients: [] }, overdue: { count: 0, clients: [] } };
  const activities = today.activities || [];
  const totals = report.totals || {};
  const summary = report.summary || {};

  return (
    <Container fluid className="mt-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>📊 Daily Business Report</h2>
              <p className="text-muted mb-0">
                {formatDate(report.date)} • Generated at {formatTime(report.generatedAt)}
              </p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: 'auto' }}
              />
              <Button variant="outline-primary" onClick={fetchDailyReport}>
                🔄 Refresh
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">New Clients</h6>
                  <h3 className="mb-0">{newClients.count}</h3>
                </div>
                <div className="text-primary" style={{ fontSize: '2rem' }}>
                  👤
                </div>
              </div>
              {newClients.count > 0 && (
                <div className="mt-2">
                  <Badge bg="success">+{newClients.count} today</Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-success">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">New Quotations</h6>
                  <h3 className="mb-0">{quotations.new.count}</h3>
                </div>
                <div className="text-success" style={{ fontSize: '2rem' }}>
                  📄
                </div>
              </div>
              {quotations.new.totalValue > 0 && (
                <div className="mt-2">
                  <small className="text-muted">
                    ₹{quotations.new.totalValue.toLocaleString()}
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-warning">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Follow-ups Today</h6>
                  <h3 className="mb-0">{followUps.scheduled.count}</h3>
                </div>
                <div className="text-warning" style={{ fontSize: '2rem' }}>
                  📅
                </div>
              </div>
              {followUps.overdue.count > 0 && (
                <div className="mt-2">
                  <Badge bg="danger">{followUps.overdue.count} overdue</Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-info">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Activities</h6>
                  <h3 className="mb-0">{activities.length}</h3>
                </div>
                <div className="text-info" style={{ fontSize: '2rem' }}>
                  📈
                </div>
              </div>
              {summary.busyDay && (
                <div className="mt-2">
                  <Badge bg="info">Busy day!</Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Priority Areas Alert */}
      {summary.priorityAreas && summary.priorityAreas.length > 0 && (
        <Alert variant={summary.hasOverdueItems ? 'danger' : 'info'} className="mb-4">
          <Alert.Heading>
            {summary.hasOverdueItems ? '⚠️ Attention Required' : '📋 Today\'s Focus Areas'}
          </Alert.Heading>
          <ul className="mb-0">
            {summary.priorityAreas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Row>
        {/* Left Column - New Clients & Quotations */}
        <Col lg={6}>
          {/* New Clients */}
          <Card className="mb-4">
            <Card.Header>
              <h5>👤 New Clients Today ({newClients.count})</h5>
            </Card.Header>
            <Card.Body>
              {newClients.clients.length === 0 ? (
                <p className="text-muted text-center py-3">No new clients added today</p>
              ) : (
                <ListGroup variant="flush">
                  {newClients.clients.map((client) => (
                    <ListGroup.Item key={client.id} className="px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{client.name}</strong>
                          <div className="text-muted small">
                            ID: {client.partyId} • {client.phone}
                          </div>
                          <div className="text-muted small">
                            Source: {client.source} • Priority: {client.priority}
                          </div>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">
                            {formatTime(client.createdAt)}
                          </small>
                          <div>
                            <Link to={`/parties/${client.id}`}>
                              <Button size="sm" variant="outline-primary">View</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>

          {/* New Quotations */}
          <Card className="mb-4">
            <Card.Header>
              <h5>📄 New Quotations Today ({quotations.new.count})</h5>
            </Card.Header>
            <Card.Body>
              {quotations.new.quotations.length === 0 ? (
                <p className="text-muted text-center py-3">No new quotations created today</p>
              ) : (
                <>
                  {quotations.new.totalValue > 0 && (
                    <Alert variant="success" className="mb-3">
                      <strong>Total Value: ₹{quotations.new.totalValue.toLocaleString()}</strong>
                      {quotations.new.averageValue > 0 && (
                        <span className="ms-3">
                          • Average: ₹{quotations.new.averageValue.toLocaleString()}
                        </span>
                      )}
                    </Alert>
                  )}
                  <ListGroup variant="flush">
                    {quotations.new.quotations.map((quote) => (
                      <ListGroup.Item key={quote.id} className="px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{quote.title}</strong>
                            <div className="text-muted small">
                              Client: {quote.client.name} ({quote.client.partyId})
                            </div>
                            <div className="text-muted small">
                              Amount: ₹{quote.amount.toLocaleString()} • Status: {quote.status}
                            </div>
                          </div>
                          <div className="text-end">
                            <small className="text-muted">
                              {formatTime(quote.createdAt)}
                            </small>
                            <div>
                              <Link to={`/quotations/${quote.id}`}>
                                <Button size="sm" variant="outline-primary">View</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Follow-ups & Activity Timeline */}
        <Col lg={6}>
          {/* Follow-ups */}
          <Card className="mb-4">
            <Card.Header>
              <h5>📅 Follow-ups</h5>
            </Card.Header>
            <Card.Body>
              {/* Today's Follow-ups */}
              <div className="mb-3">
                <h6>Today ({followUps.scheduled.count})</h6>
                {followUps.scheduled.clients.length === 0 ? (
                  <p className="text-muted small">No follow-ups scheduled for today</p>
                ) : (
                  <ListGroup size="sm">
                    {followUps.scheduled.clients.map((client) => (
                      <ListGroup.Item key={client.id} className="py-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{client.name}</strong>
                            <div className="text-muted small">{client.followUpNote}</div>
                          </div>
                          <Link to={`/parties/${client.id}`}>
                            <Button size="sm" variant="outline-info">View</Button>
                          </Link>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>

              {/* Overdue Follow-ups */}
              {followUps.overdue.count > 0 && (
                <div>
                  <h6 className="text-danger">Overdue ({followUps.overdue.count})</h6>
                  <ListGroup size="sm">
                    {followUps.overdue.clients.map((client) => (
                      <ListGroup.Item key={client.id} className="py-2 border-danger">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong className="text-danger">{client.name}</strong>
                            <div className="text-muted small">
                              {client.daysPastDue} days overdue • {client.followUpNote}
                            </div>
                          </div>
                          <Link to={`/parties/${client.id}`}>
                            <Button size="sm" variant="danger">Urgent</Button>
                          </Link>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <Card.Header>
              <h5>📈 Activity Timeline</h5>
            </Card.Header>
            <Card.Body>
              {activities.length === 0 ? (
                <p className="text-muted text-center py-3">No activities recorded today</p>
              ) : (
                <div className="activity-timeline">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="d-flex mb-3">
                      <div className="flex-shrink-0 me-3">
                        <Badge bg={getActivityColor(activity.type)} className="p-2">
                          {getActivityIcon(activity.type)}
                        </Badge>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{activity.title}</h6>
                        <p className="text-muted small mb-1">{activity.description}</p>
                        <small className="text-muted">{formatTime(activity.timestamp)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Overall Statistics */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>📊 Overall Statistics</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  <h3 className="text-primary">{totals.clients || 0}</h3>
                  <p className="text-muted">Total Clients</p>
                </Col>
                <Col md={4} className="text-center">
                  <h3 className="text-success">{totals.quotations || 0}</h3>
                  <p className="text-muted">Total Quotations</p>
                </Col>
                <Col md={4} className="text-center">
                  <h3 className="text-warning">₹{(totals.totalQuotationValue || 0).toLocaleString()}</h3>
                  <p className="text-muted">Total Quotation Value</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DailyReport;