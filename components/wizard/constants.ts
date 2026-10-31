import type { EventType } from "@/lib/types";
import { MapPinned, UtensilsCrossed, Palette, Camera, Music, Mail, Shirt } from "lucide-react";

export const EVENT_TYPES: { value: EventType; label: string; emoji: string }[] = [
  { value: "wedding", label: "Wedding", emoji: "💍" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "anniversary", label: "Anniversary", emoji: "💞" },
  { value: "babyShower", label: "Baby shower", emoji: "👶" },
  { value: "graduation", label: "Graduation", emoji: "🎓" },
  { value: "corporate", label: "Corporate event", emoji: "🏢" },
  { value: "community", label: "Community event", emoji: "🎪" },
];

export const FOCUS_AREAS = [
  { label: "Venue", Icon: MapPinned },
  { label: "Catering", Icon: UtensilsCrossed },
  { label: "Decor", Icon: Palette },
  { label: "Photography", Icon: Camera },
  { label: "Entertainment", Icon: Music },
  { label: "Invitations", Icon: Mail },
  { label: "Attire", Icon: Shirt },
];

export const todayPlus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
