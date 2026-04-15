---
name: femtribu-project
description: >
  Project context for FemTribu — a Spanish women's health & wellness website (Astro 5 + Supabase +
  Directus). Load this skill immediately at the start of any task involving this project.

  Trigger on ANY of the following — even if the user does not say "FemTribu" by name:
  - Files or routes: eventos.astro, upcomingEvents, /eventos, /cursos, /sobre-mi, /perfil, /blog,
    CookiesOverlay.astro, GoogleAnalytics.astro, Layout.astro, EventCalendar, FloatingCTA,
    src/data/events.ts, src/auth/, src/services/directus.ts, src/config/auth.ts
  - Concepts specific to this project: taller presencial, matrona, lactancia, femm barre,
    club lectura, terracotta/sage/cream-light color palette, whatsappNumber "34640912048",
    event detail page, upcomingEvents array, lastDateISO, USE_MOCK_DATA, femm-tribu-user-consent
  - Tasks: adding an event, editing event dates or sessions, fixing the eventos page, adding a
    blog post to this site, protecting a route, changing the login redirect, updating SEO on
    any page, fixing cookie banner, changing Supabase auth behavior, adding a course page,
    asking which supabase functions to use for auth (getUser, getSession, signIn, signOut)
  - Any question about how THIS project is structured, what file to edit, or what the stack is

  Do not wait for the user to ask — load this context proactively.
---

# FemTribu Project Context

## Stack
Astro 5.13 (SSG, `prerender=true`) · React 19 islands · TailwindCSS 4 · TypeScript strict
Directus SDK 21.2 (CMS) · Supabase auth (`src/auth/`) · n8n webhooks (forms) · pnpm
Path alias: `@/` → `src/`

## Key Files
| File | Purpose |
| ---- | ------- |
| `src/layouts/Layout.astro` | Root layout — analytics, cookie consent, nav |
| `src/auth/index.ts` | Auth barrel: `signUp/signIn/signOut/getUser/getSession` |
| `src/config/auth.ts` | Redirect paths, OAuth callback URLs |
| `src/pages/eventos.astro` | Event listing — inline `upcomingEvents[]` array |
| `src/data/events.ts` | Event detail objects → `eventos/[slug].astro` |
| `src/services/events-service.ts` | `Event` type, `fetchEvents/fetchEvent`, share/calendar links |
| `src/services/club-lectura-service.ts` | Book club events — same pattern as events-service |
| `src/services/directus.ts` | Directus client, `getAssetUrl(uuid)` |
| `src/components/GoogleAnalytics.astro` | GA4 Consent Mode v2 Basic — `import.meta.env.DEV` guard |
| `src/components/CookiesOverlay.astro` | Cookie consent UI — saves to `femm-tribu-user-consent` in localStorage |

## Pages
```
/                        src/pages/index.astro
/eventos                 src/pages/eventos.astro          (listing, inline data)
/eventos/[slug]          src/pages/eventos/[slug].astro   (detail, from events-service)
/eventos/club-lectura/[slug]
/cursos                  src/pages/cursos/index.astro
/cursos/femmbarre-maternity  + /[id] (video player)
/cursos/curso-lactancia
/auth/{login,register,callback,logout}   ← SSR (prerender=false)
/perfil                  ← SSR (prerender=false)
/blog  /blog/[...slug]   /sobre-mi  /contacto  /admin
```

## Data Files
`src/data/events.ts` · `src/data/club-lectura-events.ts` · `src/data/business-info.ts`
`src/data/faqs.ts` · `src/data/services.ts` · `src/data/stories-config.ts`

## Directus Collections
- Blog (live): `post`, `author`, `category`, `tag`
- Events (schema ready, Directus setup pending): `event`, `event_session`, `facilitator`, `event_schedule_item`, `event_gallery_item`
- Docs: `docs/directus-events-setup.md`

## Styling Conventions
Event palettes: `terracotta` (pink/red) · `sage` (green) · `cream-light`
Color field: `"from-terracotta/20 to-terracotta/5"` · Accent field: single color name

## Critical Gotchas
1. **Two event stores, both must be updated**: `src/pages/eventos.astro` (listing) + `src/data/events.ts` (detail) are separate objects — always update both.
2. **Date formats differ by store**: listing = `"17 Abril 2026"` (no "de"); detail = `"17 de Abril 2026"` (with "de") or compact range `"17 Abr - 15 May 2026"`.
3. **Multi-session `lastDateISO` is mandatory** in the listing store — without it `isEventPast` marks the event past after the first session.
4. **`USE_MOCK_DATA = true`** in both event services — data comes from `src/data/`, not Directus.
5. **Auth pages are SSR** (`prerender=false`); everything else is SSG.
6. **`src/data/announcements.ts`** has a pre-existing import error — do not modify unless fixing it.
7. **Courses route guard**: FemmBarre details page redirects users who already own the course to the video player.
8. **Directus SDK**: use `as any` for field/filter params — strict generics don't accept them otherwise.
9. **Analytics dev guard**: use `import.meta.env.DEV` (not `import.meta.env.ENV`) — `DEV` is set automatically by Astro/Vite, `ENV` is not.
10. **GA Consent Mode v2 Basic**: `gtag.js` is NOT loaded until the user accepts cookies. `dataLayer` is initialized early as a queue so consent default/update calls are preserved.

## Need More Detail?
- **Event type shapes** (full TS interfaces, multi-session rules, service functions): read `references/event-system.md`
- **Auth architecture** (file tree, DI container, SSR routes, OAuth config): read `references/auth.md`
