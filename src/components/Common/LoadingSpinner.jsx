
// src/components/Common/LoadingSpinner.js
import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...', size = 'lg', variant = 'primary' }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <Spinner animation="border" variant={variant} size={size} />
        <p className="mt-3 text-muted">{message}</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner;