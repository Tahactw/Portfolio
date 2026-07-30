import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface Toast {
  id: number;
  kind: 'ok' | 'error';
  text: string;
  linkHref?: string;
  linkLabel?: string;
}

interface ToastValue {
  toast: (t: Omit<Toast, 'id'>) => void;
}

const Ctx = createContext<ToastValue | null>(null);

export function useToast(): ToastValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useToast outside provider');
  return v;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = nextId.current++;
    setToasts((all) => [...all, { ...t, id }]);
    window.setTimeout(
      () => setToasts((all) => all.filter((x) => x.id !== id)),
      t.kind === 'error' ? 9000 : 6000,
    );
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-96 z-50 space-y-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`border rounded bg-panel p-4 shadow-lg ${
              t.kind === 'error' ? 'border-accent' : 'border-line-strong'
            }`}
          >
            <p className="text-[0.9rem]">{t.text}</p>
            {t.linkHref && (
              <a
                href={t.linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-[0.75rem] text-accent-text hover:underline underline-offset-4 inline-block mt-2"
              >
                {t.linkLabel ?? 'Open'} ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
