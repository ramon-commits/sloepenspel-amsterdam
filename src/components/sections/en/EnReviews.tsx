import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../../Container";
import { Section, SectionEyebrow } from "../../Section";
import { Reveal } from "../../Reveal";
import { enHomePage, enReviews } from "@/content/en";

const portraitColors = [
  "bg-[color:var(--color-accent-soft)] text-[color:var(--color-primary)]",
  "bg-[color:var(--color-water)] text-[color:var(--color-primary)]",
  "bg-[color:var(--color-primary)] text-white",
  "bg-[color:var(--color-accent)] text-white",
];

export function EnReviews() {
  return (
    <Section variant="warm" id="reviews">
      <Container>
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-10 mb-12">
            <div className="lg:col-span-5">
              <SectionEyebrow>{enHomePage.reviews.eyebrow}</SectionEyebrow>
              <h2 className="h2">
                <span className="headline-italic">What</span> teams say afterwards.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-12">
              <div className="flex items-center gap-3">
                <div className="flex gap-1 text-[color:var(--color-accent)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
                <span className="font-semibold">4.9</span>
                <span className="text-[color:var(--color-muted)] text-sm">
                  average across 247 bookings
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {enReviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 100}>
              <article className="bg-white rounded-[var(--radius-card)] p-8 relative card-hover h-full">
                <FontAwesomeIcon
                  icon={faQuoteRight}
                  className="absolute top-8 right-8 text-3xl text-[color:var(--color-accent-soft)]"
                />
                <div className="flex gap-1 text-[color:var(--color-accent)] mb-4">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <FontAwesomeIcon key={idx} icon={faStar} className="text-sm" />
                  ))}
                </div>
                <p className="font-display text-xl md:text-2xl leading-snug tracking-tight mb-6">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-semibold text-lg ${portraitColors[i % portraitColors.length]}`}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-[color:var(--color-muted)]">
                      {r.role} · {r.company}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
