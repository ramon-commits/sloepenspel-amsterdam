import Image from "next/image";
import { Container } from "../../Container";
import { Section, SectionEyebrow } from "../../Section";
import { Reveal } from "../../Reveal";
import { enHomePage, enPositiveReasons } from "@/content/en";

export function EnPainPoints() {
  return (
    <Section variant="white" id="why">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionEyebrow>{enHomePage.positiveReasons.eyebrow}</SectionEyebrow>
              <h2 className="h2 mb-12">
                Why teams choose the{" "}
                <span className="headline-italic">Sloepenspel</span>.
              </h2>
            </Reveal>

            <ol className="space-y-10">
              {enPositiveReasons.map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 90} className="grid grid-cols-[auto_1fr] gap-5 md:gap-7 items-baseline">
                  <span className="editorial-num text-5xl md:text-6xl leading-none">
                    {p.id}
                  </span>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-2">
                      {p.title}
                    </h3>
                    <p className="text-[color:var(--color-primary)]/72 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal delay={120} className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative aspect-[3/4] rounded-[var(--radius-image)] overflow-hidden">
              <Image
                src="/images/sloep-dichtbij.jpg"
                alt="Canal boat rally Amsterdam, your own boat on the canal for a team adventure"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[color:var(--color-primary)]/85 via-[color:var(--color-primary)]/35 to-transparent">
                <p className="text-white text-xs tracking-[0.2em] uppercase font-medium">
                  Sail-ready in five minutes
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
