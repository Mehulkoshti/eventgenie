import { Sparkles, Tag, CalendarDays } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { EVENT_TYPES } from "../constants";
import type { StepProps } from "../types";

export function StepEventBasics({ form, update }: StepProps) {
  return (
    <fieldset className="animate-step-in space-y-5">
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
            <span className="block text-2xl transition-transform group-hover:scale-110" aria-hidden="true">
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
  );
}
