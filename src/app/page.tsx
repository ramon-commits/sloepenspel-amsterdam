import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Differentiator } from "@/components/sections/Differentiator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PhotoStrip } from "@/components/sections/PhotoStrip";
import { PainPoints } from "@/components/sections/PainPoints";
import { Reviews } from "@/components/sections/Reviews";
import { LocationFinder } from "@/components/sections/LocationFinder";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { homePage } from "@/content/pages";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        {/* 2. Hero */}
        <Hero hero={homePage.hero} size="full" />
        {/* 3. Logo-marquee */}
        <LogoMarquee />
        {/* 4. Differentiator (incl. grote foto eronder) */}
        <Differentiator />
        {/* 6. Hoe het werkt */}
        <HowItWorks />
        {/* 7. Vol-breedte foto-strip */}
        <PhotoStrip
          src="/images/groep-meerdere-sloepen.jpg"
          alt="Groep deelnemers in meerdere sloepen op de Amsterdamse grachten"
        />
        {/* 8. Pijnpunten */}
        <PainPoints />
        {/* 9. Beoordelingen */}
        <Reviews />
        {/* 10. Locatie-tool */}
        <LocationFinder />
        {/* 11. Prijzen */}
        <Pricing />
        {/* 12. Partner logo-balk */}
        <LogoMarquee eyebrow="In samenwerking met onze partners" variant="warm" />
        {/* 13. FAQ */}
        <Faq />
        {/* 14. Blog teaser */}
        <BlogTeaser />
        {/* 15. Sluit-CTA */}
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
