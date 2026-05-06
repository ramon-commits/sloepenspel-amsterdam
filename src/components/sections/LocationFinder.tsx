"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUtensils, faArrowRight, faBan } from "@fortawesome/free-solid-svg-icons";
import services from "@/content/services.json";
import { Container } from "../Container";
import { Section, SectionEyebrow } from "../Section";
import { homePage } from "@/content/pages";
import { LeafletMap } from "../LeafletMap";
import { restaurantBySlug } from "@/content/restaurants";

export function LocationFinder() {
  const [groupIdx, setGroupIdx] = useState(1); // default 30-60
  const [selectedLocId, setSelectedLocId] = useState<string | null>(null);

  const groupMax = services.groupSizes[groupIdx].max;

  const locations = useMemo(() => {
    return services.locations.map((loc) => ({
      ...loc,
      available: loc.maxGroup >= groupMax,
    }));
  }, [groupMax]);

  const restaurantSlugs =
    selectedLocId
      ? ((services.restaurantsByLocation as Record<string, string[]>)[selectedLocId] ?? [])
      : [];
  const restaurants = restaurantSlugs
    .map((s) => restaurantBySlug(s))
    .filter((r): r is NonNullable<ReturnType<typeof restaurantBySlug>> => Boolean(r));

  const selectedLoc = services.locations.find((l) => l.id === selectedLocId) || null;

  return (
    <Section variant="water-soft" id="locaties">
      <Container>
        <div className="max-w-3xl mb-10">
          <SectionEyebrow>{homePage.locationFinder.eyebrow}</SectionEyebrow>
          <h2 className="h2 mb-6">
            <span className="headline-italic">Vind</span> je plek op het{" "}
            <span className="headline-italic">water</span>
          </h2>
          <p className="text-lg text-[color:var(--color-muted)] max-w-xl leading-relaxed">
            Kies de groepsgrootte, bekijk welke vaarlocaties beschikbaar zijn, en zie meteen welke restaurants in de buurt liggen.
          </p>
        </div>

        {/* Step 1, group size */}
        <div className="mb-10 md:mb-12">
          <p className="eyebrow text-[color:var(--color-muted)] mb-4">
            <span className="editorial-num text-base mr-2 not-italic">01</span>
            Kies groepsgrootte
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {services.groupSizes.map((g, i) => (
              <button
                key={g.id}
                onClick={() => {
                  setGroupIdx(i);
                  // auto-deselect if current selection becomes unavailable
                  const newMax = g.max;
                  if (selectedLocId) {
                    const loc = services.locations.find((l) => l.id === selectedLocId);
                    if (loc && loc.maxGroup < newMax) setSelectedLocId(null);
                  }
                }}
                className={`btn-pill text-sm ${
                  groupIdx === i
                    ? "btn-primary"
                    : "bg-white border border-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)]"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2, map + locations */}
        <div className="mb-10 md:mb-12">
          <p className="eyebrow text-[color:var(--color-muted)] mb-4">
            <span className="editorial-num text-base mr-2 not-italic">02</span>
            Beschikbare vaarlocaties
          </p>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Real Amsterdam map (Leaflet + OpenStreetMap tiles) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <LeafletMap
                locations={locations.map((l) => ({
                  id: l.id,
                  name: l.name,
                  lat: l.lat,
                  lng: l.lng,
                  available: l.available,
                }))}
                selectedId={selectedLocId}
                onSelect={(id) => {
                  const loc = locations.find((l) => l.id === id);
                  if (loc?.available) setSelectedLocId(id);
                }}
              />
            </div>

            {/* Location cards */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
              {locations.map((loc) => {
                const isSelected = selectedLocId === loc.id;
                const isDisabled = !loc.available;
                return (
                  <button
                    key={loc.id}
                    onClick={() => !isDisabled && setSelectedLocId(loc.id)}
                    disabled={isDisabled}
                    className={`text-left p-5 rounded-[var(--radius-card)] border transition-all duration-300 ease-out ${
                      isSelected
                        ? "bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)] shadow-[0_8px_24px_rgba(27,42,74,0.18)]"
                        : isDisabled
                        ? "bg-white/40 border-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]/40 cursor-not-allowed"
                        : "bg-white border-[color:var(--color-primary)]/10 hover:border-[color:var(--color-primary)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(27,42,74,0.08)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className={`font-display text-lg font-semibold leading-tight ${isDisabled ? "" : ""}`}>
                        {loc.name}
                      </h3>
                      {isDisabled ? (
                        <FontAwesomeIcon icon={faBan} className="text-sm mt-1 shrink-0" />
                      ) : (
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className={`text-sm mt-1 shrink-0 ${
                            isSelected ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-accent)]"
                          }`}
                        />
                      )}
                    </div>
                    <p className={`text-xs mb-3 ${isSelected ? "text-white/70" : "text-[color:var(--color-muted)]"}`}>
                      {loc.address} · {loc.area}
                    </p>
                    {isDisabled ? (
                      <p className="text-xs italic">Niet beschikbaar voor deze groepsgrootte</p>
                    ) : (
                      <p className={`text-sm leading-relaxed ${isSelected ? "text-white/85" : "text-[color:var(--color-primary)]/72"}`}>
                        {loc.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3, restaurants */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-out ${
            selectedLoc ? "max-h-[2500px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!selectedLoc}
        >
          {selectedLoc && (
            <div className="bg-white rounded-[var(--radius-card)] p-6 md:p-10 border border-[color:var(--color-primary)]/8">
              <div className="flex items-center justify-between gap-4 mb-6 md:mb-8 flex-wrap">
                <div>
                  <p className="eyebrow text-[color:var(--color-muted)] mb-2">
                    <span className="editorial-num text-base mr-2 not-italic">03</span>
                    Aansluitend dineren
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
                    Bij <span className="headline-italic">{selectedLoc.name}</span>
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLocId(null)}
                  className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)] underline underline-offset-4"
                >
                  Sluiten
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {restaurants.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/restaurants/${r.slug}`}
                    className="group bg-[color:var(--color-bg-warm)] rounded-[var(--radius-card)] p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(27,42,74,0.08)]"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="font-display text-lg font-semibold leading-tight group-hover:text-[color:var(--color-accent)] transition-colors">
                        {r.name}
                      </h4>
                      <span className="text-[10px] tracking-[0.15em] uppercase text-[color:var(--color-muted)] shrink-0">
                        {r.capacity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUtensils} className="text-xs text-[color:var(--color-accent)]" />
                      <p className="text-xs uppercase tracking-wider text-[color:var(--color-accent)] font-medium">
                        {r.type}
                      </p>
                    </div>
                    <p className="text-sm text-[color:var(--color-primary)]/72 leading-relaxed flex-1">
                      {r.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-accent)] mt-1 self-start">
                      Bekijk
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

