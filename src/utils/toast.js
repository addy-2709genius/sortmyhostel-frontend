// Toast utility for managing toast notifications
let toastContainer = null;
let toastQueue = [];

export const showToast = (message, type = 'success', duration = 3000) => {
  const toast = { message, type, duration, id: Date.now() };
  
  if (!toastContainer) {
    // Create toast container if it doesn't exist
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position: fixed; top: 1rem; right: 1rem; z-index: 10000; display: flex; flex-direction: column; gap: 0.5rem;';
    document.body.appendChild(toastContainer);
  }
  
  // Add to queue
  toastQueue.push(toast);
  
  // Dispatch custom event for React components
  window.dispatchEvent(new CustomEvent('showToast', { detail: toast }));
  
  return toast.id;
};

export const hideToast = (id) => {
  toastQueue = toastQueue.filter(t => t.id !== id);
  window.dispatchEvent(new CustomEvent('hideToast', { detail: { id } }));
};




