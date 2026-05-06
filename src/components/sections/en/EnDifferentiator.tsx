import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../../Container";
import { Section, SectionEyebrow } from "../../Section";
import { Reveal } from "../../Reveal";
import { enHomePage, enDifferentiators } from "@/content/en";

export function EnDifferentiator() {
  return (
    <Section variant="warm" id="differentiator">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionEyebrow>{enHomePage.differentiator.eyebrow}</SectionEyebrow>
              <h2 className="h2">
                What makes this canal boat rally{" "}
                <span className="headline-italic">special</span>.
              </h2>
              <p className="mt-6 text-lg text-[color:var(--color-muted)] max-w-xl leading-relaxed">
                Three things that set this team adventure apart from a tour or an ordinary teambuilding day. <Link href="/het-spel" className="link-reveal text-[color:var(--color-primary)]">How it works</Link>.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <ul className="space-y-6">
              {enDifferentiators.map((d, i) => (
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
              alt="Canal boat rally Amsterdam, boat on a sunny canal"
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
