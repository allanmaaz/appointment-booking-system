import toast from 'react-hot-toast';

const toastConfig = {
  duration: 4000,
  style: {
    background: 'rgba(30, 41, 59, 0.95)',
    color: '#fff',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '12px',
    backdropFilter: 'blur(16px)',
    fontSize: '14px',
    fontWeight: '500',
  },
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
  loading: {
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#fff',
    },
  },
};

export const showToast = {
  success: (message) => toast.success(message, toastConfig),
  error: (message) => toast.error(message, toastConfig),
  loading: (message) => toast.loading(message, toastConfig),
  promise: (promise, messages) =>
    toast.promise(promise, messages, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        maxWidth: '350px',
      },
    }),
  custom: (message, options = {}) =>
    toast(message, { ...toastConfig, ...options }),
};

export default showToast;