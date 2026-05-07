"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

type LoginResponse = {
  success: boolean;
  error?: string;
};

export default function AdminLoginPage() {
  // useSearchParams() requires a Suspense boundary during static prerender (Next 16)
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="em-login">
      <div className="em-login-card">{children}</div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const fromPath = params.get("from") ?? "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Autofocus the password field on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Reset shake after animation completes
  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(false), 320);
    return () => clearTimeout(t);
  }, [shake]);

  const submit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (loading) return;
      if (!password) {
        setError("Vul je wachtwoord in");
        setShake(true);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const data = (await res.json()) as LoginResponse;
        if (!res.ok || !data.success) {
          setError(data.error ?? "Inloggen mislukt");
          setShake(true);
          setLoading(false);
          // Re-focus input for quick retry
          inputRef.current?.select();
          return;
        }
        // Success — go to the originally requested admin route (or /admin)
        const target = fromPath.startsWith("/admin") ? fromPath : "/admin";
        router.replace(target);
        router.refresh();
      } catch {
        setError("Netwerkfout, probeer opnieuw");
        setShake(true);
        setLoading(false);
      }
    },
    [password, loading, fromPath, router],
  );

  return (
    <div className="em-login">
      <div className={`em-login-card${shake ? " is-shake" : ""}`}>
        <div className="em-login-brand">
          <div
            className="em-brand-badge"
            style={{ width: 40, height: 40, fontSize: 16, borderRadius: 10 }}
            aria-hidden
          >
            EM
          </div>
          <div className="em-login-brand-text">
            <span className="em-login-brand-title">Site Admin</span>
            <span className="em-login-brand-sub">Sloepenspel Amsterdam</span>
          </div>
        </div>

        <div className="em-login-divider" />

        <form onSubmit={submit} noValidate>
          <label htmlFor="em-pw" className="em-label">
            Wachtwoord
          </label>
          <input
            ref={inputRef}
            id="em-pw"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            disabled={loading}
            className={`em-input${error ? " is-error" : ""}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "em-pw-error" : undefined}
          />
          {error && (
            <div id="em-pw-error" className="em-login-error" role="alert">
              {error}
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              type="submit"
              className={`em-btn em-btn-primary em-btn-block${
                loading ? " em-btn-loading" : ""
              }`}
              disabled={loading}
              style={{ padding: "10px 16px", fontSize: 14 }}
            >
              {loading ? "Inloggen…" : "Inloggen"}
            </button>
          </div>
        </form>

        <div className="em-login-footer">Endless Minds CMS</div>
      </div>
    </div>
  );
}
