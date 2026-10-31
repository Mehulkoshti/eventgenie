import type { EventType } from "@/lib/types";

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

export interface StepProps {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}
