"use client";

import { useState } from "react";
import Link from "next/link";
import type { EventInput, PlanResult } from "@/lib/types";
import { EventForm } from "@/components/wizard/EventForm";
import { PlanDashboard } from "@/components/dashboard/PlanDashboard";

export default function PlanPage() {
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Link href="/" className="text-sm font-medium text-indigo-700 hover:underline">
          ← EventGenie
        </Link>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          {error}
        </p>
      )}

      {plan ? (
        <PlanDashboard plan={plan} onStartOver={() => setPlan(null)} />
      ) : (
        <div className="mx-auto max-w-xl">
          <h1 className="mb-6 text-2xl font-bold">Tell us about your event</h1>
          <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      )}
    </main>
  );
}
