# 🎉 EventGenie — AI Celebration & Event Planner

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Tests](https://img.shields.io/badge/tests-27%20passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

A GenAI-powered planning assistant that turns a few basic facts about a wedding, birthday, or
community event into a complete, ready-to-use plan — budget, countdown timeline, vendor
checklist, and personalized theme ideas — in seconds.

**Live demo:** _add your deployed URL here before submission_

---

## Chosen vertical

**[Challenge 5] Celebration & Event Planner** — building a smart assistant for three personas:

| Persona | Event type | Core need |
|---|---|---|
| A couple planning their wedding | `wedding` | High-stakes, high-budget, many vendors, long lead times |
| A parent/host planning a birthday | `birthday` | Shorter runway, tighter budget, fun over formality |
| An organizer running a community event | `community` | Permits/logistics-heavy, variable turnout, public safety |

## What it does

1. **A 3-step form** collects event type, name, date, guest count, budget, location, vibe, and
   focus areas.
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
4. **Export/Print** turns the plan into a print-friendly page (save as PDF from the browser print
   dialog) — no backend file generation needed.
5. Checklist progress is remembered per-browser via `localStorage`, so returning to the plan keeps
   your checked-off tasks.

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
| Practical, real-world usability | Real INR budgeting, realistic vendor lead times, printable/exportable plan, persisted checklist progress |
| Clean, maintainable code | Pure functions in `lib/`, typed end-to-end, Zod-validated API boundary, 27 unit tests |

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
│   ├── page.tsx              # Landing page
│   ├── plan/page.tsx         # Wizard + results (client component)
│   └── api/plan/route.ts     # POST /api/plan — validates input, builds plan, calls AI
├── lib/
│   ├── types.ts              # Shared domain types
│   ├── schema.ts             # Zod request validation (shared client + server)
│   ├── budget-engine.ts      # Pure: budget allocation + tight-budget warning
│   ├── timeline-engine.ts    # Pure: countdown checklist + urgent-mode compression
│   ├── vendor-checklist.ts   # Pure: vendor list + book-immediately logic
│   ├── idea-engine.ts        # Pure: deterministic palette/theme/activity ideas
│   ├── plan-engine.ts        # Orchestrates the above into one PlanResult
│   ├── deepseek.ts           # server-only — AI narrative, key never reaches the browser
│   └── ratelimit.ts          # In-memory sliding-window limiter for the API route
├── components/
│   ├── wizard/                # Multi-step form
│   ├── dashboard/              # Budget/timeline/vendor/idea views
│   └── ui/                    # Shared Button, Card, Badge
└── __tests__/                 # Vitest unit tests for every lib/ module
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

27 unit tests (Vitest) cover every pure module in `lib/`:

- `budget-engine`: allocation sums to the full budget, per-guest math, tight-budget warning
  threshold, distinct rules per event type, zero-guest guard.
- `timeline-engine`: non-urgent vs. urgent-mode compression, overdue flagging, stable task
  ordering after compression.
- `vendor-checklist`: book-immediately flag vs. remaining lead time, per-event-type checklists.
- `idea-engine`: palette keyword matching and fallback, event-type-specific ideas.
- `schema`: accepts valid input, rejects bad enum/date/numbers, coerces form strings, applies
  defaults.
- `ratelimit`: allows under the cap, blocks over it, resets after the window, isolates clients.

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
DeepSeek Chat API

## License

MIT
