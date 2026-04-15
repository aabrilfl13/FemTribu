# Event System — Full Reference

## Two Parallel Stores (always update both)

### 1. Listing store — `src/pages/eventos.astro`

Inline `upcomingEvents` array. Shape:

```ts
{
  id: number
  title: string
  date: string          // "17 Abril 2026" — no "de"
  dateISO: string       // "2026-04-17" (first session for multi-day)
  lastDateISO?: string  // "2026-05-15" — REQUIRED for multi-session events
  sessions?: { date: string; dateISO: string }[]
  time: string          // "10:30" or "A confirmar"
  startTime: string     // "10:30:00"
  endTime: string       // "13:00:00"
  type: string          // "Presencial · Valencia" | "Online" | "Webinar"
  description: string
  spots: number | string
  price: string
  color: string         // e.g. "from-terracotta/20 to-cream/30"
  accent: string        // "terracotta" | "sage" | "cream-light"
  route: string         // internal path or external URL
  image: string
  location?: string
  locationAddress?: string
  facilitators?: { name: string; image: string }[]
}
```

### 2. Detail store — `src/data/events.ts`

Consumed by `src/pages/eventos/[slug].astro`. Typed as `Event` from `events-service.ts`. Adds:

```ts
{
  slug: string
  subtitle: string
  date: string          // "17 Abr - 15 May 2026" (range) or "17 de Abril 2026"
  dateISO: string       // first session ISO
  sessions?: { date: string; dateISO: string }[]  // uses "de" format: "17 de Abril 2026"
  duration: string
  whatYouWillLearn?: string[]
  schedule?: { time: string; activity: string; description?: string }[]
  facilitators?: { name: string; role: string; bio: string; image?: string; socialMedia?: {...} }[]
  includes?: string[]
  gallery?: { id: string; src: string; alt: string }[]
  video?: { directusId: string; alt?: string }
  whatsappNumber: string  // always "34640912048"
  seo: { title: string; description: string }
}
```

## Multi-Session Rules
- `sessions[]` goes in **both** stores
- Listing: `date` = first session ("17 Abril 2026"), `lastDateISO` = last session ISO — **mandatory**
- Detail: `date` = compact range ("17 Abr - 15 May 2026"), session items use "de" format
- `isEventPast` uses `event.lastDateISO ?? event.dateISO` — not string parsing
- `EventCalendar` uses `flatMap` to expand multi-session events into one entry per date

## Services

### `src/services/events-service.ts`
- `Event` — TS interface (source of truth)
- `fetchEvents()` / `fetchEvent(slug)` — backed by mock data (`USE_MOCK_DATA = true`)
- `generateCalendarLink(event)` — Google Calendar URL
- `generateShareLinks(event)` — WhatsApp, Twitter, Facebook, LinkedIn, email, copyLink
- `generateWhatsAppReservationLink(event, phoneNumber)` — pre-filled message

### `src/services/club-lectura-service.ts`
- `ClubLecturaEvent` — adds `book: { title, author, coverImage, description, topics }`
- `fetchClubLecturaEvents()` / `fetchClubLecturaEvent(slug)` — mock data in `src/data/club-lectura-events.ts`
- `generateCalendarLink(event, websiteUrl)`, `generateShareLinks(event, websiteUrl)`

### `src/services/directus.ts`
- Directus client instance
- `getAssetUrl(uuid)` → `${DIRECTUS_URL}/assets/${uuid}`
- Use `as any` for field/filter params — SDK strict generics reject them otherwise
