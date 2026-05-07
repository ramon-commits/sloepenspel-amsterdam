# Endless Minds Site Admin — Logboek

Productlogboek voor het admin-systeem op `/admin`. Eén entry per
afgeronde stap. Bevat afwijkingen van de spec en architecturale
beslissingen die voor latere stappen relevant zijn.

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
