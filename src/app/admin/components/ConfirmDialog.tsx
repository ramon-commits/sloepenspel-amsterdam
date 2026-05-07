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

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type Pending = {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
};

type ConfirmContextValue = {
  /** Returns true if the user confirms, false if they cancel/escape. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(
    (result: boolean) => {
      if (!pending) return;
      pending.resolve(result);
      setPending(null);
    },
    [pending],
  );

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setPending({ options, resolve });
      }),
    [],
  );

  // Focus trap + escape handling
  useEffect(() => {
    if (!pending) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Focus the confirm button by default
    const dialog = dialogRef.current;
    if (dialog) {
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const last = focusables[focusables.length - 1];
      last?.focus();
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close(false);
        return;
      }
      if (e.key === "Tab" && dialog) {
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [pending, close]);

  const value = useMemo<ConfirmContextValue>(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {pending && (
        <div
          className="em-modal-backdrop"
          onClick={() => close(false)}
          role="presentation"
        >
          <div
            ref={dialogRef}
            className="em-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="em-modal-title"
            aria-describedby={
              pending.options.description ? "em-modal-desc" : undefined
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div id="em-modal-title" className="em-modal-title">
              {pending.options.title}
            </div>
            {pending.options.description && (
              <div id="em-modal-desc" className="em-modal-desc">
                {pending.options.description}
              </div>
            )}
            <div className="em-modal-actions">
              <button
                type="button"
                className="em-btn em-btn-secondary"
                onClick={() => close(false)}
              >
                {pending.options.cancelLabel ?? "Annuleer"}
              </button>
              <button
                type="button"
                className={
                  pending.options.destructive
                    ? "em-btn em-btn-danger"
                    : "em-btn em-btn-primary"
                }
                onClick={() => close(true)}
                autoFocus
              >
                {pending.options.confirmLabel ?? "Bevestig"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue["confirm"] {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within <ConfirmProvider>");
  }
  return ctx.confirm;
}
