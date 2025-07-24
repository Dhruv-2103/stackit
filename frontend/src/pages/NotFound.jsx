import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft, RefreshCw, Code } from 'lucide-react';
import { formatErrorForAdmin } from '../utils/errorLogger';
import useAuthStore from '../store/authStore';

const NotFound = ({ error: propError }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  
  // Get error from props or location state
  const error = propError || location.state?.error;

  // Format error details for admin view
  const getErrorDetails = () => {
    if (!error) return { message: 'Unknown error', stack: null };
    
    const formattedError = formatErrorForAdmin(error);
    
    return {
      message: formattedError.message,
      stack: formattedError.formattedStack.map((item, index) => {
        if (item.raw) {
          return (
            <div key={index} className="text-[#8E8E93] text-sm font-mono">
              {item.raw}
            </div>
          );
        }
        
        return (
          <div key={index} className="text-[#8E8E93] text-sm font-mono flex items-start gap-2">
            <span className="text-[#FF9F0A]">{item.function}</span>
            <span className="text-[#5AC8FA]">
              {item.file}:{item.line}:{item.column}
            </span>
          </div>
        );
      })
    };
  };
  
  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4">
      <div className="bg-[#1C1C1E] rounded-xl p-6 md:p-8 max-w-2xl w-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Page Not Found</h1>
            <p className="text-[#8E8E93]">The page you're looking for doesn't exist or has been moved.</p>
          </div>
        </div>

        {/* Admin Error Details */}
        {isAdmin && error && (
          <div className="mb-6">
            <div className="bg-[#2C2C2E] rounded-lg p-4 mb-4 border border-[#3A3A3C]">
              <h2 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Code className="w-4 h-4 text-red-400" />
                Error Details (Admin Only)
              </h2>
              <div className="text-red-400 font-medium mb-2">{errorDetails.message}</div>
              <div className="bg-[#1C1C1E] rounded-lg p-3 overflow-x-auto">
                {errorDetails.stack}
              </div>
              
              {/* Additional debug info */}
              <div className="mt-4 pt-4 border-t border-[#3A3A3C]">
                <h3 className="text-white text-sm font-medium mb-2">Debug Information</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-[#8E8E93]">URL Path:</div>
                  <div className="text-white font-mono">{location.pathname}</div>
                  
                  <div className="text-[#8E8E93]">Timestamp:</div>
                  <div className="text-white font-mono">{new Date().toISOString()}</div>
                  
                  <div className="text-[#8E8E93]">Browser:</div>
                  <div className="text-white font-mono truncate">{navigator.userAgent}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-[#2C2C2E] hover:bg-[#3C3C3E] text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex-1 bg-[#2C2C2E] hover:bg-[#3C3C3E] text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 no-underline"
          >
            <Home className="w-4 h-4" />
            Home Page
          </Link>
          {error && (
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-[#007AFF] hover:bg-[#0056CC] text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;