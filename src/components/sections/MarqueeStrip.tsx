const STRIP_ITEMS = [
  "600 verhalen",
  "één middag",
  "zes locaties",
  "één team",
];

export function MarqueeStrip() {
  // Repeat enough to fill any width and loop seamlessly
  const items = Array.from({ length: 8 }).flatMap(() => STRIP_ITEMS);
  return (
    <div className="bg-[color:var(--color-primary)] overflow-hidden py-5 md:py-6 border-y border-white/10">
      <div className="flex gap-10 md:gap-14 animate-marquee-fast whitespace-nowrap w-max">
        {items.map((label, i) => (
          <div key={i} className="flex items-center gap-10 md:gap-14 shrink-0">
            <span className="font-display text-2xl md:text-3xl font-medium tracking-tight text-[color:var(--color-accent)]">
              {label}
            </span>
            <span className="text-[color:var(--color-accent)] text-2xl md:text-3xl leading-none" aria-hidden>·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
