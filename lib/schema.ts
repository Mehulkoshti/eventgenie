import { z } from "zod";

export const eventInputSchema = z.object({
  eventType: z.enum(["wedding", "birthday", "anniversary", "babyShower", "graduation", "corporate", "community"]),
  eventName: z.string().trim().min(1).max(80),
  eventDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
  guestCount: z.coerce.number().int().min(1).max(100000),
  budget: z.coerce.number().min(1000).max(100000000),
  location: z.string().trim().min(1).max(120),
  vibe: z.string().trim().max(200).default(""),
  focusAreas: z.array(z.string().trim().max(40)).max(10).default([]),
});

export type EventInputParsed = z.infer<typeof eventInputSchema>;
