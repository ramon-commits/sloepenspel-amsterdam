"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { siteConfig } from "@/content/site.config";

export function MobileCtaBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdmin) return;
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <div
      className="mobile-cta-bar"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(80px)",
        transition: "opacity 280ms ease-out, transform 280ms cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      <a
        href={siteConfig.contact.phoneHref}
        aria-label={`Bel ${siteConfig.contact.phone}`}
        className="w-11 h-11 shrink-0 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faPhone} />
      </a>
      <Link
        href={siteConfig.cta.primaryHref}
        className="flex-1 btn-pill btn-primary justify-center text-[15px] !py-3"
      >
        <span>{siteConfig.cta.primary}</span>
        <FontAwesomeIcon icon={faArrowRight} className="text-xs" aria-hidden />
      </Link>
    </div>
  );
}
