import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../Container";
import { Button } from "../Button";
import { homePage } from "@/content/pages";
import { siteConfig } from "@/content/site.config";

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-primary)] text-white">
      <Image
        src="/images/hero-grachten-golden-hour.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "center 40%" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "rgba(27, 42, 74, 0.6)" }}
        aria-hidden
      />
      <div className="absolute inset-0 grain pointer-events-none" aria-hidden />

      <Container className="relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl">
          <p className="eyebrow text-[color:var(--color-accent-soft)] mb-6">Eén stap verder</p>
          <h2 className="h1">
            <span className="headline-italic text-[color:var(--color-accent-soft)]">Klaar</span>{" "}
            voor het water? Wij ook.
          </h2>
          <p className="mt-6 md:mt-7 text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
            {homePage.closingCta.body}
          </p>

          <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-6">
            <Button href={siteConfig.cta.primaryHref} variant="primary">
              {siteConfig.cta.primary}
            </Button>
            <a
              href={siteConfig.contact.phoneHref}
              className="flex items-center gap-3 text-base md:text-lg font-medium hover:text-[color:var(--color-accent-soft)] transition-colors min-h-[44px]"
            >
              <span className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center transition-colors group-hover:border-[color:var(--color-accent-soft)]">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
