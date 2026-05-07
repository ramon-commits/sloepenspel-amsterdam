"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "cookie-consent";
const EVENT_NAME = "consentchange";

export type ConsentValue = "accepted" | "necessary";

export function CookieBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdmin) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== "accepted" && stored !== "necessary") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, [isAdmin]);

  function choose(value: ConsentValue) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: value }));
    } catch {
      // ignore — storage blocked, banner will reappear next visit
    }
    setVisible(false);
  }

  if (isAdmin || !visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-instellingen"
      className="fixed left-4 right-4 bottom-4 md:left-auto md:right-6 md:bottom-6 md:max-w-[420px] z-[60] bg-white text-[color:var(--color-primary)] rounded-[16px] shadow-[0_10px_30px_rgba(27,42,74,0.15)] border border-[color:var(--color-primary)]/10 p-5 md:p-6 mb-20 lg:mb-0"
    >
      <p className="text-sm leading-relaxed">
        Wij gebruiken cookies om je ervaring te verbeteren en onze site te
        analyseren. Lees meer in onze{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-[color:var(--color-accent)] transition-colors"
        >
          privacyverklaring
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="btn-pill btn-primary text-sm"
        >
          <span>Accepteren</span>
        </button>
        <button
          type="button"
          onClick={() => choose("necessary")}
          className="btn-pill btn-outline text-sm"
        >
          <span>Alleen noodzakelijk</span>
        </button>
      </div>
    </div>
  );
}
