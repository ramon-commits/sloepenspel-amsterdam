import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Container } from "@/components/Container";
import { Section, SectionEyebrow } from "@/components/Section";
import { JsonLdGroup } from "@/components/JsonLd";
import { overPage } from "@/content/pages";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Over Sloepenspel Amsterdam | Ons Verhaal",
  description:
    "600 verhalen, 12 gidsen, één missie: het beste bedrijfsuitje van Amsterdam. Lees hoe het begon.",
  alternates: { canonical: "/over" },
};

export default function OverPage() {
  return (
    <>
      <JsonLdGroup items={[breadcrumbLd([{ name: "Over ons", href: "/over" }])]} />
      <Nav />
      <main id="main-content">
        <Hero hero={overPage.hero} size="page" />

        <Section variant="white">
          <Container>
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5">
                <SectionEyebrow>{overPage.story.eyebrow}</SectionEyebrow>
                <h2 className="h2">
                  600 verhalen, samengesteld in <span className="headline-italic">coronatijd</span>.
                </h2>
              </div>
              <div className="lg:col-span-7 lg:pt-10">
                <p className="text-lg md:text-xl text-[color:var(--color-primary)]/80 leading-relaxed max-w-prose">
                  {overPage.story.body}
                </p>
              </div>
            </div>
          </Container>
        </Section>

        <Section variant="warm">
          <Container>
            <div className="max-w-3xl mb-14">
              <SectionEyebrow>{overPage.team.eyebrow}</SectionEyebrow>
              <h2 className="h2">
                <span className="headline-italic">Het</span> kernteam achter de middag.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {overPage.team.members.map((m, i) => (
                <article key={m.name} className="bg-white rounded-[var(--radius-card)] p-8 text-center">
                  <div
                    className={`w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center font-display text-3xl font-semibold ${
                      i === 0
                        ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-primary)]"
                        : i === 1
                        ? "bg-[color:var(--color-water)] text-[color:var(--color-primary)]"
                        : "bg-[color:var(--color-primary)] text-white"
                    }`}
                  >
                    {m.initials}
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-1">{m.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-[color:var(--color-accent)] mb-3">{m.role}</p>
                  <p className="text-sm text-[color:var(--color-primary)]/70 leading-relaxed">{m.bio}</p>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        <Section variant="white">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-10">
              <SectionEyebrow className="justify-center">{overPage.partners.eyebrow}</SectionEyebrow>
              <h2 className="h2">
                We werken met de <span className="headline-italic">besten</span> van Amsterdam.
              </h2>
              <p className="mt-6 text-lg text-[color:var(--color-primary)]/80 leading-relaxed">
                {overPage.partners.body}
              </p>
            </div>
          </Container>
        </Section>

        <Section variant="warm">
          <Container>
            <div className="max-w-3xl mb-14">
              <SectionEyebrow>{overPage.values.eyebrow}</SectionEyebrow>
              <h2 className="h2">
                <span className="headline-italic">Drie</span> dingen die niet onderhandelbaar zijn.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {overPage.values.items.map((item, i) => (
                <article key={item.title} className="bg-white rounded-[var(--radius-card)] p-8">
                  <span className="editorial-num text-3xl">{`0${i + 1}`}</span>
                  <h3 className="font-display text-xl font-semibold mt-3 mb-3">{item.title}</h3>
                  <p className="text-[color:var(--color-primary)]/70 text-sm leading-relaxed">{item.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        <Section variant="white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <SectionEyebrow className="justify-center">{overPage.why.eyebrow}</SectionEyebrow>
              <h2 className="h2">
                <span className="headline-italic">Eén</span> ding, perfect uitgevoerd.
              </h2>
              <p className="mt-6 text-lg text-[color:var(--color-primary)]/80 leading-relaxed">
                {overPage.why.body}
              </p>
            </div>
          </Container>
        </Section>

        <LogoMarquee eyebrow="In samenwerking met" variant="warm" />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
