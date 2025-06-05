// client/src/components/Party/PartyList.js - Updated with prominent Create Quotation button
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { partyService } from '../../services/api';
import { 
  Table, 
  Button, 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  InputGroup, 
  Badge, 
  Dropdown,
  Modal,
  Alert,
  OverlayTrigger,
  Tooltip,
  ButtonGroup,
  Spinner
} from 'react-bootstrap';

const PartyList = () => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dateFilter: '',
    source: '',
    priority: '',
    dealStatus: '',
    followUpDate: ''
  });
  
  // Modal states
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [followUpData, setFollowUpData] = useState({ date: '', note: '' });
  const [commentData, setCommentData] = useState({ message: '', type: 'comment' });
  
  // Error and loading states
  const [error, setError] = useState('');
  const [remindersLoading, setRemindersLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState(null);
  
  // Reminders and notifications
  const [todaysFollowUps, setTodaysFollowUps] = useState([]);
  const [overdueFollowUps, setOverdueFollowUps] = useState([]);
  const [showReminders, setShowReminders] = useState(false);

  useEffect(() => {
    fetchParties();
    fetchFollowUpReminders();
  }, [filters]);

  const fetchParties = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Fetching parties...');
      
      const queryParams = new URLSearchParams();
      
      // Add search term
      if (searchTerm) queryParams.append('search', searchTerm);
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const queryString = queryParams.toString();
      console.log('📡 API Query:', queryString ? `?${queryString}` : 'No query params');
      
      const response = await partyService.getAll(queryString ? `?${queryString}` : '');
      
      // Debug logging
      console.log('📦 Full API Response:', response);
      console.log('📊 Response Data:', response.data);
      console.log('🔢 Response Status:', response.status);
      console.log('📋 Response Headers:', response.headers);
      
      // Set debug info for display
      setDebugInfo({
        fullResponse: response,
        responseData: response.data,
        status: response.status,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        keys: response.data ? Object.keys(response.data) : []
      });
      
      // Handle different possible response structures
      let partiesData = [];
      
      if (response.data) {
        // Try different possible data structures
        if (Array.isArray(response.data)) {
          partiesData = response.data;
          console.log('✅ Data is direct array');
        } else if (response.data.parties && Array.isArray(response.data.parties)) {
          partiesData = response.data.parties;
          console.log('✅ Data found in response.data.parties');
        } else if (response.data.data && Array.isArray(response.data.data)) {
          partiesData = response.data.data;
          console.log('✅ Data found in response.data.data');
        } else if (response.data.results && Array.isArray(response.data.results)) {
          partiesData = response.data.results;
          console.log('✅ Data found in response.data.results');
        } else {
          console.log('❌ Could not find array data in response');
          console.log('🔍 Available keys:', Object.keys(response.data));
          
          // If it's an object with values, try to extract them
          const values = Object.values(response.data);
          const arrayValue = values.find(val => Array.isArray(val));
          if (arrayValue) {
            partiesData = arrayValue;
            console.log('✅ Found array in object values');
          }
        }
      }
      
      console.log('👥 Final parties data:', partiesData);
      console.log('📊 Parties count:', partiesData.length);
      
      if (partiesData.length > 0) {
        console.log('🎯 First party sample:', partiesData[0]);
      }
      
      setParties(partiesData);
      
    } catch (error) {
      console.error('❌ Error fetching parties:', error);
      console.error('📄 Error response:', error.response);
      console.error('📊 Error data:', error.response?.data);
      console.error('🔢 Error status:', error.response?.status);
      
      setError(`Failed to load clients: ${error.message}`);
      setParties([]);
      
      // Set debug info for error
      setDebugInfo({
        error: true,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        errorStatus: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowUpReminders = async () => {
    try {
      setRemindersLoading(true);
      
      // Temporary implementation using existing data
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todaysReminders = parties.filter(party => {
        if (!party.nextFollowUp?.date) return false;
        const followUpDate = new Date(party.nextFollowUp.date);
        followUpDate.setHours(0, 0, 0, 0);
        return followUpDate.getTime() === today.getTime();
      });
      
      const overdueReminders = parties.filter(party => {
        if (!party.nextFollowUp?.date) return false;
        const followUpDate = new Date(party.nextFollowUp.date);
        return followUpDate < today;
      });
      
      setTodaysFollowUps(todaysReminders);
      setOverdueFollowUps(overdueReminders);
      
    } catch (error) {
      console.error('Error fetching follow-up reminders:', error);
    } finally {
      setRemindersLoading(false);
    }
  };

  // Trigger search when searchTerm changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchParties();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter parties based on search term (client-side filtering as backup)
  const filteredParties = Array.isArray(parties) ? parties.filter(party => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      party.partyId?.toLowerCase().includes(searchLower) ||
      party.name?.toLowerCase().includes(searchLower) ||
      party.phone?.toLowerCase().includes(searchLower) ||
      party.email?.toLowerCase().includes(searchLower) ||
      party.address?.toLowerCase().includes(searchLower) ||
      party.requirements?.toLowerCase().includes(searchLower)
    );
  }) : [];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateFilter: '',
      source: '',
      priority: '',
      dealStatus: '',
      followUpDate: ''
    });
    setSearchTerm('');
  };

  const handleAddFollowUp = async () => {
    if (!followUpData.date) {
      alert('Please select a follow-up date');
      return;
    }

    try {
      setModalLoading(true);
      await partyService.addFollowUp(selectedParty._id, followUpData);
      setShowFollowUpModal(false);
      setFollowUpData({ date: '', note: '' });
      fetchParties();
      fetchFollowUpReminders();
    } catch (error) {
      console.error('Error adding follow-up:', error);
      alert('Failed to add follow-up. This feature will be available when the backend is updated.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentData.message.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      setModalLoading(true);
      await partyService.addComment(selectedParty._id, commentData);
      setShowCommentModal(false);
      setCommentData({ message: '', type: 'comment' });
      fetchParties();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. This feature will be available when the backend is updated.');
    } finally {
      setModalLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = { low: 'success', medium: 'warning', high: 'danger' };
    const icons = { low: '🟢', medium: '🟡', high: '🔴' };
    return (
      <Badge bg={colors[priority]} className="d-flex align-items-center gap-1">
        <span>{icons[priority]}</span>
        {priority?.toUpperCase() || 'MEDIUM'}
      </Badge>
    );
  };

  const getDealStatusBadge = (status) => {
    const colors = {
      in_progress: 'primary',
      won: 'success',
      lost: 'danger',
      on_hold: 'warning'
    };
    const displayStatus = status || 'in_progress';
    return <Badge bg={colors[displayStatus]}>{displayStatus.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getSourceIcon = (source) => {
    const icons = {
      Instagram: '📷',
      Linkedin: '💼',
      Whatsapp: '📱',
      'Walk-in': '🚶',
      Referral: '👥',
      Website: '🌐',
      Other: '📌'
    };
    return icons[source] || '📌';
  };

  const isFollowUpOverdue = (date) => {
    return date && new Date(date) < new Date();
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading clients...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      {/* Debug Information - Remove this in production */}
      {/* {debugInfo && (
        <Alert variant="info" className="mb-4">
          <h6>🔧 Debug Information (Remove in production)</h6>
          <div style={{fontSize: '0.85em'}}>
            <strong>API Response Status:</strong> {debugInfo.status || 'N/A'}<br/>
            <strong>Data Type:</strong> {debugInfo.dataType}<br/>
            <strong>Is Array:</strong> {debugInfo.isArray?.toString()}<br/>
            <strong>Available Keys:</strong> {debugInfo.keys?.join(', ') || 'None'}<br/>
            <strong>Parties Count:</strong> {parties.length}<br/>
            {debugInfo.error && (
              <>
                <strong className="text-danger">Error:</strong> {debugInfo.errorMessage}<br/>
                <strong className="text-danger">Error Status:</strong> {debugInfo.errorStatus}<br/>
              </>
            )}
            <details className="mt-2">
              <summary>Full Response Data</summary>
              <pre style={{fontSize: '0.75em', maxHeight: '200px', overflow: 'auto'}}>
                {JSON.stringify(debugInfo.responseData || debugInfo.errorResponse, null, 2)}
              </pre>
            </details>
          </div>
        </Alert>
      )} */}

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Reminders Section */}
      {(todaysFollowUps.length > 0 || overdueFollowUps.length > 0) && (
        <Alert variant="info" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>📅 Follow-up Reminders:</strong>
              {todaysFollowUps.length > 0 && (
                <span className="ms-2">
                  <Badge bg="primary">{todaysFollowUps.length}</Badge> Today
                </span>
              )}
              {overdueFollowUps.length > 0 && (
                <span className="ms-2">
                  <Badge bg="danger">{overdueFollowUps.length}</Badge> Overdue
                </span>
              )}
            </div>
            <Button 
              variant="outline-info" 
              size="sm" 
              onClick={() => setShowReminders(!showReminders)}
              disabled={remindersLoading}
            >
              {remindersLoading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                showReminders ? 'Hide' : 'View'
              )} Details
            </Button>
          </div>
          
          {showReminders && (
            <div className="mt-3">
              {todaysFollowUps.map(party => (
                <div key={party._id} className="mb-2 p-2 bg-light rounded">
                  <strong>{party.name} ({party.partyId})</strong> - 
                  Follow up today: {party.nextFollowUp?.note || 'No note'}
                  <Link to={`/parties/${party._id}`} className="ms-2">
                    <Button size="sm" variant="outline-primary">View</Button>
                  </Link>
                </div>
              ))}
              {overdueFollowUps.map(party => (
                <div key={party._id} className="mb-2 p-2 bg-danger bg-opacity-10 rounded">
                  <strong>{party.name} ({party.partyId})</strong> - 
                  <span className="text-danger">
                    Overdue: {new Date(party.nextFollowUp?.date).toLocaleDateString()}
                  </span>
                  <Link to={`/parties/${party._id}`} className="ms-2">
                    <Button size="sm" variant="outline-danger">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Alert>
      )}

      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <h2>Client Management (CRM)</h2>
          <p className="text-muted">
            Total Clients: <Badge bg="primary">{parties.length}</Badge>
            {todaysFollowUps.length > 0 && (
              <span className="ms-3">
                Today's Follow-ups: <Badge bg="info">{todaysFollowUps.length}</Badge>
              </span>
            )}
          </p>
        </Col>
        <Col className="text-end">
          <Link to="/parties/add">
            <Button variant="primary">Add New Client</Button>
          </Link>
        </Col>
      </Row>

      {/* Filters Section */}
      <Card className="mb-4">
        <Card.Header>
          <h5>🔍 Filters & Search</h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {/* Search Bar */}
            <Col md={4}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchTerm('')}
                    title="Clear search"
                  >
                    ✕
                  </Button>
                )}
              </InputGroup>
            </Col>

            {/* Date Filter */}
            <Col md={2}>
              <Form.Select
                value={filters.dateFilter}
                onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </Form.Select>
            </Col>

            {/* Source Filter */}
            <Col md={2}>
              <Form.Select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
              >
                <option value="">All Sources</option>
                <option value="Instagram">📷 Instagram</option>
                <option value="Linkedin">💼 LinkedIn</option>
                <option value="Whatsapp">📱 WhatsApp</option>
                <option value="Walk-in">🚶 Walk-in</option>
                <option value="Referral">👥 Referral</option>
                <option value="Website">🌐 Website</option>
                <option value="Other">📌 Other</option>
              </Form.Select>
            </Col>

            {/* Priority Filter */}
            <Col md={2}>
              <Form.Select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </Form.Select>
            </Col>

            {/* Deal Status Filter */}
            <Col md={2}>
              <Form.Select
                value={filters.dealStatus}
                onChange={(e) => handleFilterChange('dealStatus', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="in_progress">In Progress</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="on_hold">On Hold</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
              {searchTerm && (
                <small className="text-muted ms-3">
                  Showing {filteredParties.length} of {parties.length} clients
                </small>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Main Table */}
      {parties.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No clients found</Card.Title>
            <Card.Text>
              {error ? 
                'There was an error loading clients. Check the debug information above.' :
                "You haven't added any clients yet. Add your first client to get started."
              }
            </Card.Text>
            <Link to="/parties/add">
              <Button variant="primary">Add New Client</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : filteredParties.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No clients match your filters</Card.Title>
            <Card.Text>
              No clients found matching your current filters. Try adjusting your search criteria.
            </Card.Text>
            <Button variant="outline-primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Client ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Priority</th>
                  <th>Requirements</th>
                  <th>Deal Status</th>
                  <th>Next Follow-up</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParties.map((party) => (
                  <tr key={party._id || party.id}>
                    <td>
                      <Badge bg="info">{party.partyId || party.id || 'N/A'}</Badge>
                    </td>
                    <td>
                      <div>
                        <Link to={`/parties/${party._id || party.id}`} className="fw-bold text-decoration-none">
                          {party.name || 'No Name'}
                        </Link>
                        {party.tags && party.tags.length > 0 && (
                          <div className="mt-1">
                            {party.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} bg="light" text="dark" className="me-1" style={{fontSize: '0.7em'}}>
                                {tag}
                              </Badge>
                            ))}
                            {party.tags.length > 2 && (
                              <Badge bg="light" text="dark" style={{fontSize: '0.7em'}}>
                                +{party.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-bold">{party.phone || 'No Phone'}</div>
                        {party.email && (
                          <small className="text-muted">{party.email}</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span title={party.source || 'Walk-in'}>
                        {getSourceIcon(party.source)} {(party.source || 'Walk-in').replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {getPriorityBadge(party.priority)}
                    </td>
                    <td>
                      <div style={{maxWidth: '200px'}}>
                        {party.requirements ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{party.requirements}</Tooltip>}
                          >
                            <span className="text-truncate d-block">
                              {party.requirements.length > 50 
                                ? party.requirements.substring(0, 50) + '...'
                                : party.requirements
                              }
                            </span>
                          </OverlayTrigger>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {getDealStatusBadge(party.dealStatus)}
                    </td>
                    <td>
                      {party.nextFollowUp?.date ? (
                        <div>
                          <div className={`fw-bold ${isFollowUpOverdue(party.nextFollowUp.date) ? 'text-danger' : 'text-primary'}`}>
                            {new Date(party.nextFollowUp.date).toLocaleDateString()}
                          </div>
                          {party.nextFollowUp.note && (
                            <small className="text-muted d-block">
                              {party.nextFollowUp.note.length > 30 
                                ? party.nextFollowUp.note.substring(0, 30) + '...'
                                : party.nextFollowUp.note
                              }
                            </small>
                          )}
                          {isFollowUpOverdue(party.nextFollowUp.date) && (
                            <Badge bg="danger" className="mt-1">Overdue</Badge>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedParty(party);
                            setShowFollowUpModal(true);
                          }}
                        >
                          Schedule
                        </Button>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {/* Primary Actions - More prominent */}
                        <Link to={`/quotations/add/${party._id || party.id}`}>
                          <Button variant="success" size="sm" title="Create Quotation">
                            📄 Quote
                          </Button>
                        </Link>
                        
                        <Link to={`/parties/${party._id || party.id}`}>
                          <Button variant="info" size="sm" title="View Details">
                            👁️ View
                          </Button>
                        </Link>

                        {/* Secondary Actions Dropdown */}
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="outline-secondary" 
                            size="sm"
                            id={`dropdown-${party._id || party.id}`}
                          >
                            ⋮
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              as={Link}
                              to={`/parties/edit/${party._id || party.id}`}
                            >
                              ✏️ Edit Client
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setSelectedParty(party);
                                setShowCommentModal(true);
                              }}
                            >
                              💬 Add Note
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setSelectedParty(party);
                                setShowFollowUpModal(true);
                              }}
                            >
                              📅 Schedule Follow-up
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              as={Link}
                              to={`/quotations/add/${party._id || party.id}`}
                              className="text-success"
                            >
                              📄 Create Quotation
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Follow-up Modal */}
      <Modal show={showFollowUpModal} onHide={() => setShowFollowUpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Follow-up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedParty && (
            <div>
              <p><strong>Client:</strong> {selectedParty.name} ({selectedParty.partyId})</p>
              <Form.Group className="mb-3">
                <Form.Label>Follow-up Date</Form.Label>
                <Form.Control
                  type="date"
                  value={followUpData.date}
                  onChange={(e) => setFollowUpData(prev => ({...prev, date: e.target.value}))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Reminder Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={followUpData.note}
                  onChange={(e) => setFollowUpData(prev => ({...prev, note: e.target.value}))}
                  placeholder="What should you remember for this follow-up?"
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFollowUpModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddFollowUp}
            disabled={modalLoading}
          >
            {modalLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Scheduling...
              </>
            ) : (
              'Schedule Follow-up'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Comment Modal */}
      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedParty && (
            <div>
              <p><strong>Client:</strong> {selectedParty.name} ({selectedParty.partyId})</p>
              <Form.Group className="mb-3">
                <Form.Label>Note Type</Form.Label>
                <Form.Select
                  value={commentData.type}
                  onChange={(e) => setCommentData(prev => ({...prev, type: e.target.value}))}
                >
                  <option value="comment">General Note</option>
                  <option value="follow_up">Follow-up Note</option>
                  <option value="requirement_update">Requirement Update</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={commentData.message}
                  onChange={(e) => setCommentData(prev => ({...prev, message: e.target.value}))}
                  placeholder="Enter your note here..."
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddComment}
            disabled={modalLoading}
          >
            {modalLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Adding...
              </>
            ) : (
              'Add Note'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PartyList;