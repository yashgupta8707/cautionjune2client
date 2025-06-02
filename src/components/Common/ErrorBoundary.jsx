// client/src/components/Common/ErrorBoundary.js - Fixed version
import React, { Component } from 'react';
import { Container, Card, Button } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Store error details in state
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }
    
    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    // Reset error state and refresh
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    // Reset error state and go to dashboard
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Card className="text-center p-4">
            <Card.Body>
              <div className="mb-4">
                <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
              </div>
              <Card.Title className="text-danger">Oops! Something went wrong</Card.Title>
              <Card.Text className="text-muted mb-4">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </Card.Text>
              
              {/* Only show error details in development and if error exists */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-start mb-4">
                  <summary className="btn btn-outline-secondary btn-sm mb-3">
                    Show Error Details (Development Mode)
                  </summary>
                  <div className="bg-light p-3 border rounded">
                    <h6 className="text-danger">Error:</h6>
                    <pre className="text-small mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                      {this.state.error.toString()}
                    </pre>
                    
                    {/* Only show component stack if errorInfo exists */}
                    {this.state.errorInfo && this.state.errorInfo.componentStack && (
                      <>
                        <h6 className="text-warning">Component Stack:</h6>
                        <pre className="text-small" style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </>
                    )}
                    
                    {/* Show error stack if available */}
                    {this.state.error.stack && (
                      <>
                        <h6 className="text-info mt-3">Error Stack:</h6>
                        <pre className="text-small" style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                          {this.state.error.stack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              )}
              
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Button 
                  variant="primary" 
                  onClick={this.handleRefresh}
                  className="mb-2"
                >
                  <i className="fas fa-redo me-2"></i>
                  Refresh Page
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={this.handleGoHome}
                  className="mb-2"
                >
                  <i className="fas fa-home me-2"></i>
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline-info" 
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  className="mb-2"
                >
                  <i className="fas fa-times me-2"></i>
                  Try Again
                </Button>
              </div>
              
              {/* Additional help in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-info bg-opacity-10 border border-info rounded">
                  <h6 className="text-info">Development Tips:</h6>
                  <ul className="text-start text-small mb-0">
                    <li>Check the browser console for more detailed error information</li>
                    <li>Look for any missing imports or undefined variables</li>
                    <li>Verify that all your API endpoints are working correctly</li>
                    <li>Make sure all required props are being passed to components</li>
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;