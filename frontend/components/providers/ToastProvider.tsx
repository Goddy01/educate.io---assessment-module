'use client';

import { useState, useEffect } from 'react';
import { ToastContainer } from '@/components/ui/Toast';
import { toastManager } from '@/lib/toast';
import type { ToastType } from '@/components/ui/Toast';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((toast) => {
      setToasts((prev) => [...prev, toast]);
    });

    return unsubscribe;
  }, []);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    toastManager.remove(id);
  };

  return (
    <>
      {children}
      {toasts.length > 0 && <ToastContainer toasts={toasts} onClose={handleClose} />}
    </>
  );
}

