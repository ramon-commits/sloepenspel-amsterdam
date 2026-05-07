"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./components/Toast";
import { useConfirm } from "./components/ConfirmDialog";

export type SidebarCounts = {
  reviews: number;
  faq: number;
  restaurants: number;
  locations: number;
  blog: number;
  team: number;
};

type ItemId =
  // CONTENT
  | "homepage"
  | "het-spel"
  | "locaties-pagina"
  | "prijzen-pagina"
  | "over"
  | "contact"
  | "english"
  | "privacy"
  | "voorwaarden"
  // DATA
  | "reviews"
  | "faq"
  | "restaurants"
  | "locations"
  | "blog"
  | "team"
  | "services"
  | "pricing"
  // SITE
  | "config"
  | "images"
  | "navigation";

type Item = {
  id: ItemId;
  label: string;
  count?: number;
};

type Section = {
  id: "content" | "data" | "site";
  label: string;
  items: Item[];
};

export function AdminShell({ counts }: { counts: SidebarCounts }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [active, setActive] = useState<ItemId>("homepage");
  const [loggingOut, setLoggingOut] = useState(false);

  const sections: Section[] = useMemo(
    () => [
      {
        id: "content",
        label: "Content",
        items: [
          { id: "homepage", label: "Homepage" },
          { id: "het-spel", label: "Het Spel" },
          { id: "locaties-pagina", label: "Locaties" },
          { id: "prijzen-pagina", label: "Prijzen" },
          { id: "over", label: "Over Ons" },
          { id: "contact", label: "Contact" },
          { id: "english", label: "English" },
          { id: "privacy", label: "Privacy" },
          { id: "voorwaarden", label: "Voorwaarden" },
        ],
      },
      {
        id: "data",
        label: "Data",
        items: [
          { id: "reviews", label: "Reviews", count: counts.reviews },
          { id: "faq", label: "FAQ", count: counts.faq },
          { id: "restaurants", label: "Restaurants", count: counts.restaurants },
          { id: "locations", label: "Locaties", count: counts.locations },
          { id: "blog", label: "Blog", count: counts.blog },
          { id: "team", label: "Team", count: counts.team },
          { id: "services", label: "Diensten / USPs" },
          { id: "pricing", label: "Pricing" },
        ],
      },
      {
        id: "site",
        label: "Site",
        items: [
          { id: "config", label: "Config" },
          { id: "images", label: "Afbeeldingen" },
          { id: "navigation", label: "Navigatie" },
        ],
      },
    ],
    [counts],
  );

  const activeItem = useMemo(
    () => sections.flatMap((s) => s.items).find((i) => i.id === active),
    [sections, active],
  );

  const handlePublish = useCallback(async () => {
    const ok = await confirm({
      title: "Publiceer alle wijzigingen?",
      description:
        "Niet-opgeslagen wijzigingen worden naar GitHub gepusht en gaan na ~1-2 minuten live op sloepenspel.nl.",
      confirmLabel: "Publiceer",
      cancelLabel: "Nog niet",
    });
    if (!ok) return;
    toast.info("Publish-flow wordt gebouwd in stap 5.");
  }, [confirm, toast]);

  const handleLogout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      toast.error("Uitloggen mislukt, probeer opnieuw");
      setLoggingOut(false);
    }
  }, [loggingOut, router, toast]);

  return (
    <div className="em-shell">
      <aside className="em-sidebar" aria-label="Admin navigatie">
        <div className="em-brand">
          <div className="em-brand-badge" aria-hidden>
            EM
          </div>
          <div className="em-brand-text">
            <span className="em-brand-title">Site Admin</span>
            <span className="em-brand-sub">Sloepenspel</span>
          </div>
        </div>

        <nav className="em-nav">
          {sections.map((section) => (
            <div key={section.id}>
              <div className="em-nav-section">{section.label}</div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={`em-nav-item${
                    active === item.id ? " is-active" : ""
                  }`}
                  aria-current={active === item.id ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {typeof item.count === "number" && (
                    <span className="em-nav-count">{item.count}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="em-sidebar-footer">
          <button
            type="button"
            onClick={handlePublish}
            className="em-publish-btn"
          >
            <span aria-hidden>↑</span> Publiceer
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="em-view-link"
          >
            Bekijk site <span aria-hidden>↗</span>
          </a>
          <div className="em-user-block">
            <div className="em-user-avatar" aria-hidden>
              A
            </div>
            <div className="em-user-info">
              <span className="em-user-name">Admin</span>
              <span className="em-user-status">Ingelogd</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="em-logout-btn"
              aria-label="Uitloggen"
              disabled={loggingOut}
              title="Uitloggen"
            >
              →
            </button>
          </div>
        </div>
      </aside>

      <main className="em-main">
        <div className="em-content">
          {/* keyed wrapper makes React unmount/remount on item change → fade-in */}
          <div key={active} className="em-fade-in">
            <PagePlaceholder label={activeItem?.label ?? "Onbekend"} />
          </div>
        </div>
      </main>
    </div>
  );
}

function PagePlaceholder({ label }: { label: string }): ReactNode {
  return (
    <>
      <header className="em-page-header">
        <div>
          <h1 className="em-page-title">{label}</h1>
          <div className="em-page-sub">
            Content editor wordt gebouwd in stap 2 t/m 7.
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="em-page-link"
        >
          Bekijk site <span aria-hidden>↗</span>
        </a>
      </header>

      <div className="em-empty">
        <div className="em-empty-icon" aria-hidden>
          ○
        </div>
        <div className="em-empty-title">Editor in aanbouw</div>
        <div className="em-empty-sub">
          De visuele editor voor &ldquo;{label}&rdquo; verschijnt zodra stap 2
          is opgeleverd.
        </div>
      </div>
    </>
  );
}
