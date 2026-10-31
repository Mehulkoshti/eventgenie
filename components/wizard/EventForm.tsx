"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Tag,
  CalendarDays,
  Users,
  Wallet,
  MapPin,
  Palette,
  MapPinned,
  UtensilsCrossed,
  Camera,
  Music,
  Mail,
  Shirt,
} from "lucide-react";
import { eventInputSchema } from "@/lib/schema";
import type { EventInput, EventType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { InputField } from "@/components/ui/InputField";
import { ProgressSteps } from "./ProgressSteps";

export const EVENT_TYPES: { value: EventType; label: string; emoji: string }[] = [
  { value: "wedding", label: "Wedding", emoji: "💍" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "anniversary", label: "Anniversary", emoji: "💞" },
  { value: "babyShower", label: "Baby shower", emoji: "👶" },
  { value: "graduation", label: "Graduation", emoji: "🎓" },
  { value: "corporate", label: "Corporate event", emoji: "🏢" },
  { value: "community", label: "Community event", emoji: "🎪" },
];

const FOCUS_AREAS = [
  { label: "Venue", Icon: MapPinned },
  { label: "Catering", Icon: UtensilsCrossed },
  { label: "Decor", Icon: Palette },
  { label: "Photography", Icon: Camera },
  { label: "Entertainment", Icon: Music },
  { label: "Invitations", Icon: Mail },
  { label: "Attire", Icon: Shirt },
];

const todayPlus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export interface FormState {
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

export function EventForm({
  onSubmit,
  isSubmitting,
  onChange,
}: {
  onSubmit: (input: EventInput) => void;
  isSubmitting: boolean;
  onChange?: (form: FormState) => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onChange?.(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

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
        <fieldset key="step-1" className="animate-step-in space-y-5">
          <legend className="mb-3 flex items-center gap-1.5 text-base font-semibold">
            <Sparkles className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            What are we celebrating?
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Event type">
            {EVENT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                role="radio"
                aria-checked={form.eventType === type.value}
                onClick={() => update("eventType", type.value)}
                className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
                  form.eventType === type.value
                    ? "border-transparent bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                    : "border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <span
                  className="block text-2xl transition-transform group-hover:scale-110"
                  aria-hidden="true"
                >
                  {type.emoji}
                </span>
                <p className={`mt-1.5 text-sm font-semibold ${form.eventType === type.value ? "text-white" : ""}`}>
                  {type.label}
                </p>
              </button>
            ))}
          </div>

          <InputField
            label="Event name"
            icon={<Tag className="h-4 w-4" aria-hidden="true" />}
            type="text"
            value={form.eventName}
            onChange={(e) => update("eventName", e.target.value)}
            placeholder="e.g. Rhea & Dev's Wedding"
            required
          />

          <InputField
            label="Event date"
            icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
            type="date"
            value={form.eventDate}
            onChange={(e) => update("eventDate", e.target.value)}
            required
          />
        </fieldset>
      )}

      {step === 2 && (
        <fieldset key="step-2" className="animate-step-in space-y-5">
          <legend className="mb-3 flex items-center gap-1.5 text-base font-semibold">
            <Wallet className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            Scale & budget
          </legend>

          <InputField
            label="Expected guest count"
            icon={<Users className="h-4 w-4" aria-hidden="true" />}
            type="number"
            min={1}
            value={form.guestCount}
            onChange={(e) => update("guestCount", e.target.value)}
            required
          />

          <InputField
            label="Total budget (₹)"
            icon={<Wallet className="h-4 w-4" aria-hidden="true" />}
            type="number"
            min={1000}
            step={1000}
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
            required
          />

          <InputField
            label="City/location"
            icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
            type="text"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Jaipur"
            required
          />
        </fieldset>
      )}

      {step === 3 && (
        <fieldset key="step-3" className="animate-step-in space-y-5">
          <legend className="mb-3 flex items-center gap-1.5 text-base font-semibold">
            <Palette className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            Vibe & focus areas
          </legend>

          <InputField
            label="Describe the vibe/theme"
            icon={<Palette className="h-4 w-4" aria-hidden="true" />}
            type="text"
            value={form.vibe}
            onChange={(e) => update("vibe", e.target.value)}
            placeholder="e.g. pastel garden, boho, royal, minimal"
          />

          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              What matters most to you? (optional)
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Focus areas">
              {FOCUS_AREAS.map(({ label: area, Icon }) => {
                const selected = form.focusAreas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    aria-pressed={selected}
                    onClick={() => toggleFocusArea(area)}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                      selected
                        ? "border-transparent bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm"
                        : "border-slate-300 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {area}
                  </button>
                );
              })}
            </div>
          </div>
        </fieldset>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        <Button type="button" variant="ghost" onClick={goBack} disabled={step === 1}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>

        {step < 3 ? (
          <Button type="button" onClick={goNext}>
            Next
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Generating your plan…" : "Generate my plan"}
          </Button>
        )}
      </div>
    </form>
  );
}
