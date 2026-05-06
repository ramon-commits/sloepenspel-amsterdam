import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { ConsentAnalytics } from "@/components/ConsentAnalytics";
import { CookieBanner } from "@/components/CookieBanner";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "./globals.css";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { JsonLdGroup } from "@/components/JsonLd";
import {
  organizationLd,
  localBusinessLd,
  websiteLd,
  serviceLd,
} from "@/lib/seo";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sloepenspel.nl"),
  title: {
    default: "Sloepenspel Amsterdam | Hét Bedrijfsuitje op het Water",
    template: "%s | Sloepenspel Amsterdam",
  },
  description:
    "Het interactieve bedrijfsuitje van Amsterdam. Eigen sloep, 600 verhalen, voor 30-500 personen. €59,50 p.p. all-in. Vraag een offerte aan.",
  applicationName: "Sloepenspel Amsterdam",
  authors: [{ name: "Sloepenspel Amsterdam", url: "https://sloepenspel.nl" }],
  keywords: [
    "bedrijfsuitje Amsterdam",
    "bedrijfsuitje varen",
    "origineel bedrijfsuitje",
    "teamuitje grachten",
    "sloepen huren Amsterdam",
    "bedrijfsuitje op het water",
    "interactief bedrijfsuitje",
    "teambuilding Amsterdam",
  ],
  creator: "Sloepenspel Amsterdam",
  publisher: "Sloepenspel Amsterdam",
  formatDetection: { telephone: true, address: true, email: true },
  alternates: {
    canonical: "/",
    languages: {
      "nl-NL": "/",
      "en-US": "/en",
      "x-default": "/",
    },
    types: {
      "application/rss+xml": "/feed.xml",
      "application/feed+json": "/feed.json",
    },
  },
  openGraph: {
    title: "Sloepenspel Amsterdam",
    description: "Het interactieve bedrijfsuitje op het water, 30 tot 500 personen.",
    siteName: "Sloepenspel Amsterdam",
    locale: "nl_NL",
    type: "website",
    url: "/",
    images: [
      {
        url: "/images/hero-bedrijfsuitje-v5.jpg",
        width: 1920,
        height: 1080,
        alt: "Teams op sloepen aan de Amsterdamse kade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sloepenspel Amsterdam",
    description: "Het interactieve bedrijfsuitje op het water, 30 tot 500 personen.",
    images: ["/images/hero-bedrijfsuitje-v5.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="nl"
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        {/* Hero image preload — dramatically improves LCP on the homepage */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-bedrijfsuitje-v5.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[color:var(--color-bg)] text-[color:var(--color-text)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[color:var(--color-primary)] focus:text-white focus:font-medium focus:shadow-lg"
        >
          Naar hoofdinhoud
        </a>
        <JsonLdGroup
          items={[organizationLd(), localBusinessLd(), websiteLd(), serviceLd()]}
        />
        {children}
        <MobileCtaBar />
        <CookieBanner />
        <ConsentAnalytics />
      </body>
    </html>
  );
}
