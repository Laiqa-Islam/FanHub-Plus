# Fan Hub Plus

A Fandom Universe portal covering eight communities — Anime, Gaming, Movies, TV Shows, K-Pop,
Comics, Manga and Cosplay — built for the *End-to-End Web Solutions* SRS (v1.0).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · MongoDB Atlas
(Mongoose) · Cloudinary · Mailtrap · GSAP · react-toastify

---

## Installation

**Requirements:** Node.js 20.9+ and a MongoDB connection string.

```bash
npm install
```

Copy the environment template and fill in your own values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `SESSION_SECRET` | Key used to sign session JWTs (`openssl rand -base64 32`) |
| `CLOUDINARY_*` | Media uploads — avatars, article art, merch galleries |
| `MAILTRAP_*` | SMTP sandbox for verification and password-reset email |
| `NEXT_PUBLIC_APP_URL` | Base URL used to build emailed links |

Seed the database with demo content and the evaluation accounts:

```bash
npm run seed
```

Start the development server at <http://localhost:3000>:

```bash
npm run dev
```

Production build:

```bash
npm run build && npm run start
```

---

## User credentials

All three accounts are created by `npm run seed` and are pre-verified so they can be used
immediately.

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@fanhub.plus` | `Admin@12345` |
| Registered user | `user@fanhub.plus` | `User@12345` |
| Visitor | `visitor@fanhub.plus` | `Visitor@12345` |

Visitors can also browse without signing in at all — personalised features are the part that
requires an account.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run seed` | Populate demo content + evaluation accounts (safe to re-run) |
| `npm run typecheck` | TypeScript check with no emit |
| `npm run lint` | ESLint |

---

## Project layout

```
app/
  actions/        Server actions (auth, profile)
  layout.tsx      Root layout: fonts, theme, header/footer, toasts
  page.tsx        Landing page
  login/ register/ forgot-password/ reset-password/ verify-email/
  dashboard/ profile/
components/
  auth/           Auth shell and forms
  home/           Hero, ticker, channel grid, feature sections
  layout/         Header, footer, accessibility menu
  motion/         GSAP reveal, decode text, tilt, magnetic
  profile/        Profile editor
  providers/      Theme + accessibility context
  ui/             Button, form fields
lib/
  db.ts           Mongoose connection (cached across dev reloads)
  session.ts      JWT session cookie (jose)
  dal.ts          Data Access Layer — all authorisation checks
  cloudinary.ts   Media upload/destroy
  mail.ts         Verification and reset email
  rate-limit.ts   Fixed-window limiter
  validation.ts   Zod schemas
models/           Mongoose schemas
scripts/seed.ts   Database seeder
proxy.ts          Route gating (Next 16's replacement for middleware.ts)
```

---

## Implementation notes

**`proxy.ts`, not `middleware.ts`.** Next.js 16 renamed Middleware to Proxy; it runs on the
Node.js runtime and the exported function must be named `proxy`. It performs *optimistic* auth
checks only — it reads the signed cookie and redirects, with no database call, because it runs
on every request including prefetches. Real authorisation lives in `lib/dal.ts`, next to the
data.

**Sessions.** A signed HS256 JWT in an `httpOnly`, `sameSite=lax` cookie (`secure` in
production). Passwords are hashed with bcrypt at cost 12.

**Tokens.** Email-verification and password-reset tokens are stored only as SHA-256 hashes, so a
leaked database dump cannot be replayed. They are single-use, expire after an hour, and Mongo's
TTL monitor removes expired rows.

**Account enumeration.** Login returns one message whether the email is unknown or the password
is wrong. "Forgot password" and "resend verification" always return the same confirmation
regardless of whether the address exists.

**Animations degrade safely.** GSAP is driven by `requestAnimationFrame`. Where the frame loop
is stalled or throttled — a backgrounded tab at load, an embedded webview, power saving —
entrance animations that start at `opacity: 0` would otherwise leave content invisible
permanently. The hero timeline, the scroll reveals and the decode-text effect each carry a
`setTimeout` failsafe that snaps to the finished state, since timers keep firing where frames do
not. `prefers-reduced-motion` and the in-app "Reduce motion" toggle disable them outright.

**No commerce.** Per SRS §1.5 the merchandise showcase is for display and discovery only. There
is no cart, checkout, payment or order model anywhere in the schema or the code.

---

## Design language

The interface is built as a **fanzine press**: doujinshi, convention zines and risograph
pamphlets are where fandom's own print culture actually lives, so the properties of that
process drive the visual system rather than generic web-app conventions.

- **Spot inks, not a gradient palette.** Each of the eight channels is one Riso ink, and that
  ink identifies the channel everywhere it appears — strip, card rule, duotone, heading ghost.
- **Misregistration is the signature.** Headings print twice: the ink layer, and a spot-ink
  ghost a few pixels out of register behind it. The page-load sequence animates those layers
  *into* register, like a sheet going through a second pass.
- **Halftone, not smooth fills.** Photographs are greyscaled, duotoned in the channel ink and
  overlaid with a dot screen, so images read as printed rather than dropped in.
- **Square corners, hard shadows.** A trimmed page has no border radius and a printed object
  casts a hard offset shadow, not a blur.
- **Type**: Big Shoulders (condensed display, poster voice), Newsreader (editorial serif for
  reading), JetBrains Mono (the printer's voice — labels, counts, registration marks).

Motion follows the same logic: scroll reveals are an **ink roll** (a left-to-right clip-path
wipe) rather than a fade-up, and the loading state is eight ink passes rolling on in sequence.
All of it is disabled by `prefers-reduced-motion` and by the in-app "Reduce motion" toggle.

## Media

The Multimedia Center streams genuinely open-licensed media:

- **Video** — Blender Foundation open movies (*Sintel*, *Big Buck Bunny*, CC BY 3.0) plus CC0
  clips. Real animated footage, which suits an animation-heavy site far better than stock
  b-roll.
- **Audio** — freely licensed instrumental tracks.

Everything is served through `app/api/media/route.ts` rather than linked directly. That route
forwards Range requests (so seeking works), returns the upstream content type, and — most
importantly — **only proxies hosts on an explicit allowlist**. Forwarding an arbitrary
caller-supplied URL would make it an open proxy and an SSRF vector.

Proxying also makes playback same-origin, so it keeps working on networks and browser profiles
that block third-party media hosts, and it does not depend on upstream CORS headers.

Both players carry a stall timeout: a dead source often fires no `error` event at all, so
without it the viewer would watch a spinner forever. After 20 seconds without metadata the
player says so and offers a retry.

## Content and image licensing

The seed carries a real editorial library rather than placeholder text: 56 written pieces, 32
character profiles, 25 showcase items and 16 events, all authored for this project.

Photography is **licensed Unsplash stock**, hot-linked through `images.unsplash.com`. Every id
in `lib/stock-images.ts` was fetched and visually checked before being used, so the subject
matches the channel it appears under. No copyrighted franchise artwork is hosted or hot-linked
anywhere, which is what keeps the project clear of the licensing constraint in SRS §1.5.

Character cards deliberately use atmospheric stock photography under a channel-hue duotone
rather than character art — the treatment reads as design, not as a portrait claim, and the
detail page says so in as many words.

`npm run seed` prunes any record whose slug has left the library, so re-running it converges on
the current content rather than accumulating older runs. Approved fan submissions are exempt
from pruning.

## Status

Phases 0–3 of the implementation plan are complete:

- **Phase 0** — foundations, design system, MongoDB layer, seeding
- **Phase 1** — authentication, sessions, email verification, password reset, profiles
- **Phase 2** — Content Explorer with multi-level search, filtering, sorting and pagination;
  channel pages; article/media detail pages
- **Phase 3** — character profiles hub and detail pages, event highlights and calendar,
  merchandise showcase, fan submissions with the admin approval loop
- **Phase 4** — Multimedia Center: custom video and audio players, real CC-licensed media
  behind an allowlisted streaming proxy, format tabs, per-format admin media tagging, and
  5-star + thumbs ratings that feed the popularity score used for sorting sitewide
- **Phase 5** — merchandise showcase grouped by fandom, plate galleries with a keyboard-driven
  lightbox, tag filtering, per-item view tracking, and a month-grouped upcoming-releases
  calendar that merges merch drops with future-dated content
- **Phase 6** — clipping (bookmarking) any piece, character, catalogue plate or event, with
  private notes, a filtered clippings file, sharing, and a dashboard built around the member's
  own channels, clippings and activity

- **Phase 7** — location-aware event discovery: an OpenStreetMap map with channel-ink pins,
  browser geolocation, Nominatim city search, distance sorting and a city-filterable calendar
  with ticket links
- **Phase 8** — admin control panel: usage statistics, full CRUD for content, characters,
  merchandise, events and the chatbot knowledge base, feedback triage, user role management,
  and the categorised feedback form that feeds it

- **Phase 9** — the optional AI assistant: grounded FAQ answering, guided onboarding,
  personalised recommendations and persisted chat history, backed by Gemini

**All nine phases of the implementation plan are complete.**

## The AI assistant

The assistant (SRS FR-4) answers questions about the site, walks new readers through it, and
recommends real content. It uses Gemini via the REST API — no SDK, since we call exactly one
endpoint.

**It is grounded, not free-running.** Asked "can I buy the merchandise?", a bare model
cheerfully invented a Store tab and told the reader to start shopping — which directly
contradicts the no-commerce constraint in SRS §1.5. So every answer is assembled from the
database first (FAQ entries, content, events, showcase items, the real site map), and the
system instruction forbids going beyond it. The same question now answers correctly.

Other things worth knowing:

- **Chat history is persisted per session**, so context survives reloads and works for
  signed-out visitors as well as members — that is what the SRS means by "chat history stored
  for context continuity".
- **It degrades instead of failing.** Gemini returns 503 "high demand" fairly often, so the
  client walks a fallback chain of models; if every model fails, the route answers directly
  from the FAQ knowledge base. An answer that is slightly stiff beats "try again later".
- **Truncation is caught.** These models spend tokens on internal reasoning before answering,
  so a reply can come back cut off mid-sentence with `finishReason: MAX_TOKENS`. That is
  detected and retried with a larger budget rather than shown as half a sentence.
- **Model output is rendered as plain text, never HTML**, and the reference block is labelled
  as information rather than instruction so text inside it cannot redirect the assistant.
- The API key is server-side only. The widget is not rendered at all when `GEMINI_API_KEY` is
  absent, rather than offering a control that cannot work.

Retrieval is keyword scoring, not embeddings — at this corpus size it is enough, and it is
inspectable. Two details make it behave: fields are weighted (a title match counts four times
a body match, after flat scoring ranked a K-Pop piece about *pricing conventions* above
"Convention Sketch Gallery"), and terms are lightly stemmed (without it "conventions" failed
to match a title reading "Convention"). When nothing matches, the assistant offers no
recommendations rather than arbitrary ones.

## Maps and location

The events map uses **OpenStreetMap** directly — Leaflet with OSM raster tiles, no commercial
map provider and no API key. OSM requires visible attribution, which the Leaflet attribution
control provides and which must not be removed.

Leaflet is loaded through a dynamic import inside an effect rather than a static import: it
touches `window` at module scope, so importing it normally breaks server rendering. That also
keeps it out of the initial bundle for readers who never open the map.

**Distances are computed in the browser.** The alternative — posting the member's coordinates
to the server for a Mongo `$near` query — would mean their location travelling to, and
potentially being logged by, our infrastructure. Sixteen events sort instantly client-side, so
the position never leaves the device. The page says so plainly beneath the map.

City search goes through `app/api/geocode/route.ts` rather than straight to Nominatim, because
Nominatim's usage policy asks for an identifying `User-Agent` (which a browser fetch cannot
set) and at most one request per second (which only the server can enforce). Results are
cached for a day, since city coordinates do not move.

## Admin control panel

Every admin server action calls `requireAdmin()` as its first statement. Server actions are
public HTTP endpoints — gating the UI behind a role check would do nothing to stop a crafted
POST, so authorisation lives at the mutation, not in the component that renders the form.
`proxy.ts` and the admin layout add redirects on top of that, but they are convenience, not
the control.

Content, characters, merchandise, events and FAQ entries share one `ResourceManager`
component, differing only in their field list; the server still validates each kind against
its own Zod schema. Administrators cannot change their own role — without that guard, one
click could lock every administrator out of the panel.

## Clippings

Bookmarking is called *clipping* throughout the interface — you cut something out of a
magazine, you don't bookmark it — and the control is a pair of scissors.

A clipping can point at four different collections, so the target is stored as a
`(targetType, targetId)` pair rather than a typed foreign key. Two details make that safe:

- A **unique compound index** on `(userId, targetType, targetId)` is what actually guarantees
  one clipping per member per item. The toggle reads before it writes, so without the index a
  double click could race into duplicates; the action treats a duplicate-key error as success,
  because the row existing is the state the member wanted.
- Note updates are **scoped by `userId` in the query itself**, so guessing another member's
  bookmark id cannot edit their note.

Resolving a saved list batches one query per collection rather than one per clipping — forty
saved items is five queries, not forty-one — and targets deleted since they were clipped are
dropped from the results rather than rendering as blanks.

---

## AI tool acknowledgement

Claude (Anthropic) was used as a coding assistant during development, per the SRS guidance that
AI may support but not replace the developer's own work.
