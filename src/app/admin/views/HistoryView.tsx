"use client";

import { useState } from "react";
import { RecentChanges } from "../components/RecentChanges";

/**
 * Full "Wijzigingen" page. Shows the commit history with a toggle for
 * "alleen admin-wijzigingen". Power users can flip the toggle to see
 * everything, including build/CI commits.
 */
export function HistoryView() {
  const [adminOnly, setAdminOnly] = useState(true);

  return (
    <>
      <header className="em-page-header">
        <div>
          <h1 className="em-page-title">Wijzigingen</h1>
          <div className="em-page-sub">
            Tijdlijn van alle commits via de admin. Klik op de SHA om de
            commit op GitHub te openen.
          </div>
        </div>
        <label
          className="em-toggle-row"
          title={
            adminOnly
              ? "Toon ook commits die niet via de admin zijn gemaakt."
              : "Verberg developer/CI commits."
          }
        >
          <input
            type="checkbox"
            checked={!adminOnly}
            onChange={(e) => setAdminOnly(!e.target.checked)}
          />
          <span>Toon alle commits</span>
        </label>
      </header>

      <RecentChanges limit={50} adminOnly={adminOnly} showRevert />

      <p className="em-history-footnote">
        Geschiedenis komt rechtstreeks van GitHub
        {process.env.NEXT_PUBLIC_GITHUB_REPO
          ? ` (${process.env.NEXT_PUBLIC_GITHUB_REPO})`
          : ""}
        . Tot 50 meest recente commits.
      </p>
    </>
  );
}
