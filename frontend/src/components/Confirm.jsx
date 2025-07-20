import React from 'react';
import Modal, { CancelButton, ConfirmButton } from './Modal';
import { AlertTriangle, Trash2, Ban, Info } from 'lucide-react';

const Confirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info', // 'info', 'delete', 'warning', 'ban'
  isLoading = false
}) => {
  const typeConfig = {
    info: {
      icon: <Info />,
      iconColor: 'text-blue-400',
      iconBgColor: 'bg-blue-500/20',
      confirmColor: 'blue'
    },
    delete: {
      icon: <Trash2 />,
      iconColor: 'text-red-400',
      iconBgColor: 'bg-red-500/20',
      confirmColor: 'red'
    },
    warning: {
      icon: <AlertTriangle />,
      iconColor: 'text-yellow-400',
      iconBgColor: 'bg-yellow-500/20',
      confirmColor: 'yellow'
    },
    ban: {
      icon: <Ban />,
      iconColor: 'text-yellow-400',
      iconBgColor: 'bg-yellow-500/20',
      confirmColor: 'yellow'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={config.icon}
      iconColor={config.iconColor}
      iconBgColor={config.iconBgColor}
      actions={
        <>
          <CancelButton onClick={onClose} text={cancelText} />
          <ConfirmButton 
            onClick={onConfirm} 
            text={confirmText} 
            color={config.confirmColor}
            isLoading={isLoading}
          />
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
};

export default Confirm;