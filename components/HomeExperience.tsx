import Link from "next/link";
import { Sparkles, Wallet, CalendarClock, Store, Palette } from "lucide-react";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    Icon: Wallet,
    title: "Smart budget split",
    body: "Allocation adapts to event type, guest count, and per-guest spend — with a tight-budget warning when numbers don't add up.",
  },
  {
    Icon: CalendarClock,
    title: "Countdown timeline",
    body: "A task-by-task countdown that compresses itself automatically when your event date is close.",
  },
  {
    Icon: Store,
    title: "Vendor checklist",
    body: "Category-by-category vendor list with lead times, so you know exactly what to book immediately.",
  },
  {
    Icon: Palette,
    title: "Personalized ideas",
    body: "Theme palettes and activity ideas tailored to your vibe, narrated by AI into one friendly summary.",
  },
];

const STEPS = [
  { title: "Tell us about your event", body: "Type, date, guest count, budget, location and vibe — one short 3-step form." },
  { title: "We compute your plan", body: "Deterministic engines build the budget, timeline, vendor checklist and ideas instantly." },
  { title: "AI personalizes it", body: "DeepSeek turns the numbers into a friendly, actionable summary just for your event." },
];

export function HomeExperience() {
  return (
    <>
      <header id="top" className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <a href="#top" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            EventGenie
          </a>
          <Link
            href="/plan"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Start planning
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/40 via-violet-300/30 to-fuchsia-300/30 blur-3xl dark:from-indigo-900/40 dark:via-violet-900/30 dark:to-fuchsia-900/20" />
          </div>

          <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
            <p className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-300">
              GenAI Celebration & Event Planner
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Plan your next celebration
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                in minutes, not weekends.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              EventGenie builds your budget, countdown timeline, vendor checklist and theme ideas for weddings,
              birthdays, baby showers, graduations, corporate events and community events — grounded in real
              planning logic, personalized by AI.
            </p>
            <div className="mt-9">
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.02]"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Start planning — it&apos;s free
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ Icon, title, body }) => (
              <Card key={title} className="transition-shadow hover:shadow-md">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-2xl font-bold">How it works</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <div key={step.title} className="text-center">
                  <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold">Ready to plan your celebration?</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-500">
            It takes about a minute to fill in, and your full plan — budget, timeline, vendors and ideas — appears
            right after.
          </p>
          <div className="mt-6">
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.02]"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Start planning
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        Built for PromptWars · Challenge 5 — Celebration & Event Planner
      </footer>
    </>
  );
}
