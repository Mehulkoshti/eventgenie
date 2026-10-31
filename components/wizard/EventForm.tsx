"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { eventInputSchema } from "@/lib/schema";
import type { EventInput } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ProgressSteps } from "./ProgressSteps";
import { StepEventBasics } from "./steps/StepEventBasics";
import { StepScaleBudget } from "./steps/StepScaleBudget";
import { StepVibeFocus } from "./steps/StepVibeFocus";
import { todayPlus } from "./constants";
import type { FormState } from "./types";

export { EVENT_TYPES } from "./constants";
export type { FormState } from "./types";

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

/** Validates only the fields collected on the given step; step 3 has no required fields. */
function validateStep(step: number, form: FormState): string | null {
  if (step === 1) {
    if (!form.eventName.trim()) return "Please name your event.";
    if (!form.eventDate) return "Please choose an event date.";
  }
  if (step === 2) {
    if (!form.location.trim()) return "Please tell us the city/location.";
    if (Number(form.guestCount) < 1 || Number(form.budget) < 1000) {
      return "Guest count and budget must be realistic positive numbers.";
    }
  }
  return null;
}

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

  const goNext = () => {
    const message = validateStep(step, form);
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    setStep((s) => Math.min(3, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const message = validateStep(step, form);
    if (message) {
      setError(message);
      return;
    }

    const parsed = eventInputSchema.safeParse(form);
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

      {step === 1 && <StepEventBasics form={form} update={update} />}
      {step === 2 && <StepScaleBudget form={form} update={update} />}
      {step === 3 && <StepVibeFocus form={form} update={update} />}

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
