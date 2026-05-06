import services from "@/content/services.json";
import { Container } from "../Container";

const ITEMS = [
  { value: services.stats[0].value, label: "verhalen" },
  { value: "30 – 500", label: "personen" },
  { value: services.stats[2].value, label: "all-in" },
  { value: services.stats[3].value, label: "locaties" },
];

export function TrustBar() {
  return (
    <section className="bg-[color:var(--color-primary)] text-white py-4 md:py-5 relative">
      <Container>
        <ul className="flex items-center justify-between gap-4 md:gap-10 flex-wrap md:flex-nowrap">
          {ITEMS.map((item, i) => (
            <li
              key={item.label}
              className="flex items-baseline gap-2 text-sm md:text-base flex-1 min-w-[140px]"
            >
              <span className="font-display font-semibold tracking-tight text-[color:var(--color-accent-soft)]">
                {item.value}
              </span>
              <span className="text-white/75">{item.label}</span>
              {i < ITEMS.length - 1 && (
                <span className="hidden md:inline ml-auto text-white/20" aria-hidden>·</span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
