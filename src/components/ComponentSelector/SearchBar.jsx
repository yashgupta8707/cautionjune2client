// client/src/components/ComponentSelector/SearchBar.js - Fixed version
import React, { useState, useEffect, useRef } from 'react';
import { 
  Form, 
  InputGroup, 
  Button, 
  ListGroup, 
  Spinner,
  Badge,
  Alert 
} from 'react-bootstrap';
import { componentService } from '../../services/api';

const SearchBar = ({ 
  onSelect, 
  placeholder = "Search components...",
  autoFocus = false,
  className = "",
  size = "md"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Load all components on mount
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setInitialLoading(true);
        setError('');
        console.log('🔍 Loading components for search...');
        
        const response = await componentService.getAll();
        console.log('📦 Components API response:', response);
        
        // Handle different response structures
        let componentsData = [];
        if (response) {
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
        }
        
        // Ensure each component has required fields
        const validComponents = componentsData.filter(component => 
          component && 
          (component.name || component.title) && 
          (component.id || component._id)
        );
        
        setComponents(validComponents);
        console.log(`✅ Loaded ${validComponents.length} valid components for search`);
        
        if (validComponents.length === 0) {
          setError('No components found. Please add components first.');
        }
        
      } catch (error) {
        console.error('❌ Error loading components:', error);
        setError(`Failed to load components: ${error.message}`);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchComponents();
  }, []);

  // Filter components when search term changes
  useEffect(() => {
    if (searchTerm.length < 2) {
      setFilteredComponents([]);
      setShowResults(false);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = components.filter(component => {
      // Ensure component exists and has searchable fields
      if (!component) return false;
      
      const name = component.name || component.title || '';
      const category = component.category || '';
      const brand = component.brand || '';
      const description = component.description || '';
      const specifications = component.specifications || '';
      
      return (
        name.toLowerCase().includes(searchLower) ||
        category.toLowerCase().includes(searchLower) ||
        brand.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        specifications.toLowerCase().includes(searchLower)
      );
    }).slice(0, 10); // Limit to 10 results

    setFilteredComponents(filtered);
    setShowResults(filtered.length > 0 || searchTerm.length >= 2);
  }, [searchTerm, components]);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        resultsRef.current && 
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (component) => {
    console.log('📤 Component selected:', component);
    setShowResults(false);
    setSearchTerm('');
    if (onSelect) {
      onSelect(component);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false);
      setSearchTerm('');
    }
  };

  const handleInputFocus = () => {
    if (filteredComponents.length > 0 && searchTerm.length >= 2) {
      setShowResults(true);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'N/A';
    return `₹${Number(price).toLocaleString()}`;
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredComponents([]);
    setShowResults(false);
  };

  if (initialLoading) {
    return (
      <div className={`d-flex align-items-center ${className}`}>
        <Spinner size="sm" animation="border" className="me-2" />
        <span className="text-muted">Loading components...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className={className}>
        <div className="d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <Button 
            variant="outline-warning" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className={`position-relative ${className}`} ref={searchRef}>
      <InputGroup size={size}>
        <Form.Control
          type="text"
          placeholder={`${placeholder} (${components.length} available)`}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          autoFocus={autoFocus}
        />
        
        {loading && (
          <InputGroup.Text>
            <Spinner size="sm" animation="border" />
          </InputGroup.Text>
        )}
        
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

      {/* Search Results Dropdown */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="position-absolute w-100 mt-1 shadow-lg border rounded bg-white"
          style={{ zIndex: 1050, maxHeight: '400px', overflowY: 'auto' }}
        >
          {filteredComponents.length > 0 ? (
            <ListGroup variant="flush">
              {filteredComponents.map((component, index) => {
                const componentId = component.id || component._id;
                const componentName = component.name || component.title;
                
                return (
                  <ListGroup.Item
                    key={`${componentId}-${index}`}
                    action
                    onClick={() => handleSelect(component)}
                    className="py-3"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="fw-bold mb-1">
                          {componentName || 'Unnamed Component'}
                        </div>
                        <div className="d-flex flex-wrap gap-1 mb-2">
                          {component.category && (
                            <Badge bg="secondary" className="small">
                              {component.category}
                            </Badge>
                          )}
                          {component.brand && (
                            <Badge bg="info" className="small">
                              {component.brand}
                            </Badge>
                          )}
                          {component.gstRate && (
                            <Badge bg="warning" className="small">
                              GST: {component.gstRate}%
                            </Badge>
                          )}
                        </div>
                        {component.description && (
                          <small className="text-muted d-block">
                            {component.description.length > 60 
                              ? `${component.description.substring(0, 60)}...` 
                              : component.description}
                          </small>
                        )}
                      </div>
                      <div className="text-end ms-3">
                        <div className="fw-bold text-success">
                          {formatPrice(component.salesPrice)}
                        </div>
                        <small className="text-muted">
                          Cost: {formatPrice(component.purchasePrice)}
                        </small>
                        {component.warranty && (
                          <div className="small text-info">
                            {component.warranty}
                          </div>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : searchTerm.length >= 2 ? (
            <ListGroup variant="flush">
              <ListGroup.Item className="text-center text-muted py-3">
                <div className="mb-2">
                  <span style={{ fontSize: '2rem', opacity: 0.3 }}>🔍</span>
                </div>
                No components found for "{searchTerm}"
                <div className="small mt-1">
                  Try searching by name, category, brand, or description
                </div>
              </ListGroup.Item>
            </ListGroup>
          ) : null}
        </div>
      )}

      {/* Search help text */}
      {searchTerm.length >= 2 && (
        <div className="small text-muted mt-1">
          {filteredComponents.length > 0 
            ? `Found ${filteredComponents.length} component${filteredComponents.length !== 1 ? 's' : ''} matching "${searchTerm}"`
            : `No results found for "${searchTerm}" in ${components.length} components`
          }
        </div>
      )}
      
      {/* Initial help text */}
      {!searchTerm && components.length > 0 && (
        <div className="small text-muted mt-1">
          Type at least 2 characters to search through {components.length} components
        </div>
      )}
    </div>
  );
};

export default SearchBar;