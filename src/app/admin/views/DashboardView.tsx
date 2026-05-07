"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCircleQuestion,
  faGear,
  faHouse,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ADMIN_PAGES } from "@/lib/admin-content-schema";
import { AiChangePanel } from "../components/AiChangePanel";
import { RecentChanges } from "../components/RecentChanges";

type Props = {
  onNavigate: (pageId: string) => void;
  counts: {
    pages: number;
    sections: number;
    files: number;
  };
};

const QUICK_ACTIONS: Array<{
  pageId: string;
  icon: IconDefinition;
  title: string;
  sub: string;
}> = [
  {
    pageId: "homepage",
    icon: faHouse,
    title: "Bewerk homepage",
    sub: "Hero, USPs, tijdlijn, CTAs.",
  },
  {
    pageId: "reviews",
    icon: faStar,
    title: "Reviews beheren",
    sub: "Aanpassen of nieuwe toevoegen.",
  },
  {
    pageId: "faq",
    icon: faCircleQuestion,
    title: "FAQ aanpassen",
    sub: "Vragen en antwoorden bewerken.",
  },
  {
    pageId: "config",
    icon: faGear,
    title: "Site-instellingen",
    sub: "Telefoon, e-mail, adres.",
  },
];

export function DashboardView({ onNavigate, counts }: Props) {
  return (
    <div className="em-fade-in">
      <header className="em-page-header">
        <div>
          <h1 className="em-page-title">Welkom terug</h1>
          <div className="em-page-sub">
            Beheer alle content op sloepenspel.nl. Wijzigingen gaan
            via een commit naar GitHub en zijn binnen ~60 seconden live.
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="em-page-link"
        >
          Bekijk site <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden />
        </a>
      </header>

      <div className="em-dash-grid">
        <AiChangePanel />

        <div className="em-status-card">
          <span className="em-status-dot" aria-hidden />
          <span>
            <strong>Live op</strong>{" "}
            <a
              href="https://sloepenspel.nl"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--color-accent)",
                textDecoration: "none",
              }}
            >
              sloepenspel.nl
            </a>
          </span>
          <span className="em-status-meta">
            {counts.pages} pagina&apos;s · {counts.sections} secties · {counts.files}+ content bestanden
          </span>
        </div>

        <div>
          <h2 className="em-section-title" style={{ marginBottom: 12 }}>
            Snelle acties
          </h2>
          <div className="em-quick-grid">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.pageId}
                type="button"
                className="em-quick-card"
                onClick={() => onNavigate(action.pageId)}
              >
                <span className="em-quick-card-icon" aria-hidden>
                  <FontAwesomeIcon icon={action.icon} />
                </span>
                <span className="em-quick-card-title">{action.title}</span>
                <span className="em-quick-card-sub">{action.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <RecentChanges
          limit={6}
          title="Recente wijzigingen"
          onSeeAll={() => onNavigate("history")}
        />
      </div>
      <DashboardFooterMeta />
    </div>
  );
}

function DashboardFooterMeta() {
  // Tiny hidden marker so screen-readers / debuggers can quickly verify which
  // schema build is active. Cheap; keeps the dashboard from looking sparse.
  return (
    <div
      style={{
        marginTop: 32,
        fontSize: 11,
        color: "var(--color-text-light)",
        textAlign: "center",
      }}
    >
      Endless Minds Site Admin · {ADMIN_PAGES.length} pagina-schema&apos;s geladen
    </div>
  );
}
