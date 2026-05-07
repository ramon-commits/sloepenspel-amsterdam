"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "cookie-consent";
const EVENT_NAME = "consentchange";

export function ConsentAnalytics() {
  const pathname = usePathname();
  const [accepted, setAccepted] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    function read() {
      try {
        setAccepted(window.localStorage.getItem(STORAGE_KEY) === "accepted");
      } catch {
        setAccepted(false);
      }
    }
    read();
    function onChange(e: Event) {
      const detail = (e as CustomEvent).detail;
      setAccepted(detail === "accepted");
    }
    window.addEventListener(EVENT_NAME, onChange);
    return () => window.removeEventListener(EVENT_NAME, onChange);
  }, []);

  if (isAdmin || !accepted) return null;

  return (
    <>
      <Analytics />
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
    </>
  );
}
