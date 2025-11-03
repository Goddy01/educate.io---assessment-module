'use client';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type ToastCallback = (toast: Toast) => void;

class ToastManager {
  private listeners: ToastCallback[] = [];
  private toasts: Toast[] = [];

  subscribe(callback: ToastCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify(toast: Toast) {
    this.toasts.push(toast);
    this.listeners.forEach((cb) => cb(toast));
  }

  show(message: string, type: ToastType = 'info') {
    const id = `toast-${Date.now()}-${Math.random()}`;
    this.notify({ id, message, type });
    return id;
  }

  success(message: string) {
    return this.show(message, 'success');
  }

  error(message: string) {
    return this.show(message, 'error');
  }

  warning(message: string) {
    return this.show(message, 'warning');
  }

  info(message: string) {
    return this.show(message, 'info');
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  getToasts() {
    return this.toasts;
  }
}

export const toastManager = new ToastManager();
export const toast = {
  show: (message: string, type?: ToastType) => toastManager.show(message, type),
  success: (message: string) => toastManager.success(message),
  error: (message: string) => toastManager.error(message),
  warning: (message: string) => toastManager.warning(message),
  info: (message: string) => toastManager.info(message),
};

