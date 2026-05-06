import Link from "next/link";
import { ReactNode } from "react";
import { Container } from "./Container";
import { Button } from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { siteConfig } from "@/content/site.config";

export type RelatedArticle = { title: string; href: string; readMinutes: number };

export function BlogLayout({
  title,
  category = "Blog",
  readMinutes,
  intro,
  children,
  related,
}: {
  title: string;
  category?: string;
  readMinutes: number;
  intro: string;
  children: ReactNode;
  related?: RelatedArticle[];
}) {
  return (
    <>
      {/* Header */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-16 bg-[color:var(--color-bg-warm)] grain relative">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs tracking-[0.15em] uppercase text-[color:var(--color-muted)] mb-8 flex flex-wrap items-center gap-2">
            <Link href="/" className="hover:text-[color:var(--color-primary)] transition-colors">
              Home
            </Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-[8px] opacity-50" />
            <span className="hover:text-[color:var(--color-primary)] transition-colors">{category}</span>
            <FontAwesomeIcon icon={faChevronRight} className="text-[8px] opacity-50" />
            <span className="text-[color:var(--color-primary)] truncate max-w-[260px]">{title}</span>
          </nav>

          <div className="max-w-[720px]">
            <h1 className="h1 mb-6 md:mb-8">{title}</h1>
            <div className="flex items-center gap-5 text-sm text-[color:var(--color-muted)]">
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-[color:var(--color-accent)]" />
                {readMinutes} min lezen
              </span>
              <span className="opacity-40">·</span>
              <span className="uppercase tracking-[0.15em] text-[10px] font-medium">{category}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Article body */}
      <article className="bg-white">
        <Container className="!max-w-[820px]">
          <div className="py-12 md:py-16 blog-prose">
            <p className="blog-intro">{intro}</p>
            {children}
          </div>
        </Container>
      </article>

      {/* CTA banner */}
      <section className="bg-[color:var(--color-bg-warm)] border-y border-[color:var(--color-primary)]/8">
        <Container className="!max-w-[820px]">
          <div className="py-12 md:py-14 text-center">
            <h2 className="h3 mb-4">
              Klaar voor je <span className="headline-italic">eigen middag</span> op het water?
            </h2>
            <p className="text-base text-[color:var(--color-muted)] mb-7 max-w-md mx-auto">
              Eén telefoontje of formulier, reactie binnen één werkdag.
            </p>
            <Button href={siteConfig.cta.primaryHref} variant="primary">
              {siteConfig.cta.primary}
            </Button>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="bg-white">
          <Container className="!max-w-[820px]">
            <div className="py-14 md:py-16">
              <p className="eyebrow text-[color:var(--color-muted)] mb-6">Lees verder</p>
              <ul className="divide-y divide-[color:var(--color-primary)]/10">
                {related.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="flex items-baseline justify-between gap-6 py-5 group"
                    >
                      <span className="font-display text-lg md:text-xl font-medium leading-tight tracking-tight group-hover:text-[color:var(--color-accent)] transition-colors">
                        {r.title}
                      </span>
                      <span className="text-xs uppercase tracking-[0.15em] text-[color:var(--color-muted)] shrink-0 flex items-center gap-2">
                        {r.readMinutes} min
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="text-[10px] transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
