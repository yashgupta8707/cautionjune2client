// client/src/components/Quotation/QuotationDetail.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Card,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';
import { quotationService } from '../../services/api';
import QuotationPDFButton from './QuotationPDFButton';

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        console.log('🔍 Fetching quotation details for ID:', id);
        setLoading(true);
        setError('');
        
        const response = await quotationService.getById(id);
        console.log('📊 Raw API Response:', response);
        
        // FIXED: Handle different response structures
        let quotationData = null;
        if (response.data) {
          if (response.data.data) {
            quotationData = response.data.data;
          } else if (response.data._id) {
            quotationData = response.data;
          }
        }
        
        console.log('✅ Extracted quotation data:', quotationData);
        
        if (!quotationData) {
          throw new Error('Quotation data not found in response');
        }
        
        // SAFETY: Ensure components array exists
        if (!quotationData.components) {
          quotationData.components = [];
          console.log('⚠️ Components array missing, set to empty array');
        }
        
        setQuotation(quotationData);
      } catch (error) {
        console.error('❌ Error fetching quotation:', error);
        setError(`Failed to load quotation: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuotation();
    } else {
      setError('No quotation ID provided');
      setLoading(false);
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const statusColors = {
      draft: 'secondary',
      sent: 'primary', 
      lost: 'danger',
      sold: 'success'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status?.toUpperCase()}</Badge>;
  };

  const calculateProfitMargin = () => {
    if (!quotation || quotation.totalPurchase === 0) return 0;
    return (((quotation.totalAmount - quotation.totalPurchase) / quotation.totalPurchase) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading quotation details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Quotation</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-between">
            <Button variant="outline-danger" onClick={() => navigate('/quotations')}>
              Back to Quotations
            </Button>
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!quotation) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>Quotation Not Found</Alert.Heading>
          <p>The requested quotation could not be found.</p>
          <hr />
          <Button variant="outline-warning" onClick={() => navigate('/quotations')}>
            Back to Quotations
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>{quotation.title || 'Quotation Details'}</h2>
              <p className="text-muted mb-0">
                Created: {new Date(quotation.createdAt).toLocaleDateString()} | 
                Version: {quotation.version} | 
                Status: {getStatusBadge(quotation.status)}
              </p>
            </div>
            <div className="d-flex gap-2">
              <QuotationPDFButton quotation={quotation} />
              <Link to={`/quotations/edit/${quotation._id}`}>
                <Button variant="warning">Edit</Button>
              </Link>
              <Link to={`/quotations/revise/${quotation._id}`}>
                <Button variant="primary">Create Revision</Button>
              </Link>
              <Button variant="secondary" onClick={() => navigate('/quotations')}>
                Back to List
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Client Information */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Client Information</h5>
        </Card.Header>
        <Card.Body>
          {quotation.party ? (
            <Row>
              <Col md={6}>
                <p><strong>Name:</strong> {quotation.party.name}</p>
                <p><strong>Party ID:</strong> {quotation.party.partyId}</p>
                <p><strong>Phone:</strong> {quotation.party.phone}</p>
              </Col>
              <Col md={6}>
                <p><strong>Email:</strong> {quotation.party.email || '-'}</p>
                <p><strong>Address:</strong> {quotation.party.address}</p>
              </Col>
            </Row>
          ) : (
            <Alert variant="warning">Client information not available</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Components */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Components ({Array.isArray(quotation.components) ? quotation.components.length : 0})</h5>
        </Card.Header>
        <Card.Body>
          {Array.isArray(quotation.components) && quotation.components.length > 0 ? (
            <Table responsive striped bordered>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Warranty</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Sales Price</th>
                  <th>GST Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {quotation.components.map((component, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{component.model?.name || 'Unknown Component'}</strong>
                    </td>
                    <td>
                      <Badge bg="secondary">
                        {typeof component.category === 'string' 
                          ? component.category 
                          : component.category?.name || 'Unknown'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="info">
                        {typeof component.brand === 'string' 
                          ? component.brand 
                          : component.brand?.name || 'Unknown'}
                      </Badge>
                    </td>
                    <td>{component.warranty || '-'}</td>
                    <td>{component.quantity || 0}</td>
                    <td>₹{(component.purchasePrice || 0).toLocaleString()}</td>
                    <td>₹{(component.salesPrice || 0).toLocaleString()}</td>
                    <td>{component.gstRate || 0}%</td>
                    <td>
                      <strong>₹{((component.salesPrice || 0) * (component.quantity || 0)).toLocaleString()}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-warning">
                  <th colSpan="8" className="text-end">Total Amount:</th>
                  <th>₹{(quotation.totalAmount || 0).toLocaleString()}</th>
                </tr>
              </tfoot>
            </Table>
          ) : (
            <Alert variant="info">
              No components found for this quotation.
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Financial Summary */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Financial Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Purchase:</span>
                <strong>₹{(quotation.totalPurchase || 0).toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Sales:</span>
                <strong>₹{(quotation.totalAmount || 0).toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Tax:</span>
                <strong>₹{(quotation.totalTax || 0).toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Gross Profit:</span>
                <strong className="text-success">
                  ₹{((quotation.totalAmount || 0) - (quotation.totalPurchase || 0)).toLocaleString()}
                </strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Profit Margin:</span>
                <strong className="text-success">{calculateProfitMargin()}%</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Additional Information</h5>
            </Card.Header>
            <Card.Body>
              {quotation.notes && (
                <div className="mb-3">
                  <strong>Notes:</strong>
                  <p className="mt-1">{quotation.notes}</p>
                </div>
              )}
              {quotation.termsAndConditions && (
                <div>
                  <strong>Terms & Conditions:</strong>
                  <pre className="mt-1 small text-muted">{quotation.termsAndConditions}</pre>
                </div>
              )}
              {!quotation.notes && !quotation.termsAndConditions && (
                <p className="text-muted">No additional information provided.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Version History */}
      {quotation.originalQuote && (
        <Card className="mb-4">
          <Card.Header>
            <h5>Version History</h5>
          </Card.Header>
          <Card.Body>
            <p className="text-muted">
              This is version {quotation.version} of the quotation.
              {quotation.originalQuote && (
                <span> Original quotation: {quotation.originalQuote.title}</span>
              )}
            </p>
          </Card.Body>
        </Card>
      )}

      {/* Debug Information (Development Only) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <Card className="mb-4 border-info">
          <Card.Header>
            <h6 className="text-info">Debug Information (Development Only)</h6>
          </Card.Header>
          <Card.Body>
            <pre className="small text-muted">
              {JSON.stringify(quotation, null, 2)}
            </pre>
          </Card.Body>
        </Card>
      )} */}
    </Container>
  );
};

export default QuotationDetail;