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

/**
 * Tracks how many editors are currently in "edit mode with dirty
 * changes". Each TextFieldEditor registers itself when it goes from
 * dirty=false → dirty=true, unregisters when it saves or cancels.
 *
 * Effects:
 *   - Renders a small "Niet opgeslagen wijzigingen" banner.
 *   - Installs a beforeunload guard so closing the tab prompts.
 *   - Exposes `confirmDiscard()` for navigation handlers (sidebar
 *     selects, logout) to call before throwing away dirty edits.
 */

type UnsavedContextValue = {
  /** How many editors are dirty right now. */
  count: number;
  /** Mark an editor dirty (returns a release function). */
  register: (id: string) => () => void;
  /** Imperatively force-clear (used after batch save). */
  clearAll: () => void;
  /** Returns true when it's safe to navigate (no dirty edits OR user
   *  confirms discard). */
  confirmDiscard: () => Promise<boolean>;
};

const UnsavedContext = createContext<UnsavedContextValue | null>(null);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  // Use a Set inside a ref so registrations don't trigger re-renders;
  // the count state is what re-renders consumers.
  const dirtyRef = useRef<Set<string>>(new Set());
  const [count, setCount] = useState(0);

  const register = useCallback((id: string) => {
    dirtyRef.current.add(id);
    setCount(dirtyRef.current.size);
    return () => {
      dirtyRef.current.delete(id);
      setCount(dirtyRef.current.size);
    };
  }, []);

  const clearAll = useCallback(() => {
    dirtyRef.current.clear();
    setCount(0);
  }, []);

  const confirmDiscard = useCallback(async () => {
    if (dirtyRef.current.size === 0) return true;
    // Use the native confirm — keeps focus correct, accessible by default.
    const ok = window.confirm(
      `Je hebt ${dirtyRef.current.size} niet-opgeslagen wijziging${
        dirtyRef.current.size === 1 ? "" : "en"
      }. Verwerp en doorgaan?`,
    );
    return ok;
  }, []);

  // beforeunload guard
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current.size === 0) return;
      e.preventDefault();
      // Modern browsers ignore the message; the dialog is hard-coded.
      // Returning a string is still required for older Safari.
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const value = useMemo<UnsavedContextValue>(
    () => ({ count, register, clearAll, confirmDiscard }),
    [count, register, clearAll, confirmDiscard],
  );

  return (
    <UnsavedContext.Provider value={value}>
      {children}
      {count > 0 && (
        <div className="em-unsaved-banner" role="status" aria-live="polite">
          <span className="em-unsaved-banner-dot" aria-hidden />
          {count === 1
            ? "1 niet-opgeslagen wijziging"
            : `${count} niet-opgeslagen wijzigingen`}
        </div>
      )}
    </UnsavedContext.Provider>
  );
}

export function useUnsavedChanges(): UnsavedContextValue {
  const ctx = useContext(UnsavedContext);
  if (!ctx) {
    throw new Error(
      "useUnsavedChanges must be used within <UnsavedChangesProvider>",
    );
  }
  return ctx;
}

/**
 * Helper for editors: pass `dirty` as a boolean — this hook handles
 * registration/cleanup automatically with a stable per-mount id.
 */
export function useDirtyTracker(dirty: boolean): void {
  const { register } = useUnsavedChanges();
  const idRef = useRef<string>("");
  useEffect(() => {
    if (!dirty) return;
    if (!idRef.current) {
      idRef.current = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    const release = register(idRef.current);
    return release;
  }, [dirty, register]);
}
