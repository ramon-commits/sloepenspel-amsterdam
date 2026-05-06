"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { siteConfig } from "@/content/site.config";
import { Button } from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const LANGS = [
  { label: "NL", href: "/" },
  { label: "EN", href: "/en" },
];

export function Nav({ locale = "nl" }: { locale?: "nl" | "en" } = {}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeLang = locale === "en" ? "EN" : "NL";
  const ctaLabel = locale === "en" ? "Request a quote" : siteConfig.cta.primary;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-[72px] md:h-[80px]">
        <Link
          href={locale === "en" ? "/en" : "/"}
          aria-label={siteConfig.name}
          className="emblem-link relative shrink-0 block"
        >
          <span className="emblem-img relative block">
            <Image
              src="/images/logo-emblem.png"
              alt={siteConfig.name}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 76px, (max-width: 1024px) 100px, 120px"
              className="object-contain"
            />
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {siteConfig.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm font-medium ${scrolled ? "text-[color:var(--color-primary)]" : "text-white"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <div className={`flex items-center gap-2 text-xs font-medium ${scrolled ? "text-[color:var(--color-primary)]" : "text-white"}`}>
            {LANGS.map((lang, i) => {
              const isActive = lang.label === activeLang;
              return (
                <span key={lang.label} className="flex items-center gap-2">
                  <Link
                    href={lang.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`transition-colors ${
                      isActive
                        ? "text-[color:var(--color-accent)]"
                        : "hover:text-[color:var(--color-accent)]"
                    }`}
                  >
                    {lang.label}
                  </Link>
                  {i < LANGS.length - 1 && <span className="opacity-40">/</span>}
                </span>
              );
            })}
          </div>
          <Button href={siteConfig.cta.primaryHref} variant="primary" arrow={false}>
            {ctaLabel}
          </Button>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 min-w-11 min-h-11 ${scrolled ? "text-[color:var(--color-primary)]" : "text-white"}`}
        >
          <FontAwesomeIcon icon={open ? faXmark : faBars} className="text-2xl" />
        </button>
      </div>

      {/* Mobile menu, slide-in */}
      <div
        className={`lg:hidden bg-white border-t border-black/5 overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container-x py-6 flex flex-col gap-4">
          {siteConfig.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-[color:var(--color-primary)] py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-black/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium">
              {LANGS.map((lang, i) => {
                const isActive = lang.label === activeLang;
                return (
                  <span key={lang.label} className="flex items-center gap-2">
                    <Link
                      href={lang.href}
                      className={`${isActive ? "text-[color:var(--color-accent)]" : ""}`}
                    >
                      {lang.label}
                    </Link>
                    {i < LANGS.length - 1 && <span className="opacity-40">/</span>}
                  </span>
                );
              })}
            </div>
            <Button href={siteConfig.cta.primaryHref} variant="primary" arrow={false}>
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
