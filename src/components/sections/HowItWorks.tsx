import Image from "next/image";
import services from "@/content/services.json";
import { Container } from "../Container";
import { Section, SectionEyebrow, SectionHeadline } from "../Section";
import { homePage } from "@/content/pages";
import { Reveal } from "../Reveal";

const stepImages = [
  "/images/acteurs-petjes.png",
  "/images/team-met-ipad.jpeg",
  "/images/sloep-montelbaanstoren.png",
  "/images/sloep-met-eten.jpg",
];

export function HowItWorks() {
  return (
    <Section variant="white" id="hoe-het-werkt">
      <Container>
        <Reveal>
          <div className="max-w-3xl mb-16">
            <SectionEyebrow>{homePage.howItWorks.eyebrow}</SectionEyebrow>
            <h2 className="h2">
              <span className="headline-italic">Zo</span> ziet jullie middag eruit.
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          <div
            className="absolute left-[19px] md:left-[31px] top-2 bottom-2 w-[2px] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(184,212,227,0.95) 0%, rgba(184,212,227,0.7) 50%, rgba(184,212,227,0.25) 100%)",
            }}
            aria-hidden
          />

          <div className="space-y-16 md:space-y-20">
            {services.howItWorks.map((step, i) => (
              <Reveal key={step.step} delay={i * 80}>
                <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
                  <div className="md:col-span-1 flex items-start gap-4">
                    <div className="relative w-10 h-10 md:w-16 md:h-16 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center font-display italic text-base md:text-2xl font-medium shrink-0 ring-4 ring-white">
                      {step.step}
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <p className="eyebrow text-[color:var(--color-accent)] mb-3">
                      {step.time}
                    </p>
                    <h3 className="h3 mb-4">{step.title}</h3>
                    <p className="text-[color:var(--color-primary)]/75 leading-relaxed text-base md:text-lg max-w-prose">
                      {step.body}
                    </p>
                  </div>
                  <div className="md:col-span-6">
                    <div className="relative aspect-[4/3] rounded-[var(--radius-image)] overflow-hidden">
                      <Image
                        src={stepImages[i]}
                        alt=""
                        fill
                        sizes="(max-width:768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
