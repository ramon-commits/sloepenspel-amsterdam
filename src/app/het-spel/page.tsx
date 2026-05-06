import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Faq } from "@/components/sections/Faq";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Container } from "@/components/Container";
import { Section, SectionEyebrow } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { JsonLdGroup } from "@/components/JsonLd";
import { hetSpelPage } from "@/content/pages";
import { breadcrumbLd, serviceLd, faqLd } from "@/lib/seo";
import faqData from "@/content/faq.json";

export const metadata: Metadata = {
  title: "Hoe Werkt het Sloepenspel? | Teamuitje Amsterdam",
  description:
    "Ontdek hoe de sloepengame van Amsterdam werkt: eigen sloep met iPad, live scorebord, sabotage-gadgets, 600 verhalen en acteurs op de route.",
  alternates: { canonical: "/het-spel" },
};

export default function HetSpelPage() {
  return (
    <>
      <JsonLdGroup
        items={[
          serviceLd(),
          faqLd(faqData.faqs),
          breadcrumbLd([{ name: "Het spel", href: "/het-spel" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <Hero hero={hetSpelPage.hero} size="page" />

        {hetSpelPage.sections.map((s, i) => {
          const reverse = i % 2 === 1;
          const variant = i % 2 === 0 ? "white" : "warm";
          return (
            <Section key={s.title} variant={variant}>
              <Container>
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                  <Reveal className={`lg:col-span-6 ${reverse ? "lg:order-2" : ""}`}>
                    <SectionEyebrow>
                      <span className="editorial-num text-base mr-2 not-italic">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.eyebrow}
                    </SectionEyebrow>
                    <h2 className="h2 mb-6">{s.title}</h2>
                    <p className="text-lg text-[color:var(--color-primary)]/80 leading-relaxed max-w-prose">
                      {s.body}
                    </p>
                  </Reveal>

                  <Reveal delay={120} className={`lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
                    <div className="relative aspect-[4/3] rounded-[var(--radius-image)] overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </Reveal>
                </div>
              </Container>
            </Section>
          );
        })}

        {/* Quick links section */}
        <Section variant="white">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <SectionEyebrow className="justify-center">Verder lezen</SectionEyebrow>
              <h2 className="h2 mb-6">
                Klaar voor de volgende <span className="headline-italic">stap</span>?
              </h2>
              <p className="text-lg text-[color:var(--color-muted)] mb-10">
                Bekijk de <Link href="/prijzen" className="link-reveal text-[color:var(--color-primary)]">prijzen</Link>, vind de juiste{" "}
                <Link href="/locaties-groepen" className="link-reveal text-[color:var(--color-primary)]">locatie</Link> voor jullie groep, of vraag direct{" "}
                <Link href="/contact#formulier" className="link-reveal text-[color:var(--color-primary)]">een offerte aan</Link>.
              </p>
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
