import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  message, 
  isOpen, 
  onClose, 
  autoClose = true,
  autoCloseTime = 5000
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    
    let timer;
    if (isOpen && autoClose) {
      timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoClose, autoCloseTime]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isOpen && !isVisible) return null;

  const alertConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-400',
      iconColor: 'text-green-400'
    },
    error: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-400',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      textColor: 'text-yellow-400',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-400',
      iconColor: 'text-blue-400'
    }
  };

  const config = alertConfig[type] || alertConfig.info;

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      <div 
        className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 shadow-lg flex items-center gap-3 max-w-md`}
      >
        <div className={config.iconColor}>
          {config.icon}
        </div>
        <div className={`${config.textColor} flex-1`}>
          {message}
        </div>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Alert;