import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { JsonLdGroup } from "@/components/JsonLd";
import {
  latestArticles,
  articleHref,
  authorOf,
  categoryOf,
} from "@/content/articles";
import { categories } from "@/content/categories";
import { breadcrumbLd, absUrl, SITE_URL } from "@/lib/seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Gidsen, achtergronden en verhalen over bedrijfsuitjes, varen op de Amsterdamse grachten en wat een team-uitje écht impactvol maakt.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: absUrl("/blog"),
    title: "Sloepenspel Blog",
    description:
      "Gidsen, achtergronden en verhalen over bedrijfsuitjes op het water.",
  },
};

export default function BlogIndexPage() {
  const articles = latestArticles();
  const featured = articles.find((a) => a.isPillar) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured.slug);

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    url: absUrl("/blog"),
    name: "Sloepenspel Blog",
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: absUrl(articleHref(a)),
      datePublished: a.datePublished,
      author: { "@type": "Person", name: authorOf(a).name },
    })),
  };

  return (
    <>
      <JsonLdGroup
        items={[
          blogLd,
          breadcrumbLd([{ name: "Blog", href: "/blog" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        {/* Header */}
        <section className="pt-36 md:pt-44 pb-12 md:pb-16 bg-[color:var(--color-bg-warm)] grain relative">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="text-xs tracking-[0.15em] uppercase text-[color:var(--color-muted)] mb-8 flex items-center gap-2"
            >
              <Link href="/" className="hover:text-[color:var(--color-primary)] transition-colors">
                Home
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[8px] opacity-50" />
              <span className="text-[color:var(--color-primary)]">Blog</span>
            </nav>
            <div className="max-w-[820px]">
              <p className="eyebrow text-[color:var(--color-muted)] mb-5">Verhalen, gidsen, achterkant</p>
              <h1 className="h1 mb-6">
                <span className="headline-italic">Lezen</span> over varen, teams en Amsterdam
              </h1>
              <p className="text-lg text-[color:var(--color-primary)]/80 leading-relaxed max-w-prose">
                Gidsen voor wie boekt, achtergrondverhalen voor wie wil snappen waarom we doen wat we doen, en losse essays
                over de stad die we elke week opnieuw aflopen.
              </p>
            </div>
          </Container>
        </section>

        {/* Category filter */}
        <section className="border-b border-[color:var(--color-primary)]/10 sticky top-[72px] md:top-[80px] z-30 bg-white/85 backdrop-blur-md">
          <Container>
            <div className="py-4 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.15em] text-[color:var(--color-muted)] mr-2">
                Categorie
              </span>
              <Link
                href="/blog"
                className="btn-pill !py-2 !px-4 text-xs btn-primary"
              >
                Alle
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/blog/category/${c.slug}`}
                  className="btn-pill !py-2 !px-4 text-xs bg-white border border-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)]"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Featured */}
        <section className="bg-white pt-12 md:pt-16">
          <Container>
            <Link
              href={articleHref(featured)}
              className="grid lg:grid-cols-12 gap-10 group"
            >
              <div className="lg:col-span-7 relative aspect-[16/10] rounded-[var(--radius-image)] overflow-hidden">
                <Image
                  src={featured.ogImage}
                  alt={featured.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-[color:var(--color-accent)] text-white text-[10px] tracking-[0.15em] uppercase font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faStar} className="text-[8px]" />
                    Uitgelicht
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center">
                <p className="eyebrow text-[color:var(--color-accent)] mb-4">
                  {categoryOf(featured)?.label}
                </p>
                <h2 className="h2 mb-5 group-hover:text-[color:var(--color-accent)] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-lg text-[color:var(--color-primary)]/75 leading-relaxed mb-6 max-w-prose">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-5 text-sm text-[color:var(--color-muted)]">
                  <span>{authorOf(featured).name}</span>
                  <span className="opacity-40">·</span>
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faClock} className="text-xs" />
                    {featured.readMinutes} min
                  </span>
                  <span className="opacity-40">·</span>
                  <time dateTime={featured.datePublished}>
                    {formatDate(featured.datePublished)}
                  </time>
                </div>
              </div>
            </Link>
          </Container>
        </section>

        {/* Grid */}
        <section className="bg-white py-16 md:py-20">
          <Container>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {rest.map((a) => (
                <ArticleCard key={a.slug} a={a} />
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ArticleCard({ a }: { a: ReturnType<typeof latestArticles>[number] }) {
  return (
    <Link
      href={articleHref(a)}
      className="group flex flex-col gap-4"
      aria-label={a.title}
    >
      <div className="relative aspect-[16/11] rounded-[var(--radius-image)] overflow-hidden">
        <Image
          src={a.ogImage}
          alt={a.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div>
        <p className="eyebrow text-[color:var(--color-accent)] mb-2">
          {categoryOf(a)?.label}
        </p>
        <h3 className="font-display text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-3 group-hover:text-[color:var(--color-accent)] transition-colors">
          {a.title}
        </h3>
        <p className="text-sm text-[color:var(--color-primary)]/72 leading-relaxed mb-4">
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
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}
