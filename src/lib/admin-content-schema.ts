import type { FileType } from "./admin-file-parsers";

/**
 * Endless Minds Site Admin — content schema for Sloepenspel.
 *
 * Each page in the sidebar maps to one or more "sections", and each section
 * either has flat fields or wraps an array of items that share a field
 * shape. Every editable field carries a label, type, and (optionally) a
 * word limit — those drive the UI without any per-page hand-coded forms.
 *
 * To support a new site, only this file changes. The runtime, parsers,
 * editors, hooks, and views all read from here.
 */

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "phone"
  | "image"
  | "image-alt";

export type ContentField = {
  /** Path *inside the section's anchor*, e.g. "headline" or "members[0].name". */
  key: string;
  label: string;
  type: FieldType;
  maxWords?: number;
  helpText?: string;
  placeholder?: string;
};

export type ContentSource = {
  file: string;
  fileType: FileType;
  /** Required for ts-object files — the named export this section reads. */
  exportName?: string;
  /**
   * Path inside the export (or the JSON root) where this section's data
   * lives. Empty string means "the whole export / file".
   */
  anchor: string;
};

export type ContentSection = {
  id: string;
  label: string;
  description?: string;
  source: ContentSource;
  fields: ContentField[];
  /**
   * If true, the anchor points to an array; the editor renders one card
   * per array item, with `fields` describing one item's shape.
   */
  isArray?: boolean;
  /** Used in the array card title and "+ Add" labels, e.g. "Tijdlijn". */
  arrayItemLabel?: string;
  /** Field key to use as each card's display title (e.g. "title"). */
  arrayItemTitleField?: string;
  /** Optional field key whose value is an `/images/...` path to preview. */
  imageField?: string;
};

export type ContentPage = {
  id: string;
  label: string;
  /** Live URL for the "Bekijk ↗" link. Use a relative path from site root. */
  url: string;
  category: "content" | "data" | "site";
  /** What the AdminShell should render. */
  view: "page-content" | "data-list" | "site-config";
  description?: string;
  sections: ContentSection[];
};

// ─────────────────────────────────────────────────────────────────────
// Repeated source helpers
// ─────────────────────────────────────────────────────────────────────

const PAGES_TS: Pick<ContentSource, "file" | "fileType"> = {
  file: "content/pages/index.ts",
  fileType: "ts-object",
};
const SERVICES_JSON: Pick<ContentSource, "file" | "fileType"> = {
  file: "content/services.json",
  fileType: "json",
};
const SITE_CONFIG_TS: Pick<ContentSource, "file" | "fileType"> = {
  file: "content/site.config.ts",
  fileType: "ts-object",
};

// ─────────────────────────────────────────────────────────────────────
// Field templates (re-used across pages)
// ─────────────────────────────────────────────────────────────────────

const heroFields: ContentField[] = [
  { key: "headline", label: "Headline", type: "text", maxWords: 12 },
  {
    key: "subheadline",
    label: "Subheadline",
    type: "textarea",
    maxWords: 35,
    helpText: "Eén of twee zinnen die de claim onderbouwen.",
  },
  { key: "primaryCta", label: "Primaire CTA tekst", type: "text", maxWords: 5 },
  { key: "primaryHref", label: "Primaire CTA link", type: "url" },
  { key: "secondaryCta", label: "Secundaire CTA tekst", type: "text", maxWords: 4 },
  { key: "secondaryHref", label: "Secundaire CTA link", type: "url" },
  { key: "image", label: "Hero foto", type: "image" },
  { key: "imageAlt", label: "Foto alt-tekst", type: "image-alt" },
];

const eyebrowHeadlineFields = (
  withItalic = false,
  withBody = false,
): ContentField[] => {
  const out: ContentField[] = [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxWords: 6 },
  ];
  if (withItalic) {
    out.push({
      key: "italicWord",
      label: "Cursief woord",
      type: "text",
      helpText: "Wordt cursief getoond binnen de headline.",
    });
  }
  out.push({
    key: "headline",
    label: "Headline",
    type: "text",
    maxWords: 12,
  });
  if (withBody) {
    out.push({
      key: "body",
      label: "Body",
      type: "textarea",
      maxWords: 35,
    });
  }
  return out;
};

// ─────────────────────────────────────────────────────────────────────
// Pages
// ─────────────────────────────────────────────────────────────────────

const homepagePage: ContentPage = {
  id: "homepage",
  label: "Homepage",
  url: "/",
  category: "content",
  view: "page-content",
  sections: [
    {
      id: "hero",
      label: "Hero",
      description: "Eerste indruk: foto, headline, CTA's.",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "hero" },
      imageField: "image",
      fields: heroFields,
    },
    {
      id: "marquee",
      label: "Logo marquee",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "marquee" },
      fields: [
        { key: "eyebrow", label: "Tekst boven logo's", type: "text", maxWords: 10 },
      ],
    },
    {
      id: "positiveReasons",
      label: "Waarom teams kiezen — kop",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "positiveReasons" },
      fields: eyebrowHeadlineFields(),
    },
    {
      id: "positiveReasonsItems",
      label: "Waarom teams kiezen — items",
      description: "Drie redenen die teams kiezen voor het Sloepenspel.",
      source: { ...SERVICES_JSON, anchor: "positiveReasons" },
      isArray: true,
      arrayItemLabel: "Reden",
      arrayItemTitleField: "title",
      fields: [
        { key: "id", label: "Nummer", type: "text", helpText: "Bijv. 01, 02, 03." },
        { key: "title", label: "Titel", type: "text", maxWords: 8 },
        { key: "body", label: "Beschrijving", type: "textarea", maxWords: 30 },
      ],
    },
    {
      id: "howItWorks",
      label: "Hoe het werkt — kop",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "howItWorks" },
      fields: eyebrowHeadlineFields(),
    },
    {
      id: "howItWorksItems",
      label: "Tijdlijn — 4 stappen",
      description: "De middag in vier fasen.",
      source: { ...SERVICES_JSON, anchor: "howItWorks" },
      isArray: true,
      arrayItemLabel: "Stap",
      arrayItemTitleField: "title",
      fields: [
        { key: "step", label: "Stapnummer", type: "text" },
        { key: "time", label: "Tijdsblok", type: "text" },
        { key: "title", label: "Titel", type: "text", maxWords: 6 },
        { key: "body", label: "Beschrijving", type: "textarea", maxWords: 35 },
      ],
    },
    {
      id: "differentiator",
      label: "Differentiator — kop",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "differentiator" },
      fields: eyebrowHeadlineFields(true),
    },
    {
      id: "differentiatorItems",
      label: "Differentiator — items",
      description: "Wat het Sloepenspel uniek maakt.",
      source: { ...SERVICES_JSON, anchor: "differentiators" },
      isArray: true,
      arrayItemLabel: "USP",
      arrayItemTitleField: "title",
      fields: [
        {
          key: "icon",
          label: "Icoon",
          type: "text",
          helpText: "Font Awesome naam, bijv. boat / masks-theater / people-group.",
        },
        { key: "title", label: "Titel", type: "text", maxWords: 6 },
        { key: "body", label: "Beschrijving", type: "textarea", maxWords: 30 },
      ],
    },
    {
      id: "signatureMoment",
      label: "Signature moment",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "signatureMoment" },
      fields: eyebrowHeadlineFields(true, true),
    },
    {
      id: "reviews",
      label: "Reviews — kop",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "reviews" },
      fields: eyebrowHeadlineFields(),
    },
    {
      id: "locationFinder",
      label: "Locatie finder — kop",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "locationFinder" },
      fields: eyebrowHeadlineFields(true, true),
    },
    {
      id: "pricing",
      label: "Pricing — kop",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "pricing" },
      fields: eyebrowHeadlineFields(true),
    },
    {
      id: "faq",
      label: "FAQ — kop",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "faq" },
      fields: eyebrowHeadlineFields(),
    },
    {
      id: "closingCta",
      label: "Sluit-CTA",
      source: { ...PAGES_TS, exportName: "homePage", anchor: "closingCta" },
      fields: [
        { key: "italicWord", label: "Cursief woord", type: "text" },
        { key: "headline", label: "Headline", type: "text", maxWords: 10 },
        { key: "body", label: "Body", type: "textarea", maxWords: 25 },
      ],
    },
  ],
};

const hetSpelPage: ContentPage = {
  id: "het-spel",
  label: "Het Spel",
  url: "/het-spel",
  category: "content",
  view: "page-content",
  sections: [
    {
      id: "hero",
      label: "Hero",
      source: { ...PAGES_TS, exportName: "hetSpelPage", anchor: "hero" },
      imageField: "image",
      fields: heroFields,
    },
    {
      id: "sections",
      label: "Spel-secties",
      description: "De zeven uitleg-secties van Het Spel.",
      source: { ...PAGES_TS, exportName: "hetSpelPage", anchor: "sections" },
      isArray: true,
      arrayItemLabel: "Sectie",
      arrayItemTitleField: "title",
      fields: [
        { key: "eyebrow", label: "Eyebrow", type: "text", maxWords: 6 },
        { key: "title", label: "Titel", type: "text", maxWords: 12 },
        { key: "body", label: "Body", type: "textarea", maxWords: 80 },
        { key: "image", label: "Foto", type: "image" },
        { key: "imageAlt", label: "Foto alt-tekst", type: "image-alt" },
      ],
    },
    {
      id: "cta",
      label: "Sluit-CTA",
      source: { ...PAGES_TS, exportName: "hetSpelPage", anchor: "cta" },
      fields: [
        { key: "italicWord", label: "Cursief woord", type: "text" },
        { key: "headline", label: "Headline", type: "text", maxWords: 10 },
        { key: "body", label: "Body", type: "textarea", maxWords: 25 },
      ],
    },
  ],
};

const locatiesPage: ContentPage = {
  id: "locaties-pagina",
  label: "Locaties",
  url: "/locaties-groepen",
  category: "content",
  view: "page-content",
  sections: [
    {
      id: "hero",
      label: "Hero",
      source: {
        ...PAGES_TS,
        exportName: "locatiesGroepenPage",
        anchor: "hero",
      },
      imageField: "image",
      fields: heroFields.filter((f) => f.key !== "secondaryCta" && f.key !== "secondaryHref"),
    },
    {
      id: "groups",
      label: "Groepsgroottes — kop",
      source: {
        ...PAGES_TS,
        exportName: "locatiesGroepenPage",
        anchor: "groups",
      },
      fields: eyebrowHeadlineFields(false, true),
    },
  ],
};

const prijzenPage: ContentPage = {
  id: "prijzen-pagina",
  label: "Prijzen",
  url: "/prijzen",
  category: "content",
  view: "page-content",
  sections: [
    {
      id: "hero",
      label: "Hero",
      source: { ...PAGES_TS, exportName: "prijzenPage", anchor: "hero" },
      fields: [
        { key: "italicWord", label: "Cursief / prijs", type: "text" },
        { key: "headline", label: "Headline", type: "text", maxWords: 10 },
        { key: "subheadline", label: "Subheadline", type: "textarea", maxWords: 30 },
      ],
    },
    {
      id: "notes",
      label: "Klein lettertje",
      source: { ...PAGES_TS, exportName: "prijzenPage", anchor: "notes" },
      fields: eyebrowHeadlineFields(),
    },
  ],
};

const overPage: ContentPage = {
  id: "over",
  label: "Over Ons",
  url: "/over",
  category: "content",
  view: "page-content",
  sections: [
    {
      id: "hero",
      label: "Hero",
      source: { ...PAGES_TS, exportName: "overPage", anchor: "hero" },
      imageField: "image",
      fields: heroFields.filter((f) => f.key !== "secondaryCta" && f.key !== "secondaryHref"),
    },
    {
      id: "story",
      label: "Ons verhaal",
      source: { ...PAGES_TS, exportName: "overPage", anchor: "story" },
      fields: eyebrowHeadlineFields(false, true),
    },
    {
      id: "values",
      label: "Waarden — kop",
      source: { ...PAGES_TS, exportName: "overPage", anchor: "values" },
      fields: eyebrowHeadlineFields(),
    },
    {
      id: "partners",
      label: "Partners",
      source: { ...PAGES_TS, exportName: "overPage", anchor: "partners" },
      fields: eyebrowHeadlineFields(false, true),
    },
    {
      id: "team",
      label: "Team — kop",
      source: { ...PAGES_TS, exportName: "overPage", anchor: "team" },
      fields: eyebrowHeadlineFields(),
    },
    {
      id: "why",
      label: "Onze focus",
      source: { ...PAGES_TS, exportName: "overPage", anchor: "why" },
      fields: eyebrowHeadlineFields(false, true),
    },
  ],
};

const contactPage: ContentPage = {
  id: "contact",
  label: "Contact",
  url: "/contact",
  category: "content",
  view: "page-content",
  sections: [
    {
      id: "hero",
      label: "Hero",
      source: { ...PAGES_TS, exportName: "contactPage", anchor: "hero" },
      fields: [
        { key: "headline", label: "Headline", type: "text", maxWords: 8 },
        { key: "subheadline", label: "Subheadline", type: "textarea", maxWords: 30 },
      ],
    },
    {
      id: "form",
      label: "Formulier",
      source: { ...PAGES_TS, exportName: "contactPage", anchor: "form" },
      fields: [
        { key: "eyebrow", label: "Eyebrow", type: "text", maxWords: 6 },
        { key: "headline", label: "Formulier headline", type: "text", maxWords: 10 },
        { key: "submit", label: "Verzendknop tekst", type: "text", maxWords: 5 },
        { key: "privacy", label: "Privacy notitie", type: "textarea", maxWords: 30 },
      ],
    },
    {
      id: "details",
      label: "Contactgegevens — kop",
      source: { ...PAGES_TS, exportName: "contactPage", anchor: "details" },
      fields: eyebrowHeadlineFields(),
    },
  ],
};

const englishPage: ContentPage = {
  id: "english",
  label: "English",
  url: "/en",
  category: "content",
  view: "page-content",
  description: "De Engelstalige homepage. Bewerkingen via stap 3.",
  sections: [],
};

const privacyPageEntry: ContentPage = {
  id: "privacy",
  label: "Privacy",
  url: "/privacy",
  category: "content",
  view: "page-content",
  sections: [
    {
      id: "hero",
      label: "Hero",
      source: { ...PAGES_TS, exportName: "privacyPage", anchor: "hero" },
      fields: [
        { key: "italicWord", label: "Cursief woord", type: "text" },
        { key: "headline", label: "Headline", type: "text", maxWords: 12 },
        { key: "subheadline", label: "Subheadline", type: "textarea", maxWords: 40 },
      ],
    },
  ],
};

const voorwaardenPage: ContentPage = {
  id: "voorwaarden",
  label: "Voorwaarden",
  url: "/algemene-voorwaarden",
  category: "content",
  view: "page-content",
  description: "Algemene voorwaarden — pagina-bewerking via stap 3.",
  sections: [],
};

// ─────────────────────────────────────────────────────────────────────
// Data pages
// ─────────────────────────────────────────────────────────────────────

const reviewsData: ContentPage = {
  id: "reviews",
  label: "Reviews",
  url: "/#reviews",
  category: "data",
  view: "data-list",
  sections: [
    {
      id: "items",
      label: "Reviews",
      source: { file: "content/reviews.json", fileType: "json", anchor: "reviews" },
      isArray: true,
      arrayItemLabel: "Review",
      arrayItemTitleField: "name",
      fields: [
        { key: "name", label: "Naam", type: "text" },
        { key: "role", label: "Functie", type: "text" },
        { key: "company", label: "Bedrijf", type: "text" },
        { key: "initials", label: "Initialen", type: "text" },
        { key: "quote", label: "Quote", type: "textarea", maxWords: 50 },
      ],
    },
  ],
};

const faqData: ContentPage = {
  id: "faq",
  label: "FAQ",
  url: "/#faq",
  category: "data",
  view: "data-list",
  sections: [
    {
      id: "items",
      label: "Vragen & antwoorden",
      source: { file: "content/faq.json", fileType: "json", anchor: "faqs" },
      isArray: true,
      arrayItemLabel: "Vraag",
      arrayItemTitleField: "q",
      fields: [
        { key: "q", label: "Vraag", type: "text", maxWords: 15 },
        { key: "a", label: "Antwoord", type: "textarea", maxWords: 80 },
      ],
    },
  ],
};

const restaurantsData: ContentPage = {
  id: "restaurants",
  label: "Restaurants",
  url: "/restaurants",
  category: "data",
  view: "data-list",
  sections: [
    {
      id: "items",
      label: "Partner restaurants",
      source: { file: "content/restaurants.json", fileType: "json", anchor: "" },
      isArray: true,
      arrayItemLabel: "Restaurant",
      arrayItemTitleField: "naam",
      fields: [
        { key: "naam", label: "Naam", type: "text" },
        { key: "slug", label: "URL slug", type: "text" },
        { key: "keuken", label: "Keuken", type: "text" },
        { key: "max_groep", label: "Max groep", type: "text" },
        { key: "adres", label: "Adres", type: "text" },
        { key: "prijsklasse", label: "Prijsklasse", type: "text" },
        { key: "website", label: "Website", type: "url" },
        { key: "beschrijving", label: "Beschrijving", type: "textarea", maxWords: 60 },
      ],
    },
  ],
};

const locationsData: ContentPage = {
  id: "locations",
  label: "Locaties",
  url: "/locaties-groepen",
  category: "data",
  view: "data-list",
  sections: [
    {
      id: "items",
      label: "Vaarlocaties",
      source: { ...SERVICES_JSON, anchor: "locations" },
      isArray: true,
      arrayItemLabel: "Locatie",
      arrayItemTitleField: "name",
      fields: [
        { key: "id", label: "ID", type: "text" },
        { key: "name", label: "Naam", type: "text" },
        { key: "area", label: "Wijk", type: "text" },
        { key: "address", label: "Adres", type: "text" },
        { key: "description", label: "Beschrijving", type: "textarea", maxWords: 40 },
        { key: "maxGroup", label: "Max groep", type: "text" },
      ],
    },
  ],
};

const blogData: ContentPage = {
  id: "blog",
  label: "Blog",
  url: "/blog",
  category: "data",
  view: "data-list",
  description: "Blog-artikelen worden in stap 3 bewerkbaar.",
  sections: [],
};

const teamData: ContentPage = {
  id: "team",
  label: "Team",
  url: "/over",
  category: "data",
  view: "data-list",
  sections: [
    {
      id: "items",
      label: "Teamleden",
      source: { ...PAGES_TS, exportName: "overPage", anchor: "team.members" },
      isArray: true,
      arrayItemLabel: "Teamlid",
      arrayItemTitleField: "name",
      fields: [
        { key: "name", label: "Naam", type: "text" },
        { key: "role", label: "Rol", type: "text" },
        { key: "bio", label: "Bio", type: "textarea", maxWords: 30 },
        { key: "initials", label: "Initialen", type: "text" },
      ],
    },
  ],
};

const servicesData: ContentPage = {
  id: "services",
  label: "Diensten / USPs",
  url: "/",
  category: "data",
  view: "data-list",
  description: "Beheer USP-blokjes (positiveReasons + differentiators) in services.json.",
  sections: [
    {
      id: "differentiators",
      label: "Differentiators",
      source: { ...SERVICES_JSON, anchor: "differentiators" },
      isArray: true,
      arrayItemLabel: "Differentiator",
      arrayItemTitleField: "title",
      fields: [
        { key: "icon", label: "Icoon", type: "text" },
        { key: "title", label: "Titel", type: "text", maxWords: 6 },
        { key: "body", label: "Beschrijving", type: "textarea", maxWords: 30 },
      ],
    },
  ],
};

const pricingData: ContentPage = {
  id: "pricing",
  label: "Pricing",
  url: "/prijzen",
  category: "data",
  view: "data-list",
  sections: [
    {
      id: "main",
      label: "Hoofdprijs",
      source: { ...SERVICES_JSON, anchor: "pricing.main" },
      fields: [
        { key: "price", label: "Prijs (zoals getoond)", type: "text" },
        { key: "unit", label: "Eenheid", type: "text" },
        { key: "subline", label: "Subtekst", type: "text", maxWords: 10 },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────
// Site
// ─────────────────────────────────────────────────────────────────────

const configPage: ContentPage = {
  id: "config",
  label: "Config",
  url: "/",
  category: "site",
  view: "site-config",
  sections: [
    {
      id: "contact",
      label: "Contactgegevens",
      source: { ...SITE_CONFIG_TS, exportName: "siteConfig", anchor: "contact" },
      fields: [
        { key: "phone", label: "Telefoon (zoals getoond)", type: "text" },
        { key: "phoneHref", label: "Telefoon link (tel:)", type: "phone" },
        { key: "email", label: "E-mailadres", type: "email" },
        { key: "emailHref", label: "Email link (mailto:)", type: "email" },
      ],
    },
    {
      id: "address",
      label: "Adres",
      source: {
        ...SITE_CONFIG_TS,
        exportName: "siteConfig",
        anchor: "contact.address",
      },
      fields: [
        { key: "street", label: "Straat", type: "text" },
        { key: "zip", label: "Postcode", type: "text" },
        { key: "city", label: "Stad", type: "text" },
      ],
    },
    {
      id: "social",
      label: "Sociale media",
      source: { ...SITE_CONFIG_TS, exportName: "siteConfig", anchor: "social" },
      fields: [
        { key: "instagram", label: "Instagram URL", type: "url" },
        { key: "linkedin", label: "LinkedIn URL", type: "url" },
      ],
    },
  ],
};

const imagesPage: ContentPage = {
  id: "images",
  label: "Afbeeldingen",
  url: "/",
  category: "site",
  view: "data-list",
  description: "Foto-bibliotheek volgt in stap 5.",
  sections: [],
};

const navigationPage: ContentPage = {
  id: "navigation",
  label: "Navigatie",
  url: "/",
  category: "site",
  view: "site-config",
  description: "Hoofdnavigatie en footer-links volgen in stap 3.",
  sections: [],
};

// ─────────────────────────────────────────────────────────────────────
// Public exports
// ─────────────────────────────────────────────────────────────────────

export const ADMIN_PAGES: ContentPage[] = [
  homepagePage,
  hetSpelPage,
  locatiesPage,
  prijzenPage,
  overPage,
  contactPage,
  englishPage,
  privacyPageEntry,
  voorwaardenPage,
  reviewsData,
  faqData,
  restaurantsData,
  locationsData,
  blogData,
  teamData,
  servicesData,
  pricingData,
  configPage,
  imagesPage,
  navigationPage,
];

export function getPageById(id: string): ContentPage | undefined {
  return ADMIN_PAGES.find((p) => p.id === id);
}

/**
 * Helper: combine an anchor with a field key into a full path inside a file.
 *
 *   anchor: "hero", field: "headline"      → "hero.headline"
 *   anchor: "",     field: "items[2].body" → "items[2].body"
 *   anchor: "list", field: "[0].title"     → "list[0].title"
 */
export function fullFieldPath(anchor: string, fieldKey: string): string {
  if (!anchor) return fieldKey;
  if (!fieldKey) return anchor;
  if (fieldKey.startsWith("[")) return `${anchor}${fieldKey}`;
  return `${anchor}.${fieldKey}`;
}
