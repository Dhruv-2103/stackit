import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ 
  type = 'success', 
  message, 
  isOpen, 
  onClose, 
  duration = 3000,
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isOpen && !isVisible) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  const typeConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-[#1C1C1E]',
      borderColor: 'border-l-4 border-l-green-500',
      iconColor: 'text-green-500'
    },
    error: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bgColor: 'bg-[#1C1C1E]',
      borderColor: 'border-l-4 border-l-red-500',
      iconColor: 'text-red-500'
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: 'bg-[#1C1C1E]',
      borderColor: 'border-l-4 border-l-blue-500',
      iconColor: 'text-blue-500'
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bgColor: 'bg-[#1C1C1E]',
      borderColor: 'border-l-4 border-l-yellow-500',
      iconColor: 'text-yellow-500'
    }
  };

  const config = typeConfig[type] || typeConfig.success;
  const positionClass = positionClasses[position] || positionClasses['bottom-right'];

  return (
    <div 
      className={`fixed ${positionClass} z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div 
        className={`${config.bgColor} ${config.borderColor} rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}
      >
        <div className={`p-4 ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="py-4 pr-2 flex-1 text-white">
          {message}
        </div>
        <button 
          onClick={handleClose}
          className="p-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;