import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { JsonLdGroup } from "@/components/JsonLd";
import {
  articlesByCategory,
  articleHref,
  authorOf,
  categoryOf,
} from "@/content/articles";
import { categories, categoryBySlug } from "@/content/categories";
import { breadcrumbLd, absUrl } from "@/lib/seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (!cat) return { title: "Niet gevonden" };
  return {
    title: `${cat.label}, Sloepenspel Blog`,
    description: cat.description,
    alternates: { canonical: `/blog/category/${cat.slug}` },
    openGraph: {
      type: "website",
      title: `${cat.label}, Sloepenspel Blog`,
      description: cat.description,
      url: absUrl(`/blog/category/${cat.slug}`),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (!cat) notFound();
  const items = articlesByCategory(cat.id);

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd([
            { name: "Blog", href: "/blog" },
            { name: cat.label, href: `/blog/category/${cat.slug}` },
          ]),
        ]}
      />
      <Nav />
      <main id="main-content">
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
              <Link href="/blog" className="hover:text-[color:var(--color-primary)] transition-colors">
                Blog
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[8px] opacity-50" />
              <span className="text-[color:var(--color-primary)]">{cat.label}</span>
            </nav>
            <div className="max-w-[820px]">
              <p className="eyebrow text-[color:var(--color-muted)] mb-5">Categorie</p>
              <h1 className="h1 mb-6">
                <span className="headline-italic">{cat.label}</span>
              </h1>
              <p className="text-lg text-[color:var(--color-primary)]/80 leading-relaxed max-w-prose">
                {cat.description}
              </p>
            </div>
          </Container>
        </section>

        <section className="border-b border-[color:var(--color-primary)]/10 sticky top-[72px] md:top-[80px] z-30 bg-white/85 backdrop-blur-md">
          <Container>
            <div className="py-4 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.15em] text-[color:var(--color-muted)] mr-2">
                Categorie
              </span>
              <Link
                href="/blog"
                className="btn-pill !py-2 !px-4 text-xs bg-white border border-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)]"
              >
                Alle
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/blog/category/${c.slug}`}
                  aria-current={c.slug === cat.slug ? "page" : undefined}
                  className={`btn-pill !py-2 !px-4 text-xs ${
                    c.slug === cat.slug
                      ? "btn-primary"
                      : "bg-white border border-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)]"
                  }`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-white py-16 md:py-20">
          <Container>
            {items.length === 0 ? (
              <p className="text-[color:var(--color-muted)]">Nog geen artikelen in deze categorie.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {items.map((a) => (
                  <Link
                    key={a.slug}
                    href={articleHref(a)}
                    className="group flex flex-col gap-4"
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
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
