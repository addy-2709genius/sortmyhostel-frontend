import { useState, useEffect } from 'react';
import Toast from './Toast';
import '../styles/toast.css';

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (event) => {
      const toast = event.detail;
      setToasts(prev => [...prev, toast]);
    };

    const handleHideToast = (event) => {
      const { id } = event.detail;
      setToasts(prev => prev.filter(t => t.id !== id));
    };

    window.addEventListener('showToast', handleShowToast);
    window.addEventListener('hideToast', handleHideToast);

    return () => {
      window.removeEventListener('showToast', handleShowToast);
      window.removeEventListener('hideToast', handleHideToast);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};

export default ToastProvider;




