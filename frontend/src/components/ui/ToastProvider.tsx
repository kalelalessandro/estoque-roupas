import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string; iconClass: string }> = {
  success: {
    icon: CheckCircle2,
    classes: 'bg-white border-accent/20',
    iconClass: 'text-accent',
  },
  error: {
    icon: XCircle,
    classes: 'bg-white border-danger/25',
    iconClass: 'text-danger',
  },
  info: {
    icon: Info,
    classes: 'bg-white border-line',
    iconClass: 'text-ink/50',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const style = VARIANT_STYLES[t.variant];
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border ${style.classes} px-4 py-3 shadow-lift animate-slide-in-right`}
            >
              <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${style.iconClass}`} size={18} />
              <p className="flex-1 text-sm text-ink/85">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-md p-0.5 text-ink/30 transition hover:bg-sunken hover:text-ink/60"
                aria-label="Fechar notificação"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return ctx.toast;
}
