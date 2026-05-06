import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Container } from "@/components/Container";
import { Section, SectionEyebrow } from "@/components/Section";
import { JsonLdGroup } from "@/components/JsonLd";
import { prijzenPage } from "@/content/pages";
import { breadcrumbLd, serviceLd, faqLd } from "@/lib/seo";
import faqData from "@/content/faq.json";

export const metadata: Metadata = {
  title: "Prijzen Sloepenspel Amsterdam | €59,50 p.p. All-in",
  description:
    "Transparante prijs voor het Sloepenspel: €59,50 per persoon, alles inbegrepen. Geen verborgen kosten.",
  alternates: { canonical: "/prijzen" },
};

export default function PrijzenPage() {
  return (
    <>
      <JsonLdGroup
        items={[
          serviceLd(),
          faqLd(faqData.faqs),
          breadcrumbLd([{ name: "Prijzen", href: "/prijzen" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <section className="pt-40 pb-20 md:pt-48 md:pb-24 bg-[color:var(--color-bg-warm)] grain relative">
          <Container>
            <div className="max-w-4xl">
              <p className="eyebrow text-[color:var(--color-muted)] mb-5">Wat het kost</p>
              <h1 className="h1">
                <span className="headline-italic">Eén</span> prijs. Alles erin.
              </h1>
              <p className="mt-7 text-lg md:text-xl text-[color:var(--color-primary)]/80 max-w-2xl leading-relaxed">
                {prijzenPage.hero.subheadline}
              </p>
            </div>
          </Container>
        </section>

        <Pricing />

        <Section variant="warm">
          <Container>
            <div className="max-w-3xl mx-auto">
              <SectionEyebrow className="justify-center">{prijzenPage.notes.eyebrow}</SectionEyebrow>
              <h2 className="h2 text-center mb-10">
                Een paar dingen die je vooraf moet <span className="headline-italic">weten</span>.
              </h2>
              <ul className="space-y-3">
                {prijzenPage.notes.items.map((item) => (
                  <li
                    key={item}
                    className="bg-white rounded-[var(--radius-card)] p-5 flex items-start gap-4"
                  >
                    <span className="editorial-num text-2xl shrink-0">·</span>
                    <span className="text-[color:var(--color-primary)]/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>

        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
