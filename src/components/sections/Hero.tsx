import Image from "next/image";
import { Container } from "../Container";
import { Button } from "../Button";
import Link from "next/link";

type HeroData = {
  italicWord?: string;
  headline: string;
  subheadline: string;
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  image: string;
  imageAlt?: string;
  imagePosition?: string;
  overlayOpacity?: number;
};

export function Hero({
  hero,
  size = "full",
}: {
  hero: HeroData;
  size?: "full" | "page";
}) {
  const isFull = size === "full";
  const minH = isFull ? "min-h-screen" : "min-h-[64vh] md:min-h-[72vh]";
  const overlay = hero.overlayOpacity ?? (isFull ? 0.35 : 0.5);
  const objectPos = hero.imagePosition ?? "center 30%";

  return (
    <section className={`relative ${minH} flex items-end overflow-hidden`}>
      <Image
        src={hero.image}
        alt={hero.imageAlt || ""}
        fill
        priority
        sizes="100vw"
        className="object-cover hero-image"
        style={{ objectPosition: objectPos }}
      />
      {/* Editorial vignette: lighter at top, deeper at bottom-left where copy lives */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(27,42,74,${overlay * 0.5}) 0%, rgba(27,42,74,0) 35%, rgba(27,42,74,${overlay}) 100%),
            radial-gradient(circle at 18% 88%, rgba(27,42,74,${Math.min(overlay + 0.25, 0.85)}) 0%, rgba(27,42,74,0) 55%)
          `,
        }}
        aria-hidden
      />
      <div className="absolute inset-0 grain pointer-events-none" aria-hidden />

      <Container className="relative z-10 pb-20 md:pb-28 lg:pb-32 pt-32">
        <div className="max-w-[60rem]">
          <h1 className="text-white">
            {hero.italicWord && (
              <span className="hero-italic-num block mb-2 text-[color:var(--color-accent-soft)] hero-anim hero-anim-1">
                {hero.italicWord}
              </span>
            )}
            <span className="h1 block hero-anim hero-anim-2">
              {hero.headline}
            </span>
          </h1>
          <p className="mt-6 md:mt-7 text-base md:text-xl text-white/90 max-w-2xl leading-relaxed hero-anim hero-anim-3">
            {hero.subheadline}
          </p>
          {(hero.primaryCta || hero.secondaryCta) && (
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-5 hero-anim hero-anim-4">
              {hero.primaryCta && hero.primaryHref && (
                <Button href={hero.primaryHref} variant="primary">
                  {hero.primaryCta}
                </Button>
              )}
              {hero.secondaryCta && hero.secondaryHref && (
                <Link
                  href={hero.secondaryHref}
                  className="text-white text-sm font-medium border-b border-white/40 pb-1 hover:border-white transition-colors min-h-[44px] inline-flex items-center"
                >
                  {hero.secondaryCta} →
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Scroll cue, subtle, editorial */}
      {isFull && (
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 hidden md:flex flex-col items-center gap-3 text-white/65 hero-anim hero-anim-4">
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium">scroll</span>
          <span className="block w-px h-12 bg-white/40 origin-top scroll-line" />
        </div>
      )}
    </section>
  );
}
