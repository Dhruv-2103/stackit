import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      message,
      type: options.type || 'success',
      duration: options.duration || 3000,
      position: options.position || 'bottom-right'
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'success' });
  }, [showToast]);

  const error = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'error' });
  }, [showToast]);

  const info = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'info' });
  }, [showToast]);

  const warning = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'warning' });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, success, error, info, warning }}>
      {children}
      
      {/* Render all active toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          isOpen={true}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          position={toast.position}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider;