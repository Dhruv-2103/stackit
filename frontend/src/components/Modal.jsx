import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  icon, 
  iconColor = 'text-blue-400',
  iconBgColor = 'bg-blue-500/20',
  children, 
  actions,
  maxWidth = 'max-w-md'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-[#1C1C1E] rounded-xl p-6 w-full ${maxWidth} animate-fadeIn`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
              {React.cloneElement(icon, { className: `w-5 h-5 ${iconColor}` })}
            </div>
          )}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        
        {/* Content */}
        <div className="text-[#8E8E93] mb-6">
          {children}
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {actions}
        </div>
      </div>
    </div>
  );
};

// Predefined action buttons
export const CancelButton = ({ onClick, text = "Cancel" }) => (
  <button
    onClick={onClick}
    className="flex-1 bg-[#2C2C2E] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3C3C3E] transition-colors"
  >
    {text}
  </button>
);

export const ConfirmButton = ({ 
  onClick, 
  text = "Confirm", 
  color = "blue",
  isLoading = false
}) => {
  const colorClasses = {
    blue: "bg-[#007AFF] hover:bg-[#0056CC]",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600"
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex-1 ${colorClasses[color]} text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center`}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {text}
    </button>
  );
};

export default Modal;