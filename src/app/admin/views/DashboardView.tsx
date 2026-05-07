"use client";

import { useState, type FormEvent } from "react";
import { ADMIN_PAGES } from "@/lib/admin-content-schema";
import { useToast } from "../components/Toast";

type Props = {
  onNavigate: (pageId: string) => void;
  counts: {
    pages: number;
    sections: number;
    files: number;
  };
};

const SUGGESTIONS: Array<{ label: string; template: string; pageId: string }> = [
  {
    label: "Wijzig hero tekst",
    template: "Verander de hero headline van de homepage naar: ",
    pageId: "homepage",
  },
  {
    label: "Voeg review toe",
    template: "Voeg een nieuwe review toe van …",
    pageId: "reviews",
  },
  {
    label: "Nieuwe FAQ vraag",
    template: "Voeg een FAQ-vraag toe: ",
    pageId: "faq",
  },
  {
    label: "Update prijs",
    template: "Werk de prijs bij naar: ",
    pageId: "pricing",
  },
  {
    label: "Pas een foto aan",
    template: "Vervang de foto van de hero door …",
    pageId: "homepage",
  },
];

const QUICK_ACTIONS: Array<{
  pageId: string;
  icon: string;
  title: string;
  sub: string;
}> = [
  {
    pageId: "homepage",
    icon: "🏠",
    title: "Bewerk homepage",
    sub: "Hero, USPs, tijdlijn, CTAs.",
  },
  {
    pageId: "reviews",
    icon: "★",
    title: "Reviews beheren",
    sub: "Aanpassen of nieuwe toevoegen.",
  },
  {
    pageId: "faq",
    icon: "?",
    title: "FAQ aanpassen",
    sub: "Vragen en antwoorden bewerken.",
  },
  {
    pageId: "config",
    icon: "⚙",
    title: "Site-instellingen",
    sub: "Telefoon, e-mail, adres.",
  },
];

export function DashboardView({ onNavigate, counts }: Props) {
  const toast = useToast();
  const [aiInput, setAiInput] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    toast.info(
      "AI assistent komt in stap 4. Voor nu kun je de wijziging zelf in een sectie maken.",
    );
  };

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
          Bekijk site <span aria-hidden>↗</span>
        </a>
      </header>

      <div className="em-dash-grid">
        <form className="em-ai-card" onSubmit={onSubmit}>
          <h2>
            <span aria-hidden>✨</span> AI Assistent
          </h2>
          <p>
            Plak een klantverzoek of beschrijf wat je wilt aanpassen.
            Het systeem zoekt automatisch de juiste velden, toont een
            preview en jij keurt af of goed.
          </p>
          <textarea
            className="em-input em-textarea em-ai-textarea"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Bijv: 'Maak de hero subheadline iets korter en informeler.'"
            rows={3}
          />
          <div className="em-suggestion-row">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                className="em-chip"
                onClick={() => {
                  setAiInput(s.template);
                  onNavigate(s.pageId);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              className="em-btn em-btn-primary"
              disabled={!aiInput.trim()}
            >
              Analyseer →
            </button>
          </div>
        </form>

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
                  {action.icon}
                </span>
                <span className="em-quick-card-title">{action.title}</span>
                <span className="em-quick-card-sub">{action.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div
            className="em-content-toolbar"
            style={{ marginTop: 8, marginBottom: 12 }}
          >
            <strong style={{ color: "var(--color-text)" }}>
              Recente wijzigingen
            </strong>
            <span>Volledige tijdlijn volgt in stap 4</span>
          </div>
          <div className="em-empty">
            <div className="em-empty-icon" aria-hidden>
              ○
            </div>
            <div className="em-empty-title">Nog geen wijzigingen vandaag</div>
            <div className="em-empty-sub">
              Zodra je iets opslaat verschijnt het hier met tijdstempel.
            </div>
          </div>
        </div>
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
