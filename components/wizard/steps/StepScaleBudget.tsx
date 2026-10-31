import { Wallet, Users, MapPin } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import type { StepProps } from "../types";

export function StepScaleBudget({ form, update }: StepProps) {
  return (
    <fieldset className="animate-step-in space-y-5">
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
  );
}
