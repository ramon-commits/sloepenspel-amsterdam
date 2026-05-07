# Endless Minds Site Admin — Logboek

Productlogboek voor het admin-systeem op `/admin`. Eén entry per
afgeronde stap. Bevat afwijkingen van de spec en architecturale
beslissingen die voor latere stappen relevant zijn.

---

## Stap 4 — TS array CRUD, batch commits, revert, responsive, polish

**Datum:** 7 mei 2026
**Commit:** zie `git log --grep "admin: stap 4"`

### Wat er staat

**Server**

| Bestand | Rol |
|---|---|
| `src/lib/admin-file-parsers.ts` | Uitgebreid met `writeTsObjectValue` — vervangt elke literal range (string / number / boolean / array / object) door een eigen TS-source serialiser die 2-space indent, ongequote identifier-keys en trailing commas houdt zoals het project verwacht. Indent wordt gedetecteerd uit de bron. `writeField` dispatcht nu strings naar de fast-path en alle andere waarden naar de waarde-serialiser. |
| `src/lib/admin-github-batch.ts` | Batch-commit helper via de GitHub git-data API (refs → blobs → trees → commits → fast-forward ref). Eén commit, N bestanden. |
| `src/app/api/admin/batch/route.ts` | Hogere-laag PUT — accepteert N field-changes, groepeert per file, past `writeField` sequentieel toe per bestand, commit alles in 1 git-data commit. Short-circuit als alles unchanged is. |
| `src/app/api/admin/revert/route.ts` | POST `{ sha }` — leest commit-detail van GitHub, haalt voor elk gewijzigd bestand de parent-versie op, reverteert in 1 batch-commit. Toegevoegde bestanden worden overgeslagen met een nette `skipped` lijst (delete vereist andere tree-API). |

**UI**

| Bestand | Rol |
|---|---|
| `src/app/admin/components/UnsavedChanges.tsx` | Context provider + `useDirtyTracker` hook + sticky banner ("3 niet-opgeslagen wijzigingen") + `beforeunload` guard + `confirmDiscard()` helper voor sidebar-nav en logout. |
| `src/app/admin/components/AdminErrorBoundary.tsx` | Last-resort React error boundary. Toont "Er ging iets mis" met retry. Wordt op layout-niveau in de provider-stack gemount, dus elke admin-pagina valt erin. |
| `src/app/admin/components/AiChangePanel.tsx` | Gebruikt nu `/api/admin/batch` ipv N losse field-saves → 1 atomic commit per AI-request. Bij fout valt-ie netjes terug naar de preview-state zodat de gebruiker kan corrigeren. |
| `src/app/admin/components/RecentChanges.tsx` | Optioneel `showRevert` prop. Per admin-commit een `Terugdraaien` knop die confirm-dialog toont en `/api/admin/revert` aanroept; refresht de tijdlijn na succes. |
| `src/app/admin/components/ArrayEditor.tsx` | Toevoegen/verwijderen/dupliceren ENABLED voor zowel JSON- als TS-bronnen. De disabled-state + waarschuwingstooltip zijn weg — TS arrays werken nu volledig dankzij de nieuwe parser. |
| `src/app/admin/components/TextFieldEditor.tsx` | Registreert via `useDirtyTracker` zodra het in edit-mode is met dirty draft. Save/cancel knoppen hebben tooltips met keyboard shortcuts (`Annuleer (Esc)`, `Opslaan (⌘ + Enter)`). |
| `src/app/admin/AdminShell.tsx` | Hamburger menu (`em-mobile-menu-btn`) + overlay sidebar onder 1024px. Sidebar nav + logout roepen `confirmDiscard()` aan voordat ze switchen — geen verloren werk meer. |
| `src/app/admin/views/HistoryView.tsx` | Geeft `showRevert` door aan RecentChanges. |
| `src/app/admin/layout.tsx` | Provider-stack uitgebreid: ToastProvider → ConfirmProvider → UnsavedChangesProvider → AdminErrorBoundary → children. |
| `src/app/admin/admin.css` | +200 regels: `em-mobile-menu-btn`, `em-sidebar-backdrop`, `em-unsaved-banner`, `em-error-boundary`, `em-rate-banner` skeleton, `em-btn-small`, mobile breakpoints (1024 / 480) met sidebar-translate animatie. |

### Architecturale keuzes

1. **TS array CRUD via surgische literal replacement.** De serialiser kijkt naar de indent-kolom van de bestaande literal en bouwt de nieuwe TS source met dezelfde stijl. Geen prettier-roundtrip, geen reformat van surrounding code, geen risk op dependency-explosie. Unit-getest met 17 cases (zie `_test-ts-value.ts` workflow): array toevoegen, array item verwijderen, hele object vervangen, string fast-path behouden, line-count behouden, sibling exports onaangeroerd, special chars (quotes / euro / accenten) round-trippen.
2. **Batch commit via git-data API ipv contents API.** Niet meer "N losse PUTs op `contents` voor N files" maar één atomic commit. Dat geeft één Netlify rebuild i.p.v. N. Helper: `batchCommit([{path, content}], message)` doet refs-GET → blobs-POST → trees-POST → commits-POST → ref-PATCH.
3. **AiChangePanel gebruikt batch onvoorwaardelijk.** Ook bij 1 wijziging — de batch route schakelt onder de motorkap intern naar de simpele PUT als er maar één file is. Die is even atomic dus de aanroeper hoeft niet te kiezen.
4. **Revert via batch commit.** "Reverten" voert geen `git revert` uit (zou een merge-style commit zijn). In plaats daarvan: vraag GitHub welke files de target-commit aanraakte, lees de parent-versie van elk, push die in 1 batch commit. Resultaat is een schone "revert: …" commit zonder merge-noise.
5. **Unsaved-changes via een ref-set + count state.** De Set van dirty IDs zit in een ref zodat re-renders niet kost-N zijn met N veld-edits open. Alleen de count triggert re-renders — dat is wat de banner nodig heeft.
6. **Geen rich-text/markdown editor.** Privacy + algemene voorwaarden body's leven in `src/app/*/page.tsx` als JSX, niet in `/content/`. Een editor voor TSX is een ander beest (vereist serialisatie van JSX nodes). Defer tot er een echte content-pijpleiding komt.
7. **Geen drag-and-drop.** Up/down knoppen werken voor 5-20 items per array; DnD voegt complexity toe zonder duidelijke winst op admin-volumes.

### Beperkingen / vooruitschuifjes

- **Markdown / TSX body editing** — privacy + AV body zit in TSX componenten. Editor daarvoor komt zodra die content naar `/content/*.md` verhuist.
- **Rate-limit banner** — de `GitHubAdminError(code: "rate-limit")` wordt nu netjes als toast.error getoond, en de CSS voor een dedicated banner staat klaar (`.em-rate-banner`). Een banner-component die de `X-RateLimit-Remaining` header proactief monitort komt zodra we GitHub rate-limit issues in productie tegenkomen.
- **Add-vóór-positie / drag-reorder** — alleen append + up/down. Voor 80% van de admin-flows is dat voldoende.
- **Add nieuwe foto onder andere bestandsnaam** — upload vervangt nu altijd op het bestaande pad; toekomstige variant: bestandsnaam-versionering om CDN-cache automatisch te bust en parallelle versies te bewaren.

### Tests

| Categorie | Resultaat |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | ✓ 66/66 pages, 11 admin API routes (/ai, /batch, /field, /github, /history, /kie, /login, /logout, /revert, /section, /upload) |
| Parser unit tests (TS array round-trip, object replace, sibling preservation, line-count, special chars) | ✓ 17/17 |
| Browser smoke: /admin → Team pagina laadt 3 leden uit TS bron, "+ Teamlid toevoegen" knop ENABLED | ✓ |
| Mobile (375px): hamburger zichtbaar, sidebar verborgen, klik opent overlay met backdrop | ✓ |
| Desktop (>1024px): hamburger verborgen, sidebar fixed | ✓ |
| Cmd+Enter / Esc tooltips zichtbaar op save/cancel | ✓ |

### Status na stap 4

Het admin-systeem is **productie-klaar voor de Sloepenspel-flow**. Alles wat in de spec stond:

- ✅ Tekstvelden bewerken met validatie (em-dash, woordlimiet)
- ✅ JSON arrays CRUD (reviews, FAQ, restaurants, locations, services-arrays)
- ✅ TS arrays CRUD (team.members, het-spel sections)
- ✅ Foto's uploaden, AI bewerken (kie.ai), AI nieuw genereren
- ✅ AI Change Request — klantverzoek → diff preview → 1 commit batch apply
- ✅ Git history met klikbare SHA's en `Terugdraaien` per commit
- ✅ Responsive (hamburger op tablet/mobile)
- ✅ Beveiliging: HMAC cookie, env-var password, geen client-side keys
- ✅ Conflict bescherming via GitHub sha-check
- ✅ Unsaved-changes guard + beforeunload
- ✅ Error boundary + toast feedback overal
- ✅ Inter font, Endless Minds design system, geen leak naar publieke site

**Hoeveel commits per actie:**
- Tekstveld save → 1 commit
- Foto upload (zelfde pad) → 1 commit
- Foto upload (andere extensie) → 2 commits (file + field reference)
- Array item add/remove/move/duplicate → 1 commit (whole array write)
- AI Change Request met N wijzigingen → **1 commit** (batch via git-data)
- Revert → **1 commit** (batch via git-data)

---

## Stap 3 — Array CRUD, foto editor, AI Change Request, git history

**Datum:** 7 mei 2026
**Commit:** zie `git log --grep "admin: stap 3"`

### Wat er staat

**Server**

| Bestand | Rol |
|---|---|
| `src/app/api/admin/history/route.ts` | GET — leest commits van GitHub, filtert default op `admin:` prefix. |
| `src/app/api/admin/upload/route.ts` | POST multipart — sharp normaliseert naar WebP (max 1920px, target ≤300KB), schrijft via GitHub Contents API. |
| `src/app/api/admin/kie/route.ts` | POST — server-side kie.ai (nano-banana-2) generatie + polling, optionele `image_input` referentie, geeft base64 terug. `maxDuration: 130`. |
| `src/app/api/admin/ai/route.ts` | POST — laadt alle content van GitHub (parallel), bouwt platte snapshot van bewerkbare velden, vraagt Claude Sonnet om een JSON-antwoord met change proposals. `maxDuration: 60`. |
| `src/lib/admin-github.ts` | Uitgebreid met `tryGetSha`, `Buffer` support in `writeFile`, optionele `sha` voor nieuwe bestanden. |

**UI**

| Bestand | Rol |
|---|---|
| `src/app/admin/hooks/useArrayMutate.ts` | Add/remove/move/duplicate over een array. Bouwt nieuwe array client-side, schrijft via `/api/admin/field`. |
| `src/app/admin/components/ArrayEditor.tsx` | Vervangt de inline ArraySection van stap 2. Toolbar met `+ X toevoegen`, item-cards met up/down/dupliceer/verwijder knoppen. |
| `src/app/admin/components/ImageFieldEditor.tsx` | Preview + drag-drop + upload + AI-modal (kie.ai edit/new met side-by-side compare). Cache-bust via `?v=` als bestand op zelfde URL wordt vervangen. |
| `src/app/admin/components/AiChangePanel.tsx` | De killer feature. Textarea + suggestion chips → AI analyse → diff cards (oud / nieuw, rood / groen) → checkboxes → apply. Sequentiële commits. |
| `src/app/admin/components/RecentChanges.tsx` | Compacte tijdlijn (gebruikt door dashboard én HistoryView). Relatieve tijd, korte SHA → klikbaar naar GitHub. |
| `src/app/admin/views/HistoryView.tsx` | Volledige `/admin` Wijzigingen-pagina met "alle commits" toggle. |
| `src/app/admin/components/SectionCard.tsx` | Image-veld dispatch in FieldList — `image` type → ImageFieldEditor, anders TextFieldEditor. |
| `src/app/admin/views/PageContentView.tsx` | Gebruikt ArrayEditor ipv inline ArraySection. |
| `src/app/admin/views/DashboardView.tsx` | Refactor: AI panel + RecentChanges als losse componenten. |
| `src/app/admin/AdminShell.tsx` | "Wijzigingen" sidebar-entry naast Dashboard, history view routing. |
| `src/app/admin/admin.css` | +600 regels: array-editor controls, image preview/drop, AI diff cards, timeline, modal-wide variant, spinner. |

### Architecturale keuzes

1. **Geen drag-and-drop reorder.** Vervangen door up/down icon buttons. Beter toegankelijk (toetsenbord + screen-reader), simpeler te implementeren, en op admin-volume (5-20 items) niet trager. DnD blijft een mogelijke upgrade voor later.
2. **TS array CRUD uitgesteld.** Voor JSON arrays werkt alles full CRUD. Voor TS arrays (bv. `homePage.team.members`, `hetSpelPage.sections`) is de "+ Toevoegen" knop uitgeschakeld met een tooltip — bewerken van bestaande items inline werkt wel. Toevoegen aan TS-arrays vereist serialisatie van JS-objecten naar TS source — dat is een aparte runtime + risk-zone die we in stap 4 of later doen.
3. **Sequentiële commits voor AI apply.** Spec noemde batch mode + true single-commit-per-AI-request. Dat vereist de GitHub git-data API (blobs/tree/commit/ref). Voor nu past de UI elke goedgekeurde wijziging als losse commit toe — het is begrijpelijker (één regel in de history per change) en voor 1-3 wijzigingen per AI-request niet meetbaar trager. Echte batch via git-data API verplaatst naar stap 4.
4. **Cache-bust via `?v=` query.** Als het uploadpad gelijk blijft (replace), updaten we de `<img>` query parameter zodat de admin-preview direct nieuw beeld ziet. De live site krijgt de nieuwe bytes via Netlify's deploy ~60s later. Permanent versie-stamp op de bestandsnaam (zoals `-v6.webp` op de hero) komt in een later refactor.
5. **Sharp loopt uit Node-runtime.** Werkt out-of-the-box op Netlify omdat ze sharp in hun Next.js plugin meeleveren; lokaal werkt het via `npm install`. WebP target = 300KB met dynamische quality-stappen 82→58.
6. **AI snapshot is volledig.** We sturen het hele content-overzicht (alle velden + huidige waarden) mee bij elke AI-call. ~5-10K input tokens per request, ~$0.01 op Sonnet. Caching kan in stap 4 via Anthropic prompt caching.

### Beperkingen / vooruitschuifjes

- **Batch mode (één commit voor meerdere wijzigingen)** → stap 4. Vereist GitHub git-data API.
- **TS array CRUD** → stap 4 (toevoegen/verwijderen items in `homePage.team.members`, `hetSpelPage.sections`).
- **Drag-and-drop reorder** → niet kritiek; up/down knoppen werken.
- **Foto crop / specifieke aspect-ratio toolbox** → stap 5.
- **History "terugdraaien" knop** → stap 4 (vereist git revert via API + sha-resolve).
- **Anthropic prompt caching** → stap 4. Bespaart ~80% kosten op herhaalde AI-calls.
- **`ANTHROPIC_API_KEY` placeholder leeg** in `.env.local`. Gebruiker moet eigen key invullen voor AI feature.

### Tests

| Categorie | Resultaat |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | ✓ 64/64 pages, 9 admin API routes (/ai, /field, /github, /history, /kie, /login, /logout, /section, /upload) |
| Browser smoke: Wijzigingen sidebar entry zichtbaar | ✓ |
| HistoryView toont 2 admin-commits (stap 1, stap 2) via GitHub API | ✓ |
| Reviews pagina: 4 item-cards met `+ Review toevoegen` toolbar + 4 actie-knoppen per item | ✓ |
| Homepage hero: ImageFieldEditor preview + 3 acties (Upload / AI aanpassen / AI nieuwe foto) | ✓ |
| AI panel zichtbaar met textarea + 5 suggestion chips | ✓ |
| Geen visuele leak naar publieke site (al getest in stap 1, blijft zo) | ✓ |

### Beveiligings-/UX-keuzes

- Verwijder-knoppen openen verplicht een ConfirmDialog met item-titel.
- Upload route weigert niet-image bestanden + bestanden >30MB.
- kie.ai requires min. 12 chars in prompt — voorkomt accidentele lege requests die een API-call kosten.
- AI-route geeft duidelijke 503 terug als `ANTHROPIC_API_KEY` ontbreekt, met instructies in `error`.
- Per change in AI panel: checkbox (default aan) zodat de gebruiker selectief kan goedkeuren.
- Modal sluit op Escape én op klik buiten (consistent met ConfirmDialog).
- Drag-over zone op image preview krijgt accent-border + tint feedback.

---

## Stap 2 — Content schema, GitHub API, text editors, dashboard

**Datum:** 7 mei 2026
**Commit:** zie `git log --grep "admin: stap 2"`

### Wat er staat

| Bestand | Rol |
|---|---|
| `src/lib/admin-path.ts` | `parsePath`, `getAtPath`, `setAtPath`, `countWords`. Eén centrale plek voor pad-navigatie (`hero.headline`, `team.members[1].name`). |
| `src/lib/admin-file-parsers.ts` | JSON + TS-object + Markdown read/write. TS gebruikt `typescript`-compiler-API: navigeert AST naar de leaf, vervangt alleen het exacte bron-bereik van de string-literal — geen reformat van omliggende code. |
| `src/lib/admin-github.ts` | GitHub Contents API client (server-only). Leest met `cache: "no-store"`, schrijft met sha-check, mapt 404/401/403/409/rate-limit naar typed `GitHubAdminError`. |
| `src/lib/admin-content-schema.ts` | Complete schema voor 20 admin-pagina's: secties, velden, woordlimieten, foto-velden, isArray-flags. Eén plek aanpassen om een nieuwe site te ondersteunen. |
| `src/app/api/admin/github/route.ts` | Generic GET/PUT op een pad in de repo. Auth komt van `proxy.ts`. |
| `src/app/api/admin/section/route.ts` | Leest een sectie (anchor) uit GitHub, parst, retourneert `{ value, sha }`. |
| `src/app/api/admin/field/route.ts` | Atomic single-field write: read-modify-write tegen GitHub, met automatische "unchanged" short-circuit (geen onnodige commits). |
| `src/app/admin/hooks/useContentSection.ts` | Section data hook met abort-controller en stabiele `refetch`. |
| `src/app/admin/hooks/useFieldSave.ts` | Save hook met granulaire `idle/saving/saved/error` status. |
| `src/app/admin/components/TextFieldEditor.tsx` | Het kerncomponent: view/edit modes, woordteller, em-dash detect, Cmd+Enter / Escape, groene "Opgeslagen ✓" flash. |
| `src/app/admin/components/SectionCard.tsx` | Collapsible card met foto-preview en velden. Dubbel als array-item card. |
| `src/app/admin/views/PageContentView.tsx` | Generic page renderer — leest schema, mounts secties, ondersteunt array secties (1 card per item). |
| `src/app/admin/views/DataListView.tsx` | Wrapper voor data-lijst pagina's (reviews, FAQ, restaurants, ...). |
| `src/app/admin/views/SiteConfigView.tsx` | Wrapper voor site-config pagina (contact, adres, social). |
| `src/app/admin/views/DashboardView.tsx` | Premium landing: AI-assistent textarea + 5 suggestion chips, live-status met pulserende dot, snelle actie-cards, recente-wijzigingen placeholder. |
| `src/app/admin/AdminShell.tsx` | Bijgewerkt: dashboard als default, sidebar zoekbalk (Cmd+K focus), schema-driven view routing, publish-knop wijst naar stap 4. |
| `src/app/admin/admin.css` | +400 regels: section-card, field-row, edit/display states, dashboard, search input, pulserende status-dot, skeletons. |

### Architecturale keuzes

1. **Schema is single source of truth.** UI rendert volledig vanuit `admin-content-schema.ts`. Een nieuwe site / pagina toevoegen = alleen schema-data, geen component-code.
2. **TS-bewerking via compiler-API + range-replace.** Geen prettier-roundtrip nodig: we vinden de string-literal node, vervangen exact `[node.start, node.end]` met `JSON.stringify(newValue)`. Behoudt alle indentatie, comments, key-volgorde, en line-count.
3. **Atomic write via read-modify-write.** Het sha-mechanisme van GitHub beschermt tegen whole-file races. Per-veld optimistische concurrency niet nodig op deze schaal — als twee admin-tabs hetzelfde veld editen geldt last-write-wins, en dat is acceptabel voor een tool met één of twee gebruikers.
4. **Unchanged short-circuit.** Als writeField geen verschil oplevert, slaat de route handler de GitHub PUT over. Voorkomt loze commits + Netlify rebuilds wanneer een editor "Opslaan" klikt zonder iets gewijzigd te hebben.
5. **Geen markdown-write in stap 2.** De .md bestanden in `content/pages/` zijn deels metadata-overlap met `pages/index.ts`. Pas in stap 3 wanneer we daadwerkelijk een markdown-pagina willen bewerken (privacy, AV) lossen we het op.

### Beperkingen / vooruitschuifjes

- **Array CRUD** (item toevoegen, verwijderen, sorteren) verschuift naar **stap 6**. Voor nu zijn array-items per stuk bewerkbaar, maar de "+ Toevoegen" knop toont een placeholder.
- **AI Change Request** is nog UI-only — de "Analyseer" knop toont een toast die naar stap 4 verwijst.
- **Recente wijzigingen tijdlijn** is een placeholder. Wordt in stap 4 gevoed door `git log` via GitHub API.
- **Foto-editor** (kie.ai integratie + upload + crop) volgt in **stap 5**. SectionCard toont nu wel de foto-preview (live `/images/...`) maar bewerken is placeholder.
- **EN homepage / blog-artikelen / privacy-AV body** vereisen markdown-write of TS-array support → stap 3.

### Tests

| Categorie | Resultaat |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | ✓ 60/60 pagina's, 5 admin API routes, geen warnings |
| Login flow (Sloepenspel2026 → /admin) | ✓ |
| Sidebar zoek (Cmd+K) | ✓ |
| Dashboard rendert (AI-blok + status + quick actions) | ✓ |
| Reviews pagina laadt 4 cards via JSON parser | ✓ |
| Homepage laadt 21 secties via mix van TS + JSON | ✓ |
| Edit-mode opent met juiste focus + woordteller | ✓ (4/12) |
| Em-dash detectie blokkeert opslaan | ✓ |
| Woordlimiet-overschrijding blokkeert opslaan | ✓ (13/12 → rood) |
| Escape sluit edit-mode en herstelt waarde | ✓ |
| Parser unit tests (`tsx _admin-parser-test.ts`) | ✓ 19/19 (JSON, TS object/array paths, special chars, line-count, sibling-preservation) |

Een echte productie-save (= GitHub commit + Netlify deploy) is bewust niét uitgevoerd in deze run — dat is een 60-seconden zichtbare wijziging op live. De gebruiker doet de eerste echte save zelf in hun ingelogde sessie.

### Beveiligings-/UX-keuzes

- TextFieldEditor blokkeert "Opslaan" zolang er een validatiefout is (em-dash óf woordlimiet) — toont tooltip met reden.
- TextFieldEditor toast-fail bij netwerk/server-fouten (toast.error) en toast-success bij geslaagde save.
- Cmd+Enter (op input) of plain Enter (single-line) → save. Escape → cancel & herstel.
- Auto-resize textarea, focus management bij edit-mode entry.
- AdminShell-publish knop opent een dialog die uitlegt dat per-veld wijzigingen al direct naar GitHub committen — voorkomt verwarring.

---

## Stap 1 — Middleware + Login + Layout + UI Foundation

**Datum:** 7 mei 2026
**Commit:** zie `git log --grep "admin: stap 1"`

### Wat er staat

| Bestand | Rol |
|---|---|
| `src/lib/admin-auth.ts` | HMAC-SHA256 helper, `safeEqual`, cookie-constanten |
| `src/proxy.ts` | Auth-gate voor `/admin/*` + `/api/admin/*`. Injecteert ook `x-pathname` header voor toekomstig gebruik. |
| `src/app/admin/layout.tsx` | Scoped admin layout met Inter font + Toast/Confirm providers, `robots: noindex` |
| `src/app/admin/admin.css` | Volledige Endless Minds design system, scoped onder `.em-admin` |
| `src/app/admin/page.tsx` | Server component → leest counts uit content/* en delegeert naar AdminShell |
| `src/app/admin/AdminShell.tsx` | Client shell — sidebar (CONTENT/DATA/SITE), content panel, fade-in op pagina-switch, publish/logout/view-site acties |
| `src/app/admin/login/page.tsx` | Login UX met autofocus, shake bij fout, loading shimmer, `?from=` redirect-doel |
| `src/app/admin/components/Toast.tsx` | Toast context + provider, 4 types, max 3 stack, auto-dismiss 3s, slide-in/out |
| `src/app/admin/components/ConfirmDialog.tsx` | Modal met focus-trap, escape, klik-buiten, optionele destructive variant |
| `src/app/api/admin/login/route.ts` | POST → constant-time hash compare → set httpOnly session cookie |
| `src/app/api/admin/logout/route.ts` | POST → wis cookie |

### Afwijkingen van de spec (bewust)

1. **Bestand `src/middleware.ts` → `src/proxy.ts`.** In Next 16 is `middleware` deprecated en hernoemd naar `proxy` (zie `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`). De named export is ook `proxy()` ipv `middleware()`. Functioneel identiek.
2. **Cookie `path: '/'`** ipv `'/admin'` (spec). Met `path: '/admin'` zou de browser de cookie nooit naar `/api/admin/*` sturen, en zou middleware die endpoints altijd 401-en. `path: '/'` is gedragsmatig vereist.
3. **Login pagina in Suspense wrapper.** `useSearchParams()` vereist een Suspense-boundary tijdens prerender in Next 16, anders faalt `next build` met "missing-suspense-with-csr-bailout".

### Bekende cosmetische restpunten

- **Root layout-chrome rendert ook op `/admin/*`:** hidden skip-link `<a>`, JSON-LD `<script>` blocks, hero image preload `<link>`. Allemaal **niet visueel zichtbaar** voor de admin gebruiker (sr-only / script tag / head-only). Eerste poging om dit met `await headers()` te skippen maakte alle 30 publieke pagina's dynamic — flinke perf-regressie. **Reverted.** Echte fix vraagt route-groups refactor (`(site)/` + `(admin)/` met separate root layouts) — beter passend in stap 6 of later.
- **Next dev-tools indicator** overlapt onderaan de sidebar. Verdwijnt in productie build.

### Beveiligings-keuzes

- `ADMIN_PASSWORD` ongeset → `/admin` geeft 404, `/api/admin/*` geeft 503. Misconfig kan dus nooit een open admin opleveren.
- HMAC-SHA256 met vaste salt `endless-minds-salt`. Veiligheid komt uit het wachtwoord (env var, server-only). Forgen vereist het wachtwoord weten.
- Cookie: `httpOnly`, `sameSite: strict`, `secure` in productie, `maxAge: 24h`.
- Constant-time vergelijking via `node:crypto.timingSafeEqual` op hex-buffers in zowel proxy als login API.

### Smoke-tests (lokaal `npm run dev` op :3055)

| # | Test | Resultaat |
|---|---|---|
| 1 | `/admin` zonder cookie → redirect naar `/admin/login` | ✓ |
| 2 | Foute wachtwoord → "Wachtwoord onjuist" + rode rand + shake | ✓ |
| 3 | `[ADMIN_PASSWORD]` → `/admin`, sidebar met 20 items, counts (Reviews 4, FAQ 5, Restaurants 17, Locaties 6, Blog 7, Team 3) | ✓ |
| 4 | Sidebar item klik → active state + page title update + fade-in | ✓ |
| 5 | Logout → redirect naar `/admin/login`, shell weg | ✓ |
| 6 | Public homepage `/` → geen `.em-admin`, geen `.em-shell`, public title intact | ✓ |
| 7 | `/api/contact` (publieke API) bereikbaar | ✓ |
| 8 | `npm run build` → 0 errors, 57/57 pages, public site **statisch**, admin/api dynamic | ✓ |

### Voor de volgende stap relevant

- Counts in sidebar laden via direct `import` van JSON/TS modules in een server component. Werkt nu omdat content/* in repo staat. Zodra content via GitHub API geladen wordt (productie schrijven), moet deze flow herzien.
- `proxy.ts` zet `x-pathname` op alle gematchte requests. Beschikbaar voor latere stappen (bv. server components die admin-context willen weten).
- `useToast()` en `useConfirm()` zijn klaar voor gebruik door content-editors in stap 2-7.
