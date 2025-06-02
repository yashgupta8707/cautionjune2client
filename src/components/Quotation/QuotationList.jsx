// client/src/components/Quotation/QuotationList.js - FIXED VERSION
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Card,
  Badge,
  Form,
  InputGroup,
  Spinner,
  Alert
} from "react-bootstrap";
import { quotationService } from "../../services/api";
import QuotationPDFButton from "./QuotationPDFButton";

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        console.log('🔍 Fetching quotations...');
        const response = await quotationService.getAll();
        
        console.log('📊 API Response:', response);
        console.log('📋 Response data:', response.data);
        
        // FIXED: Handle correct response structure
        let quotationsData = [];
        if (response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            // Backend returns: { success: true, data: [...] }
            quotationsData = response.data.data;
          } else if (Array.isArray(response.data)) {
            // Direct array response
            quotationsData = response.data;
          }
        }
        
        console.log('✅ Extracted quotations:', quotationsData.length, 'quotations');
        console.log('📝 First quotation sample:', quotationsData[0]);
        
        setQuotations(quotationsData);
        setError('');
      } catch (error) {
        console.error("❌ Error fetching quotations:", error);
        setError(`Failed to load quotations: ${error.message}`);
        setQuotations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: "secondary",
      sent: "primary",
      lost: "danger",
      sold: "success",
    };

    return (
      <Badge bg={statusMap[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  // FIXED: Enhanced filtering function with updated component structure
  const getFilteredQuotations = () => {
    let filtered = quotations;

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((quote) => quote.status === filter);
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();

      filtered = filtered.filter((quote) => {
        // Search in quotation title/number
        const titleMatch = quote.title?.toLowerCase().includes(searchLower);

        // Search in party/client information
        const partyNameMatch = quote.party?.name
          ?.toLowerCase()
          .includes(searchLower);
        const partyPhoneMatch = quote.party?.phone
          ?.toLowerCase()
          .includes(searchLower);
        const partyEmailMatch = quote.party?.email
          ?.toLowerCase()
          .includes(searchLower);
        const partyAddressMatch = quote.party?.address
          ?.toLowerCase()
          .includes(searchLower);
        const partyIdMatch = quote.party?.partyId
          ?.toLowerCase()
          .includes(searchLower);

        // Search in quotation ID
        const quotationIdMatch = quote._id?.toLowerCase().includes(searchLower);

        // Search in total amount (convert to string)
        const amountMatch = quote.totalAmount
          ?.toString()
          .includes(searchTerm.trim());

        // Search in version
        const versionMatch = quote.version
          ?.toString()
          .includes(searchTerm.trim());

        // Search in status
        const statusMatch = quote.status?.toLowerCase().includes(searchLower);

        // Search in notes
        const notesMatch = quote.notes?.toLowerCase().includes(searchLower);

        // Search in terms and conditions
        const termsMatch = quote.termsAndConditions
          ?.toLowerCase()
          .includes(searchLower);

        // FIXED: Search in components with updated structure (no HSN, category/brand as strings)
        let componentMatch = false;
        if (quote.components && Array.isArray(quote.components)) {
          componentMatch = quote.components.some((component) => {
            const modelNameMatch = component.model?.name
              ?.toLowerCase()
              .includes(searchLower);
            // FIXED: category and brand are now strings, not objects
            const categoryMatch = (typeof component.category === 'string' 
              ? component.category 
              : component.category?.name || '')
              ?.toLowerCase()
              .includes(searchLower);
            const brandMatch = (typeof component.brand === 'string' 
              ? component.brand 
              : component.brand?.name || '')
              ?.toLowerCase()
              .includes(searchLower);
            const warrantyMatch = component.warranty
              ?.toLowerCase()
              .includes(searchLower);

            return (
              modelNameMatch ||
              categoryMatch ||
              brandMatch ||
              warrantyMatch
            );
          });
        }

        // Search in date (format: DD/MM/YYYY)
        const dateMatch = new Date(quote.createdAt)
          .toLocaleDateString()
          .includes(searchTerm.trim());

        // Return true if any field matches
        return (
          titleMatch ||
          partyNameMatch ||
          partyPhoneMatch ||
          partyEmailMatch ||
          partyAddressMatch ||
          partyIdMatch ||
          quotationIdMatch ||
          amountMatch ||
          versionMatch ||
          statusMatch ||
          notesMatch ||
          termsMatch ||
          componentMatch ||
          dateMatch
        );
      });
    }

    return filtered;
  };

  const filteredQuotations = getFilteredQuotations();

  // Clear search function
  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading quotations...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Quotations</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Quotations ({quotations.length})</h2>
        </Col>
        <Col md={8}>
          <Row>
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search quotations by client name, phone, email, quotation #, amount, date, components, etc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    onClick={clearSearch}
                    title="Clear search"
                  >
                    ✕
                  </Button>
                )}
              </InputGroup>
              {searchTerm && (
                <small className="text-muted">
                  Showing {filteredQuotations.length} result(s) for "
                  {searchTerm}"
                </small>
              )}
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="lost">Lost</option>
                  <option value="sold">Sold</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Debug information when no quotations */}
      {quotations.length === 0 && (
        <Alert variant="info">
          <Alert.Heading>No Quotations Found</Alert.Heading>
          <p>No quotations have been created yet or there might be an issue loading them.</p>
          <p><strong>Debug Info:</strong></p>
          <ul>
            <li>Check browser console for API errors</li>
            <li>Verify backend is running on port 10000</li>
            <li>Ensure MongoDB has quotation data</li>
          </ul>
          <hr />
          <div className="d-flex justify-content-between">
            <Button variant="outline-info" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Link to="/parties">
              <Button variant="primary">Create New Quotation</Button>
            </Link>
          </div>
        </Alert>
      )}

      {/* Search suggestions when no results */}
      {searchTerm &&
        filteredQuotations.length === 0 &&
        quotations.length > 0 && (
          <Card className="mb-3 border-warning">
            <Card.Body>
              <Card.Title className="text-warning">No results found</Card.Title>
              <Card.Text>
                No quotations match your search term "
                <strong>{searchTerm}</strong>".
              </Card.Text>
              <Card.Text className="small text-muted">
                <strong>Search tips:</strong>
                <ul className="mb-0 mt-2">
                  <li>Try searching by client name, phone number, or email</li>
                  <li>Search by quotation number (e.g., "EPC/25/P0001")</li>
                  <li>Search by component names</li>
                  <li>Search by amount (e.g., "111")</li>
                  <li>Search by date or status</li>
                </ul>
              </Card.Text>
              <Button variant="outline-warning" size="sm" onClick={clearSearch}>
                Clear Search
              </Button>
            </Card.Body>
          </Card>
        )}

      {quotations.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No quotations found</Card.Title>
            <Card.Text>
              You haven't created any quotations yet. Create your first
              quotation by selecting a client.
            </Card.Text>
            <Link to="/parties">
              <Button variant="primary">View Clients</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : filteredQuotations.length === 0 && !searchTerm ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No {filter} quotations found</Card.Title>
            <Card.Text>
              There are no quotations with the {filter} status.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : filteredQuotations.length > 0 ? (
        <>
          {/* Summary row */}
          {(searchTerm || filter !== "all") && (
            <Row className="mb-3">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">
                    Showing {filteredQuotations.length} of {quotations.length}{" "}
                    quotations
                    {searchTerm && ` matching "${searchTerm}"`}
                    {filter !== "all" && ` with status: ${filter}`}
                  </span>
                  {(searchTerm || filter !== "all") && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setFilter("all");
                      }}
                    >
                      Show All
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          )}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Quote #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Version</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map((quote) => (
                <tr key={quote._id}>
                  <td>
                    <Link to={`/quotations/${quote._id}`}>
                      {/* Highlight search term in title */}
                      {searchTerm &&
                      quote.title
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: quote.title.replace(
                              new RegExp(`(${searchTerm})`, "gi"),
                              "<mark>$1</mark>"
                            ),
                          }}
                        />
                      ) : (
                        quote.title
                      )}
                    </Link>
                  </td>
                  <td>
                    {quote.party ? (
                      <Link to={`/parties/${quote.party._id}`}>
                        {/* Highlight search term in client name */}
                        {searchTerm &&
                        quote.party.name
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: quote.party.name.replace(
                                new RegExp(`(${searchTerm})`, "gi"),
                                "<mark>$1</mark>"
                              ),
                            }}
                          />
                        ) : (
                          quote.party.name
                        )}
                        <br />
                        <small className="text-muted">{quote.party.partyId}</small>
                      </Link>
                    ) : (
                      <span className="text-muted">Client data missing</span>
                    )}
                    {/* Show additional party info if it matches search */}
                    {searchTerm && quote.party && (
                      <>
                        {quote.party.phone
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) && (
                          <div className="small text-muted">
                            Phone:{" "}
                            <span
                              dangerouslySetInnerHTML={{
                                __html: quote.party.phone.replace(
                                  new RegExp(`(${searchTerm})`, "gi"),
                                  "<mark>$1</mark>"
                                ),
                              }}
                            />
                          </div>
                        )}
                        {quote.party.email
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) && (
                          <div className="small text-muted">
                            Email:{" "}
                            <span
                              dangerouslySetInnerHTML={{
                                __html: quote.party.email.replace(
                                  new RegExp(`(${searchTerm})`, "gi"),
                                  "<mark>$1</mark>"
                                ),
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </td>
                  <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                  <td>
                    {/* Highlight search term in version */}
                    {searchTerm &&
                    quote.version?.toString().includes(searchTerm) ? (
                      <mark>{quote.version}</mark>
                    ) : (
                      quote.version
                    )}
                  </td>
                  <td>
                    {/* Highlight search term in amount */}
                    {searchTerm &&
                    quote.totalAmount
                      ?.toString()
                      .includes(searchTerm.trim()) ? (
                      <span>
                        ₹
                        <span
                          dangerouslySetInnerHTML={{
                            __html: quote.totalAmount
                              .toLocaleString()
                              .replace(
                                new RegExp(`(${searchTerm.trim()})`, "gi"),
                                "<mark>$1</mark>"
                              ),
                          }}
                        />
                      </span>
                    ) : (
                      `₹${quote.totalAmount.toLocaleString()}`
                    )}
                  </td>
                  <td>
                    {/* Highlight search term in status */}
                    {searchTerm &&
                    quote.status
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ? (
                      <Badge bg={getStatusBadge(quote.status).props.bg}>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: quote.status
                              .toUpperCase()
                              .replace(
                                new RegExp(`(${searchTerm})`, "gi"),
                                "<mark>$1</mark>"
                              ),
                          }}
                        />
                      </Badge>
                    ) : (
                      getStatusBadge(quote.status)
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <QuotationPDFButton
                        quotation={quote}
                        size="sm"
                        variant="success"
                      />
                      <Link to={`/quotations/${quote._id}`}>
                        <Button variant="info" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link to={`/quotations/edit/${quote._id}`}>
                        <Button variant="warning" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link to={`/quotations/revise/${quote._id}`}>
                        <Button variant="primary" size="sm">
                          Revise
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : null}
    </Container>
  );
};

export default QuotationList;