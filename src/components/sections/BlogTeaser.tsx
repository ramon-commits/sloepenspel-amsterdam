import Image from "next/image";
import Link from "next/link";
import { Container } from "../Container";
import { Section, SectionEyebrow } from "../Section";
import { latestArticles, articleHref, authorOf, categoryOf } from "@/content/articles";
import { Reveal } from "../Reveal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function BlogTeaser() {
  const items = latestArticles(3);

  return (
    <Section variant="white" id="blog-teaser">
      <Container>
        <div className="flex items-end justify-between gap-6 mb-12 md:mb-14 flex-wrap">
          <Reveal>
            <div className="max-w-2xl">
              <SectionEyebrow>Verhalen & gidsen</SectionEyebrow>
              <h2 className="h2">
                <span className="headline-italic">Lezen</span> over varen, teams en Amsterdam
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Link
              href="/blog"
              className="link-reveal text-sm font-medium text-[color:var(--color-primary)] inline-flex items-center gap-2 group"
            >
              Bekijk alle artikelen
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-xs transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {items.map((a, i) => (
            <Reveal key={a.slug} delay={i * 100}>
              <Link
                href={articleHref(a)}
                className="group flex flex-col gap-4 h-full"
              >
                <div className="relative aspect-[16/11] rounded-[var(--radius-image)] overflow-hidden">
                  <Image
                    src={a.ogImage}
                    alt={a.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="eyebrow text-[color:var(--color-accent)] mb-2">
                    {categoryOf(a)?.label}
                  </p>
                  <h3 className="font-display text-xl md:text-[22px] font-semibold leading-tight tracking-tight mb-3 group-hover:text-[color:var(--color-accent)] transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-sm text-[color:var(--color-primary)]/72 leading-relaxed mb-5 flex-1">
                    {a.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[color:var(--color-muted)]">
                    <span>{authorOf(a).name}</span>
                    <span className="opacity-40">·</span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                      {a.readMinutes} min
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
