import { showToast } from 'nextjs-toast-notify';

// Using 'any' for options type as ToastOptions might not be directly exportable
// or its exact structure is not critical for this wrapper.
const defaultOptions: any = {
  duration: 3000, // Adjusted default duration
  progress: true,
  position: 'bottom-right', // Default position
  sound: false, // Defaulting to false, can be overridden
  // transition: 'bounceIn', // Example, add if you have a preferred default
};

const notifySuccess = (message: string, options?: any) => {
  showToast.success(message, { ...defaultOptions, ...options });
};

const notifyError = (message: string, options?: any) => {
  showToast.error(message, { ...defaultOptions, ...options });
};

const notifyInfo = (message: string, options?: any) => {
  showToast.info(message, { ...defaultOptions, ...options });
};

const notifyWarning = (message: string, options?: any) => {
  showToast.warning(message, { ...defaultOptions, ...options });
};

export const toastService = {
  success: notifySuccess,
  error: notifyError,
  info: notifyInfo,
  warning: notifyWarning,
}; 