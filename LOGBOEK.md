# Endless Minds Site Admin — Logboek

Productlogboek voor het admin-systeem op `/admin`. Eén entry per
afgeronde stap. Bevat afwijkingen van de spec en architecturale
beslissingen die voor latere stappen relevant zijn.

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
| 3 | `sloepenspel2026` → `/admin`, sidebar met 20 items, counts (Reviews 4, FAQ 5, Restaurants 17, Locaties 6, Blog 7, Team 3) | ✓ |
| 4 | Sidebar item klik → active state + page title update + fade-in | ✓ |
| 5 | Logout → redirect naar `/admin/login`, shell weg | ✓ |
| 6 | Public homepage `/` → geen `.em-admin`, geen `.em-shell`, public title intact | ✓ |
| 7 | `/api/contact` (publieke API) bereikbaar | ✓ |
| 8 | `npm run build` → 0 errors, 57/57 pages, public site **statisch**, admin/api dynamic | ✓ |

### Voor de volgende stap relevant

- Counts in sidebar laden via direct `import` van JSON/TS modules in een server component. Werkt nu omdat content/* in repo staat. Zodra content via GitHub API geladen wordt (productie schrijven), moet deze flow herzien.
- `proxy.ts` zet `x-pathname` op alle gematchte requests. Beschikbaar voor latere stappen (bv. server components die admin-context willen weten).
- `useToast()` en `useConfirm()` zijn klaar voor gebruik door content-editors in stap 2-7.
