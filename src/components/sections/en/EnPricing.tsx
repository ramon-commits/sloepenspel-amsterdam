import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../../Container";
import { Section, SectionEyebrow } from "../../Section";
import { Button } from "../../Button";
import { Reveal } from "../../Reveal";
import { siteConfig } from "@/content/site.config";
import { enHomePage, enPricing } from "@/content/en";

export function EnPricing() {
  return (
    <Section variant="white" id="prijzen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-14 md:mb-20">
              <SectionEyebrow className="justify-center">{enHomePage.pricing.eyebrow}</SectionEyebrow>
              <h2 className="h2 mb-6">
                <span className="headline-italic">One</span> price. Everything included.
              </h2>
              <p className="font-display text-[color:var(--color-accent)] text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight mb-3 italic">
                {enPricing.price}
              </p>
              <p className="font-display text-2xl md:text-3xl text-[color:var(--color-primary)]">
                {enPricing.unit}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-16">
              <div>
                <h3 className="font-display text-lg font-semibold mb-6 flex items-center gap-3 pb-4 border-b border-[color:var(--color-primary)]/15">
                  <span className="editorial-num text-3xl not-italic">i.</span>
                  Included
                </h3>
                <ul className="space-y-4">
                  {enPricing.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed">
                      <FontAwesomeIcon icon={faCheck} className="text-[color:var(--color-accent)] mt-1 shrink-0 text-sm" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold mb-6 flex items-center gap-3 pb-4 border-b border-[color:var(--color-primary)]/15">
                  <span className="editorial-num text-3xl not-italic text-[color:var(--color-muted)]">ii.</span>
                  Not included
                </h3>
                <ul className="space-y-4">
                  {enPricing.excludes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[color:var(--color-muted)]">
                      <FontAwesomeIcon icon={faXmark} className="text-[color:var(--color-muted)] mt-1 shrink-0 text-sm" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="text-center">
              <Button href={siteConfig.cta.primaryHref} variant="primary">
                Request a quote
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
