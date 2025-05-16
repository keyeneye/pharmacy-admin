import { showToast } from 'nextjs-toast-notify';

interface ToastOptions {
  duration?: number;
  progress?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  sound?: boolean;
  transition?: 'fadeIn' | 'swingInverted' | 'bounceIn' | 'popUp' | 'bottomToTopBounce' | 'bounceInDown';
}

const defaultOptions: ToastOptions = {
  duration: 3000, // Adjusted default duration
  progress: true,
  position: 'bottom-right', // Default position
  sound: false, // Defaulting to false, can be overridden
  // transition: 'bounceIn',
};

const notifySuccess = (message: string, options?: ToastOptions) => {
  showToast.success(message, { ...defaultOptions, ...options });
};

const notifyError = (message: string, options?: ToastOptions) => {
  showToast.error(message, { ...defaultOptions, ...options });
};

const notifyInfo = (message: string, options?: ToastOptions) => {
  showToast.info(message, { ...defaultOptions, ...options });
};

const notifyWarning = (message: string, options?: ToastOptions) => {
  showToast.warning(message, { ...defaultOptions, ...options });
};

export const toastService = {
  success: notifySuccess,
  error: notifyError,
  info: notifyInfo,
  warning: notifyWarning,
}; 