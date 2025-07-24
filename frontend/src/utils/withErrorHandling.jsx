import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { logError, LogLevel } from './errorLogger';

// Higher-order component for error handling
const withErrorHandling = (Component, options = {}) => {
  const { redirectOnError = true } = options;
  
  return function WithErrorHandling(props) {
    const navigate = useNavigate();
    const toast = useToast();
    
    try {
      return <Component {...props} />;
    } catch (error) {
      const componentName = Component.displayName || Component.name || 'Component';
      
      // Log the error using our error logger
      logError(error, `Render error in ${componentName}`, LogLevel.ERROR, { 
        props: JSON.stringify(props, (key, value) => {
          // Avoid circular references and functions
          if (typeof value === 'function') return '[Function]';
          return value;
        }, 2)
      });
      
      // Show toast notification
      toast?.error('Something went wrong. Please try again later.');
      
      // Redirect to 404 page with error info
      if (redirectOnError) {
        navigate('/404', { state: { error } });
      }
      
      // Return null or a minimal error message if not redirecting
      return redirectOnError ? null : (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          An error occurred while rendering this component.
        </div>
      );
    }
  };
};

export default withErrorHandling;