"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Container } from "./Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faUtensils,
  faArrowRight,
  faUsers,
  faEuroSign,
} from "@fortawesome/free-solid-svg-icons";
import { Reveal } from "./Reveal";

type RestaurantCard = {
  slug: string;
  name: string;
  keuken: string;
  sfeer: string;
  bijzonderDetail: string;
  capacity: string;
  maxGroup: number;
  prijsklasse: string;
  groepsruimte: boolean;
  locationId: string;
  locationName: string;
  hero: string;
};

type LocationOption = { id: string; name: string };

export function RestaurantsBrowser({
  items,
  locations,
}: {
  items: RestaurantCard[];
  locations: LocationOption[];
}) {
  const [activeLocation, setActiveLocation] = useState<string>("all");

  const visible = useMemo(
    () =>
      activeLocation === "all"
        ? items
        : items.filter((r) => r.locationId === activeLocation),
    [items, activeLocation]
  );

  return (
    <>
      {/* Header */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-16 bg-[color:var(--color-bg-warm)] grain relative">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="text-xs tracking-[0.15em] uppercase text-[color:var(--color-muted)] mb-8 flex items-center gap-2"
          >
            <Link
              href="/"
              className="hover:text-[color:var(--color-primary)] transition-colors"
            >
              Home
            </Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-[8px] opacity-50" />
            <span className="text-[color:var(--color-primary)]">Restaurants</span>
          </nav>
          <div className="max-w-[820px]">
            <p className="eyebrow text-[color:var(--color-muted)] mb-5">
              Na het Sloepenspel
            </p>
            <h1 className="h1 mb-6">
              Dineren na jullie{" "}
              <span className="headline-italic">Sloepenspel</span>.
            </h1>
            <p className="text-lg text-[color:var(--color-primary)]/80 leading-relaxed max-w-prose">
              Een goed bedrijfsuitje verdient een goede afsluiting. Bij elke
              Sloepenspel-locatie hebben we vaste restaurantpartners die
              geschikt zijn voor jullie groepsgrootte. Van bruincafé tot beach
              club, voor 30 tot 300 personen.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter strip */}
      <section className="border-b border-[color:var(--color-primary)]/10 sticky top-[72px] md:top-[80px] z-30 bg-white/85 backdrop-blur-md">
        <Container>
          <div className="py-4 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-[color:var(--color-muted)] mr-2">
              Filter op locatie
            </span>
            <button
              onClick={() => setActiveLocation("all")}
              aria-pressed={activeLocation === "all"}
              className={`btn-pill !py-2 !px-4 text-xs ${
                activeLocation === "all"
                  ? "btn-primary"
                  : "bg-white border border-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)]"
              }`}
            >
              Alle ({items.length})
            </button>
            {locations.map((loc) => {
              const count = items.filter((r) => r.locationId === loc.id).length;
              if (count === 0) return null;
              const isActive = activeLocation === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocation(loc.id)}
                  aria-pressed={isActive}
                  className={`btn-pill !py-2 !px-4 text-xs ${
                    isActive
                      ? "btn-primary"
                      : "bg-white border border-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)]"
                  }`}
                >
                  {loc.name} ({count})
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Grid */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          {visible.length === 0 ? (
            <p className="text-[color:var(--color-muted)]">
              Geen restaurants in deze categorie.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visible.map((r, i) => (
                <Reveal key={r.slug} delay={(i % 6) * 70}>
                  <Link
                    href={`/restaurants/${r.slug}`}
                    className="group flex flex-col gap-4 h-full"
                  >
                    <div className="relative aspect-[16/11] rounded-[var(--radius-image)] overflow-hidden bg-[color:var(--color-bg-warm)]">
                      <Image
                        src={r.hero}
                        alt={`${r.name}, ${r.sfeer.toLowerCase()}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase font-medium text-[color:var(--color-primary)]">
                        {r.locationName}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <h2 className="font-display text-xl font-semibold leading-tight tracking-tight group-hover:text-[color:var(--color-accent)] transition-colors">
                          {r.name}
                        </h2>
                        <span className="text-[10px] tracking-[0.15em] uppercase text-[color:var(--color-muted)] shrink-0 font-medium">
                          {r.prijsklasse}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3 flex-wrap text-xs">
                        <span className="flex items-center gap-1.5 uppercase tracking-wider text-[color:var(--color-accent)] font-medium">
                          <FontAwesomeIcon icon={faUtensils} className="text-[10px]" />
                          {r.keuken}
                        </span>
                        <span className="text-[color:var(--color-primary)]/20">·</span>
                        <span className="flex items-center gap-1.5 text-[color:var(--color-muted)]">
                          <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
                          tot {r.maxGroup}
                        </span>
                      </div>
                      <p className="text-sm text-[color:var(--color-primary)]/72 leading-relaxed mb-4 flex-1">
                        {r.bijzonderDetail}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-accent)] self-start">
                        Bekijk
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-xs transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
