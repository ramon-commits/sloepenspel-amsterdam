import { siteConfig } from "@/content/site.config";
import type { Article } from "@/content/articles";
import { authorOf, categoryOf } from "@/content/articles";

export const SITE_URL = siteConfig.url;

export const absUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Organization schema, emitted once via root layout */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: siteConfig.name,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absUrl("/images/logo-emblem.png"),
      width: 1024,
      height: 1024,
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        contactType: "customer service",
        email: siteConfig.contact.email,
        areaServed: "NL",
        availableLanguage: ["Dutch", "English"],
      },
    ],
  };
}

/** LocalBusiness, for local SEO + Google Maps surfacing */
export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: siteConfig.name,
    url: SITE_URL,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    image: absUrl("/images/hero-bedrijfsuitje-v5.jpg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      postalCode: siteConfig.contact.address.zip,
      addressLocality: siteConfig.contact.address.city,
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.3614,
      longitude: 4.9148,
    },
    openingHours: ["Mo-Fr 09:00-18:00"],
    priceRange: "€€",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "247",
    },
  };
}

/** WebSite schema with SearchAction */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteConfig.name,
    description:
      "Het interactieve bedrijfsuitje op het water in Amsterdam, voor 30 tot 500 personen.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "nl-NL",
  };
}

/** BreadcrumbList, pass [{name, href}] in order, auto adds Home */
export function breadcrumbLd(items: Array<{ name: string; href: string }>) {
  const list = [{ name: "Home", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.href),
    })),
  };
}

/** Article, for blog posts and pillar pages */
export function articleLd(a: Article, href: string) {
  const author = authorOf(a);
  const cat = categoryOf(a);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absUrl(href)}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": absUrl(href) },
    headline: a.title,
    description: a.excerpt,
    image: [absUrl(a.ogImage)],
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    inLanguage: "nl-NL",
    articleSection: cat?.label,
    keywords: a.tags.join(", "),
    wordCount: estimateWordCount(a),
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      sameAs: author.sameAs,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

function estimateWordCount(a: Article) {
  const text = `${a.intro} ${a.body}`.replace(/<[^>]+>/g, " ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** FAQPage, used on FAQ section + articles with faq[] */
export function faqLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Service, for the offering itself */
export function serviceLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    serviceType: "Bedrijfsuitje",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "City", name: "Amsterdam" },
    audience: { "@type": "Audience", audienceType: "Bedrijven en teams" },
    offers: {
      "@type": "Offer",
      price: "59.50",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      eligibleQuantity: { "@type": "QuantitativeValue", minValue: 30, maxValue: 500 },
      url: absUrl("/contact#formulier"),
    },
  };
}

/** LocalBusiness for a specific pickup location (Sloepenspel uses 6 vaarlocaties) */
export function locationLd(loc: {
  id: string;
  name: string;
  address: string;
  area: string;
  lat: number;
  lng: number;
  description: string;
  maxGroup: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/locaties-groepen#${loc.id}`,
    name: `Sloepenspel Amsterdam, ${loc.name}`,
    description: loc.description,
    url: absUrl(`/locaties-groepen#${loc.id}`),
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    image: absUrl("/images/hero-bedrijfsuitje-v5.jpg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: "Amsterdam",
      addressRegion: loc.area,
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: loc.lat,
      longitude: loc.lng,
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    maximumAttendeeCapacity: loc.maxGroup,
    areaServed: { "@type": "City", name: "Amsterdam" },
  };
}

/** ContactPage schema (small wrapper for /contact) */
export function contactPageLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#contactpage`,
    url: absUrl("/contact"),
    name: `Contact ${siteConfig.name}`,
    description: "Vraag een offerte aan voor het Sloepenspel.",
  };
}

/** Helper: render JSON-LD as a script tag string (for layout/page injection) */
export function jsonLdScript(obj: object) {
  return JSON.stringify(obj, null, 0);
}
