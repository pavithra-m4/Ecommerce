import React, { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-start gap-3 p-4 bg-[#1C1A17] text-[#FAF9F5] rounded-none shadow-xl border-l-2 border-[#D4AF37] animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="mt-0.5 text-[#D4AF37] shrink-0">
        {toast.type === 'info' ? (
          <Info className="w-4 h-4" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold tracking-wide uppercase">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-[#C8C4B7] mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#8E8A80] hover:text-[#FAF9F5] transition-colors p-1"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
