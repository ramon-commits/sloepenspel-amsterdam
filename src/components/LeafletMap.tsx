"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

type LocationPin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  available: boolean;
};

export function LeafletMap({
  locations,
  selectedId,
  onSelect,
}: {
  locations: LocationPin[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Stable refs across renders
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Record<string, import("leaflet").Marker>>({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [52.359, 4.895],
        zoom: 13,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      // Carto Voyager, clean style with grachten subtly visible
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      L.control
        .zoom({ position: "bottomright" })
        .addTo(map);

      const peach = "#E8866A";
      const muted = "#9CA3AF";

      const makeIcon = (active: boolean, available: boolean) =>
        L.divIcon({
          className: "leaflet-peach-pin",
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46" fill="none" style="filter:drop-shadow(0 2px 6px rgba(27,42,74,0.35))">
                   <path d="M18 2 C 9.7 2 3 8.7 3 17 C 3 27.5 18 44 18 44 C 18 44 33 27.5 33 17 C 33 8.7 26.3 2 18 2 Z"
                         fill="${available ? peach : muted}"
                         stroke="white"
                         stroke-width="${active ? 3 : 2}"/>
                   <g fill="white" transform="translate(18 17)">
                     <circle cx="0" cy="-6.5" r="1.6"/>
                     <path d="M0 -5 L0 6.5" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
                     <path d="M-3.2 -2.2 L3.2 -2.2" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
                     <path d="M-5 4 C -5 6.5 -2.5 7.6 0 7.6 C 2.5 7.6 5 6.5 5 4" stroke="white" stroke-width="1.6" fill="none" stroke-linecap="round"/>
                   </g>
                 </svg>`,
          iconSize: [36, 46],
          iconAnchor: [18, 44],
        });

      // Plot markers
      for (const loc of locations) {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: makeIcon(loc.id === selectedId, loc.available),
          riseOnHover: true,
          opacity: loc.available ? 1 : 0.6,
          alt: loc.name, // accessible name for screen readers
          title: loc.name, // tooltip / native a11y
          keyboard: true,
        }).addTo(map);

        // Set aria-label on the underlying DOM node (keeps Lighthouse aria-command-name happy)
        const el = marker.getElement();
        if (el) el.setAttribute("aria-label", loc.name);

        marker.bindTooltip(loc.name.replace(/^(Locatie|Location) /, ""), {
          direction: "top",
          offset: [0, -38],
          opacity: 0.95,
          className: "leaflet-peach-tooltip",
        });

        if (loc.available) {
          marker.on("click", () => onSelectRef.current(loc.id));
        }

        markersRef.current[loc.id] = marker;
      }

      // Fit bounds with padding
      const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to selection / availability changes, update marker icons
  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;

      const peach = "#E8866A";
      const muted = "#9CA3AF";
      const makeIcon = (active: boolean, available: boolean) =>
        L.divIcon({
          className: "leaflet-peach-pin",
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46" fill="none" style="filter:drop-shadow(0 2px 6px rgba(27,42,74,0.35))">
                   <path d="M18 2 C 9.7 2 3 8.7 3 17 C 3 27.5 18 44 18 44 C 18 44 33 27.5 33 17 C 33 8.7 26.3 2 18 2 Z"
                         fill="${available ? peach : muted}"
                         stroke="white"
                         stroke-width="${active ? 3 : 2}"/>
                   <g fill="white" transform="translate(18 17)">
                     <circle cx="0" cy="-6.5" r="1.6"/>
                     <path d="M0 -5 L0 6.5" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
                     <path d="M-3.2 -2.2 L3.2 -2.2" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
                     <path d="M-5 4 C -5 6.5 -2.5 7.6 0 7.6 C 2.5 7.6 5 6.5 5 4" stroke="white" stroke-width="1.6" fill="none" stroke-linecap="round"/>
                   </g>
                 </svg>`,
          iconSize: [36, 46],
          iconAnchor: [18, 44],
        });

      for (const loc of locations) {
        const marker = markersRef.current[loc.id];
        if (!marker) continue;
        marker.setIcon(makeIcon(loc.id === selectedId, loc.available));
        marker.setOpacity(loc.available ? 1 : 0.55);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locations, selectedId]);

  return (
    <div
      ref={containerRef}
      className="leaflet-wrapper relative aspect-[4/5] rounded-[var(--radius-image)] overflow-hidden border border-[color:var(--color-primary)]/10 bg-white"
      role="application"
      aria-label="Kaart van Amsterdamse opstapplaatsen"
    />
  );
}
