import { Palette } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { FOCUS_AREAS } from "../constants";
import type { StepProps } from "../types";

export function StepVibeFocus({ form, update }: StepProps) {
  const toggleFocusArea = (area: string) => {
    update(
      "focusAreas",
      form.focusAreas.includes(area) ? form.focusAreas.filter((a) => a !== area) : [...form.focusAreas, area],
    );
  };

  return (
    <fieldset className="animate-step-in space-y-5">
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
  );
}
