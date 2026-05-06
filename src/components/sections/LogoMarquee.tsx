import reviewsData from "@/content/reviews.json";
import { Container } from "../Container";
import { homePage } from "@/content/pages";

export function LogoMarquee({
  eyebrow,
  variant = "white",
}: { eyebrow?: string; variant?: "white" | "warm" } = {}) {
  // Duplicate twice, first half is what's visible, second half streams in seamlessly
  const logos = [...reviewsData.logos, ...reviewsData.logos];
  const bg = variant === "warm" ? "bg-[color:var(--color-bg-warm)]" : "bg-white";
  const fade = variant === "warm" ? "from-[color:var(--color-bg-warm)]" : "from-white";
  return (
    <section className={`${bg} py-12 md:py-16`} style={{ borderBottom: "none" }}>
      <Container>
        <p className="text-center text-xs font-medium tracking-[0.2em] uppercase text-[color:var(--color-muted)] mb-8">
          {eyebrow ?? homePage.marquee.eyebrow}
        </p>
      </Container>
      <div className="overflow-hidden relative" aria-hidden="true">
        <div className="flex gap-12 md:gap-16 animate-marquee whitespace-nowrap w-max items-center">
          {logos.map((logo, i) => (
            <span
              key={`${logo.name}-${i}`}
              className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-neutral-600 hover:text-neutral-800 transition-colors shrink-0"
            >
              {logo.name}
            </span>
          ))}
        </div>
        <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r ${fade} to-transparent pointer-events-none`} />
        <div className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l ${fade} to-transparent pointer-events-none`} />
      </div>
    </section>
  );
}
