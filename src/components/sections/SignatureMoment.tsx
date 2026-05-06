"use client";

import { useState } from "react";
import services from "@/content/services.json";
import { Container } from "../Container";
import { Section, SectionEyebrow, SectionHeadline } from "../Section";
import { homePage } from "@/content/pages";

const PINS = [
  { id: "amstelhaven", x: 72, y: 58 },
  { id: "tolhuistuin", x: 52, y: 22 },
  { id: "westerdok", x: 28, y: 36 },
  { id: "ij-haven", x: 78, y: 30 },
  { id: "lloyd", x: 86, y: 44 },
  { id: "nemo", x: 60, y: 40 },
];

const SLOEP_PATHS = [
  { x: 35, y: 50, delay: 0 },
  { x: 50, y: 55, delay: 0.5 },
  { x: 65, y: 48, delay: 1 },
  { x: 42, y: 42, delay: 1.5 },
];

export function SignatureMoment() {
  const [active, setActive] = useState<string>(services.locations[0].id);
  const activeLocation = services.locations.find((l) => l.id === active)!;

  return (
    <Section variant="water" id="signature" withGrain className="overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <SectionEyebrow>{homePage.signatureMoment.eyebrow}</SectionEyebrow>
            <SectionHeadline italic={homePage.signatureMoment.italicWord}>
              {homePage.signatureMoment.headline}
            </SectionHeadline>
            <p className="mt-6 text-lg text-[color:var(--color-primary)]/80 max-w-md leading-relaxed">
              {homePage.signatureMoment.body}
            </p>

            <div className="mt-8 p-6 bg-white rounded-[var(--radius-card)] border border-[color:var(--color-primary)]/10">
              <p className="text-xs font-medium tracking-[0.15em] uppercase text-[color:var(--color-accent)] mb-2">
                {activeLocation.area}
              </p>
              <h3 className="font-display text-2xl font-semibold mb-2">{activeLocation.name}</h3>
              <p className="text-sm text-[color:var(--color-primary)]/70 leading-relaxed">
                {activeLocation.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] bg-[color:var(--color-water)]">
              <svg viewBox="0 0 100 75" className="absolute inset-0 w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Grachten, concentric arcs */}
                <g stroke="rgba(27, 42, 74, 0.18)" strokeWidth="0.5" fill="none">
                  <path d="M 0 60 Q 50 35 100 60" />
                  <path d="M 0 55 Q 50 28 100 55" />
                  <path d="M 0 50 Q 50 20 100 50" />
                  <path d="M 0 45 Q 50 12 100 45" />
                </g>
                {/* IJ */}
                <path d="M 0 18 L 100 12 L 100 4 L 0 6 Z" fill="rgba(27, 42, 74, 0.08)" />
                {/* Bridges */}
                <g stroke="rgba(27, 42, 74, 0.4)" strokeWidth="0.3">
                  <line x1="20" y1="60" x2="20" y2="44" />
                  <line x1="50" y1="62" x2="50" y2="20" />
                  <line x1="80" y1="60" x2="80" y2="44" />
                </g>
              </svg>

              {/* Sloepjes drijvend */}
              {SLOEP_PATHS.map((s, i) => (
                <div
                  key={i}
                  className="absolute float-sloep"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    animationDelay: `${s.delay}s`,
                  }}
                >
                  <svg width="32" height="14" viewBox="0 0 32 14" fill="none">
                    <path d="M 1 7 Q 3 12 16 12 Q 29 12 31 7 L 28 6 L 4 6 Z" fill="#FFFFFF" stroke="#1B2A4A" strokeWidth="0.8" />
                    <line x1="16" y1="6" x2="16" y2="2" stroke="#1B2A4A" strokeWidth="0.6" />
                    <circle cx="16" cy="1.5" r="1" fill="#E8866A" />
                  </svg>
                </div>
              ))}

              {/* Locatie pinnen */}
              {PINS.map((pin) => {
                const loc = services.locations.find((l) => l.id === pin.id)!;
                const isActive = active === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={() => setActive(pin.id)}
                    aria-label={loc.name}
                    className="absolute group"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%, -100%)" }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-[color:var(--color-accent)] scale-125 ring-4 ring-[color:var(--color-accent)]/30"
                          : "bg-[color:var(--color-primary)] hover:scale-110"
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-xs font-medium px-2 py-1 rounded bg-white shadow-sm transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {loc.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
