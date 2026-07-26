import { AlertTriangle, HelpCircle } from 'lucide-react';
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
}

type ConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(value: boolean) => void>();

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  function handle(result: boolean) {
    setOptions(null);
    resolver.current?.(result);
  }

  const isDanger = options?.variant === 'danger';

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 px-4 backdrop-blur-[2px] animate-fade-in"
          onClick={() => handle(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-sm animate-scale-in rounded-2xl border border-line-soft bg-surface p-6 shadow-lift"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${
                isDanger ? 'bg-danger-soft text-danger' : 'bg-accent-soft text-accent'
              }`}
            >
              {isDanger ? <AlertTriangle size={20} /> : <HelpCircle size={20} />}
            </div>
            <h2 id="confirm-title" className="font-display text-lg font-semibold text-ink">
              {options.title}
            </h2>
            {options.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{options.description}</p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => handle(false)}>
                {options.cancelLabel ?? 'Cancelar'}
              </button>
              <button
                className={isDanger ? 'btn-danger !px-4 !py-2.5 !text-sm' : 'btn-primary'}
                onClick={() => handle(true)}
                autoFocus
              >
                {options.confirmLabel ?? 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm deve ser usado dentro de ConfirmProvider');
  return ctx;
}
