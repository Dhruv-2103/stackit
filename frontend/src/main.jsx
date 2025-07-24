import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/ToastProvider'
import ErrorBoundary from './components/ErrorBoundary'
import { logError, LogLevel } from './utils/errorLogger'

// Global error handler for uncaught errors
window.onerror = (message, source, lineno, colno, error) => {
  logError(
    error || new Error(message),
    'Global error handler',
    LogLevel.CRITICAL,
    { source, lineno, colno }
  );
  return false; // Let the default handler run as well
};

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logError(
    event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
    'Unhandled promise rejection',
    LogLevel.CRITICAL
  );
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
