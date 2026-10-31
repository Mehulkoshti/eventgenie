"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, CalendarDays, MapPin, Users, Wallet } from "lucide-react";
import type { EventInput, PlanResult } from "@/lib/types";
import { EventForm, EVENT_TYPES, type FormState } from "@/components/wizard/EventForm";
import { PlanDashboard } from "@/components/dashboard/PlanDashboard";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function LivePreview({ form }: { form: FormState | null }) {
  const type = EVENT_TYPES.find((t) => t.value === form?.eventType) ?? EVENT_TYPES[0];
  const name = form?.eventName.trim() || "Your event";
  const date = form?.eventDate ? new Date(form.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;
  const guestCount = Number(form?.guestCount || 0);
  const budget = Number(form?.budget || 0);

  return (
    <div className="sticky top-24 hidden lg:block">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Live preview</p>
        <span className="mt-3 block text-5xl" aria-hidden="true">
          {type.emoji}
        </span>
        <h3 className="mt-3 text-xl font-bold leading-snug">{name}</h3>
        <p className="text-sm text-indigo-100">{type.label}</p>

        <div className="mt-5 space-y-2.5 border-t border-white/20 pt-4 text-sm">
          <div className="flex items-center gap-2 text-indigo-50">
            <CalendarDays className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {date ?? "Pick a date"}
          </div>
          <div className="flex items-center gap-2 text-indigo-50">
            <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {form?.location.trim() || "Where's it happening?"}
          </div>
          <div className="flex items-center gap-2 text-indigo-50">
            <Users className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {guestCount > 0 ? `${guestCount} guests` : "Guest count"}
          </div>
          <div className="flex items-center gap-2 text-indigo-50">
            <Wallet className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {budget > 0 ? formatInr(budget) : "Budget"}
          </div>
        </div>

        {form?.focusAreas && form.focusAreas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {form.focusAreas.map((area) => (
              <span key={area} className="rounded-full bg-white/15 px-2.5 py-1 text-xs">
                {area}
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">Updates as you type — this is what we&apos;ll plan around.</p>
    </div>
  );
}

export default function PlanPage() {
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [livePreview, setLivePreview] = useState<FormState | null>(null);

  const handleSubmit = async (input: EventInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong generating your plan.");
      }

      const result: PlanResult = await response.json();
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong generating your plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            EventGenie
          </Link>
        </div>
      </header>

      <main id="main-content" className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/30 via-violet-300/20 to-fuchsia-300/20 blur-3xl dark:from-indigo-900/30 dark:via-violet-900/20 dark:to-fuchsia-900/10" />
        </div>

        <div className="mx-auto max-w-5xl px-6 py-14">
          {error && (
            <div className="mb-6">
              <Alert variant="danger" role="alert">
                {error}
              </Alert>
            </div>
          )}

          {plan ? (
            <PlanDashboard plan={plan} onStartOver={() => setPlan(null)} />
          ) : isSubmitting ? (
            <Card className="flex flex-col items-center gap-3 py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" aria-hidden="true" />
              <p className="font-medium">Generating your plan…</p>
              <p className="text-sm text-slate-500">Computing budget, timeline and vendors, then asking AI to personalize it.</p>
            </Card>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
              <div>
                <h1 className="mb-1 text-3xl font-bold">Tell us about your event</h1>
                <p className="mb-7 text-slate-500">Three quick steps — your plan appears right after.</p>
                <Card className="border-t-4 border-t-indigo-500 shadow-xl shadow-indigo-500/5">
                  <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} onChange={setLivePreview} />
                </Card>
              </div>
              <LivePreview form={livePreview} />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        Built for PromptWars · Challenge 5 — Celebration & Event Planner
      </footer>
    </div>
  );
}
