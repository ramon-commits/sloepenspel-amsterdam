import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import services from "@/content/services.json";
import { Container } from "../Container";
import { Section, SectionEyebrow } from "../Section";
import { homePage } from "@/content/pages";
import { Reveal } from "../Reveal";

export function Differentiator() {
  return (
    <Section variant="warm" id="differentiator">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionEyebrow>{homePage.differentiator.eyebrow}</SectionEyebrow>
              <h2 className="h2">
                Wat het Sloepenspel{" "}
                <span className="headline-italic">bijzonder</span> maakt.
              </h2>
              <p className="mt-6 text-lg text-[color:var(--color-muted)] max-w-xl leading-relaxed">
                Drie dingen die het Sloepenspel onderscheiden van een rondvaart of een gewoon teamuitje. <Link href="/het-spel" className="link-reveal text-[color:var(--color-primary)]">Hoe het werkt</Link>.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <ul className="space-y-6">
              {services.differentiators.map((d, i) => (
                <Reveal as="li" key={d.title} delay={i * 90} className="flex items-start gap-4 group">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-[color:var(--color-accent)] text-white flex items-center justify-center mt-0.5 transition-transform duration-300 group-hover:scale-110">
                    <FontAwesomeIcon icon={faCheck} className="text-sm" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-semibold leading-tight tracking-tight mb-1.5">
                      {d.title}
                    </h3>
                    <p className="text-[color:var(--color-primary)]/72 leading-relaxed text-base">
                      {d.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        <Reveal delay={200}>
          <div className="mt-16 md:mt-20 relative aspect-[16/8] rounded-[var(--radius-image)] overflow-hidden">
            <Image
              src="/images/sloep-gracht-zonnig.png"
              alt="Bedrijfsuitje varen Amsterdam, sloep op een zonnige Amsterdamse gracht"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-primary)]/20 to-transparent pointer-events-none" />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
