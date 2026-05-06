import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { JsonLdGroup } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { restaurants, restaurantBySlug } from "@/content/restaurants";
import { breadcrumbLd, absUrl, SITE_URL } from "@/lib/seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faUtensils,
  faArrowRight,
  faLocationDot,
  faGlobe,
  faUsers,
  faEuroSign,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { siteConfig } from "@/content/site.config";

export async function generateStaticParams() {
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = restaurantBySlug(slug);
  if (!r) return { title: "Niet gevonden" };
  return {
    title: { absolute: `${r.name} | Restaurant na Bedrijfsuitje Amsterdam | Sloepenspel` },
    description: `${r.name} in Amsterdam is perfect voor groepen ${r.capacity}. ${r.bijzonderDetail} Combineer met het Sloepenspel bij ${r.locationName}.`,
    alternates: { canonical: `/restaurants/${r.slug}` },
    openGraph: {
      type: "website",
      title: `${r.name} | Restaurant na Bedrijfsuitje Amsterdam`,
      description: `${r.name} in Amsterdam, geschikt voor groepen ${r.capacity}. ${r.bijzonderDetail}`,
      url: absUrl(`/restaurants/${r.slug}`),
      images: [{ url: absUrl(r.hero) }],
    },
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = restaurantBySlug(slug);
  if (!r) notFound();

  const restaurantLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/restaurants/${r.slug}#restaurant`,
    name: r.name,
    description: r.story.join(" "),
    image: [absUrl(r.hero), ...r.gallery.map((g) => absUrl(g))],
    servesCuisine: r.keuken,
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address.replace(/, Amsterdam$/, ""),
      addressLocality: "Amsterdam",
      addressCountry: "NL",
    },
    url: r.websiteUrl,
    priceRange: r.prijsklasse,
    maximumAttendeeCapacity: r.maxGroup,
  };

  return (
    <>
      <JsonLdGroup
        items={[
          restaurantLd,
          breadcrumbLd([
            { name: "Restaurants", href: "/restaurants" },
            { name: r.name, href: `/restaurants/${r.slug}` },
          ]),
        ]}
      />
      <Nav />
      <main id="main-content">
        {/* Header — beige */}
        <section className="pt-36 md:pt-44 pb-16 md:pb-20 bg-[color:var(--color-bg-warm)] grain relative">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="text-xs tracking-[0.15em] uppercase text-[color:var(--color-muted)] mb-10 flex flex-wrap items-center gap-2"
            >
              <Link
                href="/"
                className="hover:text-[color:var(--color-primary)] transition-colors"
              >
                Home
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[8px] opacity-50" />
              <Link
                href="/restaurants"
                className="hover:text-[color:var(--color-primary)] transition-colors"
              >
                Restaurants
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[8px] opacity-50" />
              <span className="text-[color:var(--color-primary)] truncate max-w-[260px]">
                {r.name}
              </span>
            </nav>
            <div className="max-w-[820px]">
              <p className="eyebrow text-[color:var(--color-accent)] mb-5 flex items-center gap-2">
                <FontAwesomeIcon icon={faUtensils} className="text-xs" />
                {r.keuken}
              </p>
              <h1 className="h1 mb-6">
                {r.name}, dineren na jullie{" "}
                <span className="headline-italic">Sloepenspel</span>.
              </h1>
              <p className="text-lg md:text-xl text-[color:var(--color-primary)]/80 leading-relaxed max-w-prose mb-8">
                {r.sfeer}.
              </p>
              <div className="flex items-center gap-x-6 gap-y-3 text-sm text-[color:var(--color-muted)] flex-wrap">
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-[color:var(--color-accent)]"
                  />
                  {r.address}
                </span>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-[color:var(--color-accent)]"
                  />
                  {r.capacity}
                </span>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faEuroSign}
                    className="text-[color:var(--color-accent)]"
                  />
                  {r.prijsklasse}
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* Hero photo — full-bleed-ish, beige background continues */}
        <section className="bg-[color:var(--color-bg-warm)] pb-16 md:pb-20 lg:pb-24">
          <Container>
            <Reveal>
              <div className="relative aspect-[16/9] md:aspect-[16/7] rounded-[var(--radius-image)] overflow-hidden">
                <Image
                  src={r.hero}
                  alt={`${r.name} sfeerbeeld, ${r.sfeer}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-primary)]/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
                  <p className="text-white text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium drop-shadow">
                    {r.sfeer}
                  </p>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Quick-facts strip — subtle separator between beige and white */}
        <section className="bg-white border-y border-[color:var(--color-primary)]/8">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--color-primary)]/10">
              <Fact label="Type keuken" value={r.keuken} icon={faUtensils} />
              <Fact label="Max groep" value={`${r.maxGroup} personen`} icon={faUsers} />
              <Fact label="Prijsklasse" value={r.prijsklasse} icon={faEuroSign} />
              <Fact
                label="Aparte groepsruimte"
                value={r.groepsruimte ? "Ja" : "Nee"}
                icon={faCheck}
                muted={!r.groepsruimte}
              />
            </div>
          </Container>
        </section>

        {/* Story — white background, generous breathing room */}
        <article className="bg-white">
          <Container className="!max-w-[820px]">
            <div className="py-20 md:py-24 lg:py-28 blog-prose">
              {r.story.map((paragraph, i) =>
                i === 0 ? (
                  <Reveal key={i}>
                    <p className="blog-intro">{paragraph}</p>
                  </Reveal>
                ) : (
                  <Reveal key={i} delay={i * 80}>
                    <p>{paragraph}</p>
                  </Reveal>
                )
              )}
            </div>
          </Container>
        </article>

        {/* Gallery strip — beige with proper breathing */}
        {r.gallery.length >= 2 && (
          <section className="bg-[color:var(--color-bg-warm)] py-16 md:py-20 lg:py-24">
            <Container>
              <Reveal>
                <p className="eyebrow text-[color:var(--color-muted)] mb-8 md:mb-10">
                  Sfeerbeelden
                </p>
              </Reveal>
              <div className="grid grid-cols-3 gap-3 md:gap-5">
                {r.gallery.slice(0, 3).map((src, i) => (
                  <Reveal key={`${src}-${i}`} delay={i * 90}>
                    <div className="relative overflow-hidden rounded-[var(--radius-image)] aspect-[4/5] group">
                      <Image
                        src={src}
                        alt={`${r.name}, sfeerbeeld ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Goed om te weten — white */}
        <section className="bg-white py-20 md:py-24 lg:py-28">
          <Container className="!max-w-[820px]">
            <Reveal>
              <p className="eyebrow text-[color:var(--color-muted)] mb-5">In een oogopslag</p>
              <h2 className="h2 mb-10 md:mb-12">
                <span className="headline-italic">Goed</span> om te weten.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <dl className="grid sm:grid-cols-2 gap-x-12 gap-y-7">
                <FactItem label="Adres" value={r.address} />
                <FactItem label="Type keuken" value={r.keuken} />
                <FactItem label="Sfeer" value={r.sfeer} />
                <FactItem label="Maximum groep" value={r.capacity} />
                <FactItem label="Prijsklasse" value={r.prijsklasse} />
                <FactItem
                  label="Aparte groepsruimte"
                  value={r.groepsruimte ? "Ja" : "Nee"}
                />
                <FactItem
                  label="Dichtstbijzijnde Sloepenspel-locatie"
                  value={r.locationName}
                />
                <FactItem
                  label="Website"
                  value={
                    <a
                      href={r.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-reveal text-[color:var(--color-primary)]"
                    >
                      {r.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  }
                />
              </dl>
            </Reveal>
          </Container>
        </section>

        {/* Combineer + CTA — beige with breathing */}
        <section className="bg-[color:var(--color-bg-warm)] border-t border-[color:var(--color-primary)]/8 py-20 md:py-24 lg:py-28">
          <Container className="!max-w-[820px]">
            <Reveal>
              <p className="eyebrow text-[color:var(--color-muted)] mb-5">
                Een middag op maat
              </p>
              <h2 className="h2 mb-8">
                Combineer met jullie{" "}
                <span className="headline-italic">Sloepenspel</span>.
              </h2>
              <p className="text-lg text-[color:var(--color-primary)]/80 leading-relaxed mb-6 max-w-prose">
                {r.name} ligt op of vlakbij <strong>{r.locationName}</strong>, één van onze zes
                opstaplocaties in Amsterdam. Een typische middag start met het spel op het water en
                sluit af bij {r.name} voor het diner. Wij regelen de afstemming, jullie hoeven
                alleen maar te genieten.
              </p>
              <p className="text-lg text-[color:var(--color-primary)]/80 leading-relaxed mb-10 max-w-prose">
                Voor groepen tot {r.maxGroup} personen sturen we de menukaart en beschikbare data
                mee in onze offerte.{" "}
                <Link
                  href="/locaties-groepen"
                  className="link-reveal text-[color:var(--color-primary)]"
                >
                  Bekijk hoe locaties en restaurants combineren
                </Link>
                .
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Button href={siteConfig.cta.primaryHref} variant="primary">
                  {siteConfig.cta.primary}
                </Button>
                <a
                  href={r.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill btn-outline"
                >
                  <FontAwesomeIcon icon={faGlobe} className="text-sm" />
                  Bezoek website
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </a>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Fact({
  label,
  value,
  icon,
  muted = false,
}: {
  label: string;
  value: string;
  icon: typeof faUtensils;
  muted?: boolean;
}) {
  return (
    <div className="bg-white p-6 md:p-8 flex flex-col gap-2">
      <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-[color:var(--color-muted)] flex items-center gap-2">
        <FontAwesomeIcon
          icon={icon}
          className="text-[color:var(--color-accent)] text-[11px]"
        />
        {label}
      </span>
      <span
        className={`font-display text-base md:text-lg leading-tight ${
          muted
            ? "text-[color:var(--color-muted)]"
            : "text-[color:var(--color-primary)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function FactItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 pb-5 border-b border-[color:var(--color-primary)]/8">
      <dt className="text-[10px] tracking-[0.18em] uppercase font-medium text-[color:var(--color-muted)]">
        {label}
      </dt>
      <dd className="font-display text-base md:text-lg leading-tight text-[color:var(--color-primary)]">
        {value}
      </dd>
    </div>
  );
}
