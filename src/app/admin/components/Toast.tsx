"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastKind = "success" | "error" | "info" | "warning";

type ToastInternal = {
  id: number;
  kind: ToastKind;
  message: string;
  leaving: boolean;
};

type ToastContextValue = {
  toast: (message: string, kind?: ToastKind) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 3000;
const LEAVE_ANIMATION_MS = 180;

const ICONS: Record<ToastKind, string> = {
  success: "✓",
  error: "!",
  info: "i",
  warning: "!",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);
  const counterRef = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    }, LEAVE_ANIMATION_MS);
  }, []);

  const push = useCallback(
    (message: string, kind: ToastKind = "info") => {
      counterRef.current += 1;
      const id = counterRef.current;
      setToasts((prev) => {
        const next = [...prev, { id, kind, message, leaving: false }];
        // Cap to MAX_TOASTS — drop oldest
        return next.slice(-MAX_TOASTS);
      });
      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      timersRef.current.set(id, timer);
    },
    [dismiss],
  );

  // Cleanup on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: push,
      success: (m) => push(m, "success"),
      error: (m) => push(m, "error"),
      info: (m) => push(m, "info"),
      warning: (m) => push(m, "warning"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="em-toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`em-toast is-${t.kind}${t.leaving ? " is-leaving" : ""}`}
            role={t.kind === "error" ? "alert" : "status"}
          >
            <span className="em-toast-icon" aria-hidden>
              {ICONS[t.kind]}
            </span>
            <span className="em-toast-msg">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="em-toast-close"
              aria-label="Sluit melding"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}
