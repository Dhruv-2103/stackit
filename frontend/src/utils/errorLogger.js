/**
 * Error logging utility
 * This can be expanded to send errors to a backend service or third-party error tracking
 */

// Log levels
export const LogLevel = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
};

/**
 * Log an error with context
 * @param {Error} error - The error object
 * @param {string} context - Where the error occurred
 * @param {string} level - Error severity level
 * @param {Object} additionalData - Any additional data to log
 */
export const logError = (error, context, level = LogLevel.ERROR, additionalData = {}) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    context,
    level,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...additionalData,
  };

  // Log to console in development
  console.error(`[${level.toUpperCase()}] ${context}:`, error, additionalData);

  // In production, you could send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to backend API
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData),
    // }).catch(e => console.error('Failed to log error:', e));

    // Example: Send to third-party service like Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     extra: { context, ...additionalData },
    //     level,
    //   });
    // }
  }

  return errorData;
};

/**
 * Format error for display to admin users
 * @param {Error} error - The error object
 * @returns {Object} Formatted error data
 */
export const formatErrorForAdmin = (error) => {
  if (!error) return { message: 'Unknown error', formattedStack: [] };

  // Extract useful information from the error
  const formattedStack = error.stack
    ? error.stack.split('\n').map(line => {
        // Extract file, line, and column information
        const match = line.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
        if (match) {
          const [, fnName, file, line, col] = match;
          return {
            function: fnName.trim(),
            file: file.split('/').pop(), // Just the filename
            fullPath: file,
            line: parseInt(line, 10),
            column: parseInt(col, 10),
          };
        }
        return { raw: line.trim() };
      })
    : [];

  return {
    message: error.message || 'An error occurred',
    name: error.name,
    formattedStack,
    rawStack: error.stack,
  };
};

export default {
  logError,
  formatErrorForAdmin,
  LogLevel,
};