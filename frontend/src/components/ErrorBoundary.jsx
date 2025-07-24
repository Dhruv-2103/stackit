import React, { Component } from 'react';
import NotFound from '../pages/NotFound';
import { logError, LogLevel } from '../utils/errorLogger';

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
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error using our error logger
    logError(error, 'ErrorBoundary', LogLevel.CRITICAL, { 
      componentStack: errorInfo.componentStack,
      location: window.location.pathname
    });
    
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <NotFound error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;