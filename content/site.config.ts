export type NavLink = { label: string; href: string };

export const siteConfig = {
  name: "Sloepenspel Amsterdam",
  tagline: "Het interactieve bedrijfsuitje op het water",
  url: "https://sloepenspel.nl",
  contact: {
    phone: "020 - 123 45 67",
    phoneHref: "tel:+31201234567",
    email: "amsterdam@sloepenspel.nl",
    emailHref: "mailto:amsterdam@sloepenspel.nl",
    address: {
      street: "Mauritskade 56",
      zip: "1092 AD",
      city: "Amsterdam",
    },
    hours: "Ma–Vr 09:00 – 18:00",
  },
  social: {
    instagram: "https://instagram.com/sloepenspel",
    linkedin: "https://linkedin.com/company/sloepenspel",
  },
  cta: {
    primary: "Vraag een offerte aan",
    primaryHref: "/contact#formulier",
    secondary: "Hoe werkt het",
    secondaryHref: "/het-spel",
  },
  nav: [
    { label: "Het spel", href: "/het-spel" },
    { label: "Locaties & groepen", href: "/locaties-groepen" },
    { label: "Prijzen", href: "/prijzen" },
    { label: "Over ons", href: "/over" },
    { label: "Contact", href: "/contact" },
  ] as NavLink[],
  footerNav: {
    spel: [
      { label: "Het spel", href: "/het-spel" },
      { label: "Bedrijfsuitje varen", href: "/bedrijfsuitje-varen" },
      { label: "Origineel bedrijfsuitje", href: "/origineel-bedrijfsuitje" },
    ],
    info: [
      { label: "Locaties & groepen", href: "/locaties-groepen" },
      { label: "Prijzen", href: "/prijzen" },
      { label: "Over ons", href: "/over" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Contact", href: "/contact" },
    ],
  },
  languages: [
    { label: "NL", href: "/" },
    { label: "EN", href: "/en" },
  ],
} as const;
