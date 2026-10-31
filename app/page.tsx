import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    title: "Smart budget split",
    body: "Budget allocation adapts to event type, guest count, and per-guest spend — with a tight-budget warning when numbers don't add up.",
  },
  {
    title: "Countdown timeline",
    body: "A task-by-task countdown that compresses itself automatically when your event date is close.",
  },
  {
    title: "Vendor checklist",
    body: "Category-by-category vendor list with lead times, so you know exactly what to book immediately.",
  },
  {
    title: "Personalized ideas",
    body: "Theme palettes and activity ideas tailored to your vibe, narrated by AI into one friendly summary.",
  },
];

export default function Home() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <section className="text-center">
        <p className="mb-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          GenAI Celebration & Event Planner
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Plan your next celebration in minutes, not weekends.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          EventGenie builds your budget, countdown timeline, vendor checklist and theme ideas for weddings, birthdays
          and community events — grounded in real planning logic, personalized by AI.
        </p>
        <div className="mt-8">
          <Link href="/plan">
            <Button className="px-6 py-3 text-base">Start planning →</Button>
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <h2 className="font-semibold">{feature.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{feature.body}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
