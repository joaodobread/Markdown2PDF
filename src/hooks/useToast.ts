import { useCallback, useState } from 'react';
import type { Toast } from '../types';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback(
    (message: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => {
        if (prev.some((t) => t.message === message)) return prev;
        return [...prev, { id, message, exiting: false }];
      });
      setTimeout(() => dismissToast(id), 5000);
    },
    [dismissToast],
  );

  return { toasts, addToast, dismissToast };
}
