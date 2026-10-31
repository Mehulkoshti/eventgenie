"use client";

import { FormEvent, useState } from "react";
import { eventInputSchema } from "@/lib/schema";
import type { EventInput, EventType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ProgressSteps } from "./ProgressSteps";

const EVENT_TYPES: { value: EventType; label: string; emoji: string }[] = [
  { value: "wedding", label: "Wedding", emoji: "💍" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "anniversary", label: "Anniversary", emoji: "💞" },
  { value: "babyShower", label: "Baby shower", emoji: "👶" },
  { value: "graduation", label: "Graduation", emoji: "🎓" },
  { value: "corporate", label: "Corporate event", emoji: "🏢" },
  { value: "community", label: "Community event", emoji: "🎪" },
];

const FOCUS_AREAS = ["Venue", "Catering", "Decor", "Photography", "Entertainment", "Invitations", "Attire"];

const todayPlus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

interface FormState {
  eventType: EventType;
  eventName: string;
  eventDate: string;
  guestCount: string;
  budget: string;
  location: string;
  vibe: string;
  focusAreas: string[];
}

const INITIAL_STATE: FormState = {
  eventType: "wedding",
  eventName: "",
  eventDate: todayPlus(90),
  guestCount: "150",
  budget: "500000",
  location: "",
  vibe: "",
  focusAreas: [],
};

export function EventForm({ onSubmit, isSubmitting }: { onSubmit: (input: EventInput) => void; isSubmitting: boolean }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFocusArea = (area: string) => {
    setForm((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }));
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!form.eventName.trim()) {
        setError("Please name your event.");
        return false;
      }
      if (!form.eventDate) {
        setError("Please choose an event date.");
        return false;
      }
    }
    if (step === 2) {
      if (!form.location.trim()) {
        setError("Please tell us the city/location.");
        return false;
      }
      if (Number(form.guestCount) < 1 || Number(form.budget) < 1000) {
        setError("Guest count and budget must be realistic positive numbers.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const goNext = () => {
    if (validateStep()) setStep((s) => Math.min(3, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validateStep()) return;

    const candidate = {
      eventType: form.eventType,
      eventName: form.eventName,
      eventDate: form.eventDate,
      guestCount: form.guestCount,
      budget: form.budget,
      location: form.location,
      vibe: form.vibe,
      focusAreas: form.focusAreas,
    };

    const parsed = eventInputSchema.safeParse(candidate);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your inputs.");
      return;
    }

    setError(null);
    onSubmit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-describedby={error ? "form-error" : undefined}>
      <ProgressSteps currentStep={step} />

      {error && (
        <div id="form-error">
          <Alert variant="danger" role="alert">
            {error}
          </Alert>
        </div>
      )}

      {step === 1 && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">What are we celebrating?</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Event type">
            {EVENT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                role="radio"
                aria-checked={form.eventType === type.value}
                onClick={() => update("eventType", type.value)}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  form.eventType === type.value
                    ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 dark:bg-indigo-900/30"
                    : "border-slate-200 hover:border-indigo-300 dark:border-slate-700"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{type.emoji}</span>
                <p className="mt-1 text-sm font-medium">{type.label}</p>
              </button>
            ))}
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Event name</span>
            <input
              type="text"
              value={form.eventName}
              onChange={(e) => update("eventName", e.target.value)}
              placeholder="e.g. Rhea & Dev's Wedding"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Event date</span>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => update("eventDate", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              required
            />
          </label>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Scale & budget</legend>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Expected guest count</span>
            <input
              type="number"
              min={1}
              value={form.guestCount}
              onChange={(e) => update("guestCount", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Total budget (₹)</span>
            <input
              type="number"
              min={1000}
              step={1000}
              value={form.budget}
              onChange={(e) => update("budget", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">City/location</span>
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Jaipur"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              required
            />
          </label>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Vibe & focus areas</legend>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Describe the vibe/theme</span>
            <input
              type="text"
              value={form.vibe}
              onChange={(e) => update("vibe", e.target.value)}
              placeholder="e.g. pastel garden, boho, royal, minimal"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <div>
            <span className="mb-2 block text-sm font-medium">What matters most to you? (optional)</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Focus areas">
              {FOCUS_AREAS.map((area) => {
                const selected = form.focusAreas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    aria-pressed={selected}
                    onClick={() => toggleFocusArea(area)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>
        </fieldset>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={goBack} disabled={step === 1}>
          Back
        </Button>

        {step < 3 ? (
          <Button type="button" onClick={goNext}>
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Generating your plan…" : "Generate my plan"}
          </Button>
        )}
      </div>
    </form>
  );
}
