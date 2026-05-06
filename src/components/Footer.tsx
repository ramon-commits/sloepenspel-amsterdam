import Link from "next/link";
import { siteConfig } from "@/content/site.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faPhone, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Container } from "./Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[color:var(--color-primary)] text-white relative grain pb-24 lg:pb-0">
      <Container className="py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="font-display text-3xl font-semibold tracking-tight">
              Sloepen<span className="italic font-normal">spel</span>
            </div>
            <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-xs">
              Het interactieve bedrijfsuitje op het water. 600 verhalen, één middag, hele stad.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href={siteConfig.social.linkedin}
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-white/70 mb-4">Het spel</h2>
            <ul className="space-y-3 text-sm">
              {siteConfig.footerNav.spel.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 hover:text-[color:var(--color-accent)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-white/70 mb-4">Info</h2>
            <ul className="space-y-3 text-sm">
              {siteConfig.footerNav.info.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 hover:text-[color:var(--color-accent)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-white/70 mb-4">Contact</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faPhone} className="mt-1 text-[color:var(--color-accent)]" />
                <a href={siteConfig.contact.phoneHref} className="hover:text-[color:var(--color-accent)] transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="mt-1 text-[color:var(--color-accent)]" />
                <a href={siteConfig.contact.emailHref} className="hover:text-[color:var(--color-accent)] transition-colors">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faLocationDot} className="mt-1 text-[color:var(--color-accent)]" />
                <span className="text-white/80">
                  {siteConfig.contact.address.street}<br />
                  {siteConfig.contact.address.zip} {siteConfig.contact.address.city}
                </span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-white/50">{siteConfig.contact.hours}</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/50">
          <p>© {year} {siteConfig.name}. Alle rechten voorbehouden.</p>
          <div className="flex gap-6">
            {siteConfig.footerNav.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
