import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { LocationFinder } from "@/components/sections/LocationFinder";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Container } from "@/components/Container";
import { Section, SectionEyebrow } from "@/components/Section";
import { JsonLdGroup } from "@/components/JsonLd";
import { locatiesGroepenPage } from "@/content/pages";
import services from "@/content/services.json";
import { breadcrumbLd, locationLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Locaties en Groepsgroottes | Sloepenspel Amsterdam",
  description:
    "6 opstaplocaties in Amsterdam voor 30-500+ personen. Bekijk welke locatie bij jullie groepsgrootte past en vind restaurants in de buurt.",
  alternates: { canonical: "/locaties-groepen" },
};

const groupDescriptions: Record<string, string> = {
  xs: "Kleine teams, intieme afsluitingen, vaak op één locatie.",
  s: "Standaard format, 4 tot 8 sloepen, één vertreklocatie.",
  m: "Tussenformaat, twee vertreklocaties of een gespreide start.",
  l: "Volledige bedrijfsdag, tot 60+ sloepen via meerdere locaties.",
};

export default function LocatiesGroepenPage() {
  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd([{ name: "Locaties & groepen", href: "/locaties-groepen" }]),
          ...services.locations.map((l) => locationLd(l)),
        ]}
      />
      <Nav />
      <main id="main-content">
        <Hero hero={locatiesGroepenPage.hero} size="page" />

        <Section variant="white">
          <Container>
            <div className="max-w-3xl mb-12">
              <SectionEyebrow>{locatiesGroepenPage.groups.eyebrow}</SectionEyebrow>
              <h2 className="h2">
                <span className="headline-italic">Van</span> afdeling tot heel bedrijf.
              </h2>
              <p className="mt-6 text-lg text-[color:var(--color-muted)] max-w-prose">
                {locatiesGroepenPage.groups.body}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[color:var(--color-primary)]/10 rounded-[var(--radius-card)] overflow-hidden">
              {services.groupSizes.map((g, i) => (
                <article
                  key={g.id}
                  className="bg-white p-7 flex flex-col gap-3 hover:bg-[color:var(--color-bg-warm)] transition-colors"
                >
                  <span className="editorial-num text-2xl not-italic">0{i + 1}</span>
                  <h3 className="font-display text-2xl font-semibold leading-tight">
                    {g.shortLabel}
                  </h3>
                  <p className="text-sm text-[color:var(--color-primary)]/72 leading-relaxed">
                    {groupDescriptions[g.id]}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        <LocationFinder />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
