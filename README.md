# 🎉 EventGenie — AI Celebration & Event Planner

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Tests](https://img.shields.io/badge/tests-76%20passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

A GenAI-powered planning assistant that turns a few basic facts about a celebration into a
complete, ready-to-use plan — budget, countdown timeline, vendor checklist, and personalized
theme ideas — right on the landing page, in seconds.

**Live demo:** https://eventgenie-ai.netlify.app

---

## Chosen vertical

**[Challenge 5] Celebration & Event Planner** — building a smart assistant for seven personas,
each with their own budget shape, lead times, and vendor checklist:

| Persona | Event type | Core need |
|---|---|---|
| A couple planning their wedding | `wedding` | High-stakes, high-budget, many vendors, long lead times |
| A parent/host planning a birthday | `birthday` | Shorter runway, tighter budget, fun over formality |
| A couple celebrating an anniversary | `anniversary` | Intimate, sentimental, moderate budget |
| Friends/family planning a baby shower | `babyShower` | Games-and-favors-heavy, shorter runway |
| A family planning a graduation party | `graduation` | Mixed-age guests, memory-focused theming |
| A company planning a corporate event | `corporate` | AV/logistics-heavy, speaker/program coordination |
| An organizer running a community event | `community` | Permits/logistics-heavy, variable turnout, public safety |

## What it does

`/` is a marketing landing page (hero, feature highlights, "how it works"); `/plan` is the
planner itself — a 3-step form with a live preview card that updates as you type, and the full
generated plan appears right on the same page once you submit.

1. **A 3-step form** collects event type, name, date, guest count, budget, location, vibe, and
   focus areas, with a live preview panel reflecting your choices as you go.
2. **A deterministic planning engine** (pure TypeScript, fully unit-tested) immediately computes:
   - A **budget breakdown** with category percentages tuned per event type, a per-guest spend
     figure, and an automatic **tight-budget warning** when the per-guest spend is unrealistically
     low for that event type.
   - A **countdown checklist** of tasks with due dates worked backwards from the event date. If
     the event is too close for the normal lead times, the plan automatically switches to
     **urgent mode** and compresses the whole timeline to fit the remaining runway — while each
     task still shows whether its *ideal* lead time has already passed, so nothing's hidden.
   - A **vendor checklist** per category (venue, catering, photography, etc.) with typical booking
     lead times and a **"book immediately"** flag whenever the remaining time is shorter than that
     vendor's lead time.
   - **Theme ideas**: a color palette matched to the stated vibe/keywords, plus theme and activity
     suggestions for that event type.
3. **An AI narrative layer** sends those already-computed facts to an LLM, which writes a short,
   warm summary highlighting the top priorities and one personalized touch for the stated vibe.
   The AI never invents numbers — it only phrases facts the deterministic engine already computed.
4. **Download PDF** generates a real, multi-page PDF of the plan entirely in the browser
   (`@react-pdf/renderer`) — no backend file generation, and no dependence on the browser's own
   print-to-PDF dialog (which renders inconsistently across browsers/OSes).
5. Checklist progress is remembered per-browser via `localStorage`, so returning to the plan keeps
   your checked-off tasks.
6. Warnings, errors and status messages use a consistent `Alert` component (icon + colored card),
   not plain text — budget warnings, urgent-timeline notices, book-immediately flags, and form
   validation all look and read the same way.

## How Generative AI is used

| Where | What it does |
|---|---|
| `app/api/plan/route.ts` → `lib/deepseek.ts` | After the deterministic plan is built, the facts (budget, timeline, vendors, ideas) are sent to the **DeepSeek Chat API** (`deepseek-chat`) with a system prompt instructing it to summarize *only* the given facts and suggest one personalized touch based on the user's stated vibe. |

**Why AI only narrates, and never computes:** budgets, dates, and lead-time flags are the kind of
numbers a user will act on (book a vendor, pay a deposit). Letting an LLM compute them risks
hallucinated figures. Instead, all arithmetic and decision logic — allocation percentages, urgent
mode, book-immediately flags — lives in deterministic, unit-tested TypeScript in `lib/`. The AI's
job is strictly to make the output feel personal and readable. **If `DEEPSEEK_API_KEY` is unset or
the API call fails/times out, the app returns the full deterministic plan anyway** (`aiEnhanced:
false`) — every feature keeps working without the AI, by design.

**Gen AI service used:** DeepSeek Chat API (`deepseek-chat`), called once per plan generation,
server-side only.

## Problem-statement alignment

| Challenge expectation | How EventGenie addresses it |
|---|---|
| Smart, dynamic assistant | Form → deterministic engine → AI narrative pipeline, fully dynamic per event type |
| Logical decision making based on user context | Budget % varies by event type; tight-budget warning from per-guest spend; urgent-mode timeline compression from days-until-event; book-immediately flags from vendor lead time vs. remaining time |
| Practical, real-world usability | Real INR budgeting, realistic vendor lead times, a real downloadable PDF, persisted checklist progress, 7 event types |
| Clean, maintainable code | Pure functions in `lib/`, typed end-to-end, Zod-validated API boundary, 76 tests |

## Assumptions

- Currency is INR (₹); budget figures and per-guest thresholds are tuned for the Indian event
  market (the hackathon's likely primary audience). Swapping currency/locale is a one-line change
  in `BudgetBreakdown.tsx`'s `Intl.NumberFormat` call.
- Budget allocation percentages, task templates, and vendor lead times in `lib/*.ts` are reasonable
  defaults based on common event-planning guidance, not a licensed vendor database.
- "No backend" is interpreted as **no separate server/database to operate** — the app is a single
  deployable Next.js project. Its one API route is a stateless serverless function that exists
  solely to keep the AI API key off the client; it holds no persistent state of its own.
- The in-memory rate limiter resets on a serverless cold start, which is an accepted tradeoff for a
  demo-scale deployment (documented below, not hidden).

## Architecture

```
eventgenie/
├── app/
│   ├── page.tsx              # Landing page (thin wrapper around HomeExperience)
│   ├── plan/page.tsx          # Wizard + live preview + results (client component)
│   └── api/plan/route.ts     # POST /api/plan — validates input, builds plan, calls AI
├── components/
│   ├── HomeExperience.tsx     # Marketing landing: hero → features → how-it-works → CTA
│   ├── wizard/
│   │   ├── EventForm.tsx       # Orchestrator: step state, validation, submit
│   │   ├── steps/               # One component per step (basics/budget/vibe)
│   │   └── constants.ts, types.ts
│   ├── dashboard/               # Budget/timeline/vendor/idea views + PDF download
│   └── ui/                     # Shared Button, Card, Badge, Alert
├── lib/
│   ├── types.ts              # Shared domain types + EVENT_TYPE_LABELS
│   ├── schema.ts             # Zod request validation (shared client + server)
│   ├── budget-engine.ts      # Pure: budget allocation + tight-budget warning (7 event types)
│   ├── timeline-engine.ts    # Pure: countdown checklist + urgent-mode compression
│   ├── vendor-checklist.ts   # Pure: vendor list + book-immediately logic
│   ├── idea-engine.ts        # Pure: deterministic palette/theme/activity ideas
│   ├── plan-engine.ts        # Orchestrates the above into one PlanResult
│   ├── deepseek.ts           # server-only — AI narrative, key never reaches the browser
│   ├── ratelimit.ts          # In-memory sliding-window limiter for the API route
│   └── pdf/PlanDocument.tsx  # @react-pdf/renderer document definition for the PDF export
└── __tests__/                 # Vitest tests for every lib/ module, the API route, and key components
```

## Security

- **AI key never reaches the browser.** `lib/deepseek.ts` imports `server-only` and reads
  `process.env.DEEPSEEK_API_KEY` (no `NEXT_PUBLIC_` prefix) — it can only execute inside the
  `/api/plan` server route.
- **Input validation at the boundary.** Every request body is parsed with a Zod schema
  (`lib/schema.ts`) before touching any business logic; malformed input gets a `400`, never a
  crash.
- **Rate limiting.** `lib/ratelimit.ts` caps each client IP to 10 requests/minute on `/api/plan`,
  returning `429` beyond that — protecting both the AI budget and the deployment from abuse.
- **Prompt-injection guard.** The system prompt explicitly instructs the model to treat the JSON
  facts as data, never as instructions, and to only use the facts given (no invented vendors or
  prices).
- **Request timeout.** The DeepSeek call aborts after 9s via `AbortController`, so a slow upstream
  can't hang the request — the deterministic plan is still returned.
- **No secrets in the repo.** `.env*` is gitignored; `.env.example` documents the required variable
  with no real value.
- **Security headers.** `next.config.ts` sets `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a
  `Permissions-Policy` that denies camera/microphone/geolocation, on every route.

## Efficiency

- **PDF generation is lazy-loaded.** `@react-pdf/renderer` (~1.3MB) is dynamically imported only
  inside the Download PDF click handler (`DownloadPdfButton.tsx`) — it never ships in the initial
  `/plan` bundle, which most visitors load before ever generating a plan.
- **Static where possible.** `/` and `/plan` are prerendered as static HTML; only `/api/plan` is a
  dynamic serverless function.
- **No client-side AI calls.** The DeepSeek request happens once per plan generation, server-side,
  with a 9s timeout — no retries-on-the-client, no polling.
- **Deterministic math is synchronous and allocation-free of external calls** — budget/timeline/
  vendor/idea computation never touches the network, so it's instant regardless of AI latency.

## Accessibility

- Semantic HTML throughout: `<fieldset>`/`<legend>` for form groups, `<table>` with `<caption>`
  and `scope` for the budget breakdown, proper `<label htmlFor>` pairing for every input.
- Keyboard-operable custom controls (event-type cards, focus-area toggles) use
  `role="radio"`/`role="group"` with `aria-checked`/`aria-pressed`, not just styled `<div>`s.
- A "Skip to main content" link (`app/layout.tsx`) for keyboard/screen-reader users.
- Live validation and AI-fallback messages use `role="alert"` so they're announced immediately.
- Respects `prefers-reduced-motion` globally; visible `:focus-visible` outlines on every
  interactive element.
- Color is never the only signal — priority badges and overdue tasks pair color with text labels.

## Testing

76 tests (Vitest + Testing Library) cover every pure module in `lib/`, the API route itself, and
key component behavior:

- `budget-engine`: allocation sums to exactly 100% of the budget for every event type, per-guest
  math, tight-budget warning threshold, distinct rules per event type, zero-guest guard.
- `timeline-engine`: non-urgent vs. urgent-mode compression, overdue flagging, stable task
  ordering after compression.
- `vendor-checklist`: book-immediately flag vs. remaining lead time, non-empty checklist for every
  event type.
- `idea-engine`: palette keyword matching and an event-type-specific (not shared) default palette
  when nothing matches, event-type-specific theme/activity ideas.
- `schema`: accepts all 7 event types, rejects bad enum/date/numbers, coerces form strings,
  applies defaults.
- `ratelimit`: allows under the cap, blocks over it, resets after the window, isolates clients.
- `plan-engine`: assembles budget/timeline/vendor/idea output from one input, starts
  un-enhanced until the route adds a narrative, feeds the timeline's real days-until-event into
  the vendor checklist (not a hardcoded value).
- `deepseek`: skips the network entirely (no `fetch` call) when no API key is set, and returns
  `null` — never throws — on a non-OK response or a network error, so the route's deterministic
  fallback always has a clean signal to act on.
- **`POST /api/plan` (the actual route handler, not just the engines it calls)**: returns a full
  plan for valid input, 400s on invalid input or malformed JSON without crashing, and 429s after
  repeated requests from the same client.
- `Alert`: renders title/children, defaults to a non-interrupting `status` role, switches to
  `alert` when passed explicitly.
- `EventForm`: renders all 7 event types with the right default selection, blocks advancing past
  step 1 without a name, advances once required fields are filled, reports live state via
  `onChange`.

```bash
npm run test        # run once
npm run test:watch  # watch mode
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, test, and build on every push/PR.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in DEEPSEEK_API_KEY (optional — app works without it)
npm run dev
```

| Variable | Required | Description |
|---|---|---|
| `DEEPSEEK_API_KEY` | No | Enables the AI narrative. Without it, the deterministic plan is still fully functional. |
| `DEEPSEEK_MODEL` | No | Defaults to `deepseek-chat`. |

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run test` | Run unit tests once |
| `npm run test:watch` | Unit tests in watch mode |

## Tech stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS 4 · Zod · Vitest + Testing Library ·
DeepSeek Chat API · deployed on Netlify (serverless function for `/api/plan`)

## License

MIT
