import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { PhotoStrip } from "@/components/sections/PhotoStrip";
import { LocationFinder } from "@/components/sections/LocationFinder";
import { EnDifferentiator } from "@/components/sections/en/EnDifferentiator";
import { EnHowItWorks } from "@/components/sections/en/EnHowItWorks";
import { EnPainPoints } from "@/components/sections/en/EnPainPoints";
import { EnReviews } from "@/components/sections/en/EnReviews";
import { EnPricing } from "@/components/sections/en/EnPricing";
import { EnFaq } from "@/components/sections/en/EnFaq";
import { EnClosingCta } from "@/components/sections/en/EnClosingCta";
import { enHomePage } from "@/content/en";
import { absUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Sloepenspel Amsterdam | The Canal Boat Rally for Teams" },
  description:
    "The interactive canal boat rally of Amsterdam. Your own boat, 600 stories, for 30-500 people. €59.50 p.p. all-in.",
  alternates: {
    canonical: "/en",
    languages: { "nl-NL": "/", "en-US": "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en",
    title: "Sloepenspel Amsterdam | The Canal Boat Rally for Teams",
    description:
      "The interactive canal boat rally of Amsterdam. Your own boat, 600 stories, for 30-500 people.",
    images: [{ url: absUrl("/images/hero-bedrijfsuitje-v5.jpg") }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sloepenspel Amsterdam | The Canal Boat Rally for Teams",
    description:
      "The interactive canal boat rally of Amsterdam. Your own boat, 600 stories, for 30-500 people.",
    images: [absUrl("/images/hero-bedrijfsuitje-v5.jpg")],
  },
};

export default function HomeEN() {
  return (
    <>
      <Nav locale="en" />
      <main id="main-content">
        <Hero hero={enHomePage.hero} size="full" />
        <LogoMarquee eyebrow={enHomePage.marquee.eyebrow} />
        <EnDifferentiator />
        <EnHowItWorks />
        <PhotoStrip
          src="/images/groep-meerdere-sloepen.jpg"
          alt="Group of participants in multiple boats on the Amsterdam canals"
        />
        <EnPainPoints />
        <EnReviews />
        <LocationFinder />
        <EnPricing />
        <LogoMarquee eyebrow="In partnership with" variant="warm" />
        <EnFaq />
        <EnClosingCta />
      </main>
      <Footer />
    </>
  );
}
