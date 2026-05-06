import services from "@/content/services.json";
import { Container } from "../Container";
import { Section } from "../Section";
import { Reveal } from "../Reveal";

export function TrustNumbers() {
  return (
    <Section variant="warm" id="cijfers" className="!py-16 md:!py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(184,212,227,0.30) 0%, rgba(184,212,227,0.06) 60%, rgba(184,212,227,0) 100%)",
        }}
        aria-hidden
      />
      <Container className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {services.stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 100}
              className={`${i % 2 === 1 ? "lg:mt-12" : ""} ${i === 2 ? "lg:mt-6" : ""}`}
            >
              <div className="flex flex-col gap-3">
                <div className="headline text-5xl md:text-6xl lg:text-7xl text-[color:var(--color-primary)] leading-none">
                  {stat.value}
                </div>
                <div className="text-sm text-[color:var(--color-muted)] leading-snug max-w-[180px]">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
