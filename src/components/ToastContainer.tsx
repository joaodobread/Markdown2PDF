import { AlertTriangle, X } from 'lucide-react';
import type { Toast } from '../types';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="toast-container no-print">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast${toast.exiting ? ' toast--exit' : ''}`}
        >
          <AlertTriangle size={16} className="toast-icon" />
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Fechar notificação"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
