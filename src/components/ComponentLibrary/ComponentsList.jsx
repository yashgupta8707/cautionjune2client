// client/src/components/ComponentLibrary/ComponentsList.js - Simplified version
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  Alert,
  Spinner,
  Badge
} from 'react-bootstrap';
import { componentService } from '../../services/api';

const ComponentsList = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newComponent, setNewComponent] = useState({
    name: '',
    category: '',
    brand: '',
    hsn: '',
    warranty: '',
    purchasePrice: '',
    salesPrice: '',
    gstRate: '18',
    description: '',
    specifications: ''
  });

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Fetching components...');
      const response = await componentService.getAll();
      console.log('✅ Components response:', response);
      
      // Handle different response structures
      let componentsData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          componentsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          componentsData = response.data.data;
        } else if (response.data.components && Array.isArray(response.data.components)) {
          componentsData = response.data.components;
        }
      } else if (Array.isArray(response)) {
        componentsData = response;
      }
      
      setComponents(componentsData);
      console.log(`📦 Loaded ${componentsData.length} components`);
      
    } catch (error) {
      console.error('❌ Error fetching components:', error);
      setError(`Failed to load components: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComponent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddComponent = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newComponent.name.trim() || !newComponent.category.trim() || !newComponent.brand.trim()) {
      alert('Please fill in all required fields (Name, Category, Brand)');
      return;
    }
    
    try {
      setFormLoading(true);
      
      // Format the component data
      const formattedComponent = {
        ...newComponent,
        name: newComponent.name.trim(),
        category: newComponent.category.trim(),
        brand: newComponent.brand.trim(),
        hsn: newComponent.hsn.trim(),
        warranty: newComponent.warranty.trim(),
        description: newComponent.description.trim(),
        specifications: newComponent.specifications.trim(),
        purchasePrice: parseFloat(newComponent.purchasePrice) || 0,
        salesPrice: parseFloat(newComponent.salesPrice) || 0,
        gstRate: parseFloat(newComponent.gstRate) || 18
      };
      
      console.log('📤 Creating component:', formattedComponent);
      
      const response = await componentService.create(formattedComponent);
      const createdComponent = response.data || response;
      
      console.log('✅ Component created:', createdComponent);
      
      // Add to local state
      setComponents(prev => [createdComponent, ...prev]);
      
      // Reset form
      setNewComponent({
        name: '',
        category: '',
        brand: '',
        hsn: '',
        warranty: '',
        purchasePrice: '',
        salesPrice: '',
        gstRate: '18',
        description: '',
        specifications: ''
      });
      
      setShowAddForm(false);
      
    } catch (error) {
      console.error('❌ Error creating component:', error);
      alert(`Failed to add component: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteComponent = async (componentId) => {
    if (!window.confirm('Are you sure you want to delete this component?')) {
      return;
    }

    try {
      await componentService.delete(componentId);
      setComponents(prev => prev.filter(c => c.id !== componentId && c._id !== componentId));
      console.log('✅ Component deleted');
    } catch (error) {
      console.error('❌ Error deleting component:', error);
      alert(`Failed to delete component: ${error.message}`);
    }
  };

  // Get unique categories and brands from components for filter dropdowns
  const uniqueCategories = [...new Set(components.map(c => c.category).filter(Boolean))];
  const uniqueBrands = [...new Set(components.map(c => c.brand).filter(Boolean))];

  // Filter components based on search and filters
  const filteredComponents = components.filter(component => {
    const matchesSearch = searchTerm === '' || 
      component.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.hsn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === '' || component.category === categoryFilter;
    const matchesBrand = brandFilter === '' || component.brand === brandFilter;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading components...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2>Component Library</h2>
          <p className="text-muted">
            Manage your product components, pricing, and specifications
          </p>
        </Col>
        <Col className="text-end">
          <Button 
            variant="primary" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add New Component'}
          </Button>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Add Component Form */}
      {showAddForm && (
        <Card className="mb-4">
          <Card.Header>
            <h5>Add New Component</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleAddComponent}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Component Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={newComponent.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter component name"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={newComponent.category}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Electronics, Hardware, Software"
                      list="categories"
                    />
                    <datalist id="categories">
                      {uniqueCategories.map(category => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Brand *</Form.Label>
                    <Form.Control
                      type="text"
                      name="brand"
                      value={newComponent.brand}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Samsung, Intel, Generic"
                      list="brands"
                    />
                    <datalist id="brands">
                      {uniqueBrands.map(brand => (
                        <option key={brand} value={brand} />
                      ))}
                    </datalist>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>HSN Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="hsn"
                      value={newComponent.hsn}
                      onChange={handleInputChange}
                      placeholder="Enter HSN code"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={newComponent.description}
                      onChange={handleInputChange}
                      placeholder="Enter component description"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Warranty</Form.Label>
                    <Form.Control
                      type="text"
                      name="warranty"
                      value={newComponent.warranty}
                      onChange={handleInputChange}
                      placeholder="e.g., 1 Year, 6 Months"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Purchase Price (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      name="purchasePrice"
                      value={newComponent.purchasePrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Sales Price (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      name="salesPrice"
                      value={newComponent.salesPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>GST Rate (%)</Form.Label>
                    <Form.Select
                      name="gstRate"
                      value={newComponent.gstRate}
                      onChange={handleInputChange}
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Specifications</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="specifications"
                      value={newComponent.specifications}
                      onChange={handleInputChange}
                      placeholder="Enter technical specifications"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-end">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowAddForm(false)} 
                  className="me-2"
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Adding...
                    </>
                  ) : (
                    'Add Component'
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="mb-4">
        <Card.Header>
          <h5>🔍 Search & Filter</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by name, HSN, description, category, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                >
                  <option value="">All Brands</option>
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          {(searchTerm || categoryFilter || brandFilter) && (
            <div className="mt-3">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setBrandFilter('');
                }}
              >
                Clear Filters
              </Button>
              <span className="ms-3 text-muted">
                Showing {filteredComponents.length} of {components.length} components
              </span>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Components Table */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Components ({filteredComponents.length})</h5>
            {components.length > 0 && (
              <Badge bg="success">
                Total Value: ₹{components.reduce((sum, c) => sum + (c.salesPrice || 0), 0).toLocaleString()}
              </Badge>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          {filteredComponents.length === 0 ? (
            <div className="text-center p-4">
              {components.length === 0 ? (
                <div>
                  <div className="mb-3">
                    <span style={{ fontSize: '3rem', opacity: 0.3 }}>📦</span>
                  </div>
                  <h5>No Components Yet</h5>
                  <p className="text-muted">Add your first component to get started with your library.</p>
                  <Button variant="primary" onClick={() => setShowAddForm(true)}>
                    Add First Component
                  </Button>
                </div>
              ) : (
                <div>
                  <h5>No Components Match Your Filters</h5>
                  <p className="text-muted">Try adjusting your search criteria or clear filters.</p>
                  <Button 
                    variant="outline-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('');
                      setBrandFilter('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Category</th>
                    <th>Brand</th>
                    {/* <th>HSN</th> */}
                    <th>Warranty</th>
                    <th>Purchase Price</th>
                    <th>Sales Price</th>
                    <th>Margin</th>
                    {/* <th>GST</th>
                    <th>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredComponents.map(component => {
                    const purchasePrice = component.purchasePrice || 0;
                    const salesPrice = component.salesPrice || 0;
                    const margin = salesPrice - purchasePrice;
                    const marginPercent = purchasePrice > 0 ? (margin / purchasePrice * 100) : 0;
                    
                    return (
                      <tr key={component.id || component._id}>
                        <td>
                          <div>
                            <strong>{component.name || 'Unnamed Component'}</strong>
                            {component.description && (
                              <div className="small text-muted">{component.description}</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary" className="me-1">
                            {component.category || 'N/A'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="info" className="me-1">
                            {component.brand || 'N/A'}
                          </Badge>
                        </td>
                        {/* <td>{component.hsn || '-'}</td> */}
                        <td>{component.warranty || '-'}</td>
                        <td>₹{purchasePrice.toLocaleString()}</td>
                        <td>₹{salesPrice.toLocaleString()}</td>
                        <td>
                          {margin > 0 ? (
                            <span className="text-success">
                              ₹{margin.toLocaleString()} ({marginPercent.toFixed(1)}%)
                            </span>
                          ) : margin < 0 ? (
                            <span className="text-danger">
                              ₹{margin.toLocaleString()} ({marginPercent.toFixed(1)}%)
                            </span>
                          ) : '-'}
                        </td>
                        {/* <td>
                          <Badge bg="info">{component.gstRate || 18}%</Badge>
                        </td> */}
                        {/* <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteComponent(component.id || component._id)}
                            title="Delete component"
                          >
                            🗑️
                          </Button>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ComponentsList;