import type { EventInput, EventType, IdeaSet } from "./types";

const PALETTES: { keywords: string[]; palette: string[] }[] = [
  { keywords: ["pastel", "soft", "blush"], palette: ["#F7D9DA", "#F4E9E1", "#CDE6D0", "#FFFFFF"] },
  { keywords: ["boho", "earthy", "rustic"], palette: ["#B5835A", "#D9C3A0", "#7A6C53", "#F5EFE6"] },
  { keywords: ["royal", "regal", "traditional"], palette: ["#7A0C2E", "#D4AF37", "#1B1B1B", "#F8EEDD"] },
  { keywords: ["beach", "tropical", "summer"], palette: ["#00A8A8", "#FFD166", "#FF6B6B", "#F7FFF7"] },
  { keywords: ["neon", "glow", "party"], palette: ["#FF00C8", "#00F0FF", "#39FF14", "#1A1A2E"] },
  { keywords: ["minimal", "modern", "monochrome"], palette: ["#111111", "#555555", "#CCCCCC", "#FFFFFF"] },
];

const DEFAULT_PALETTE = ["#6D5BFF", "#FFB84C", "#2EC4B6", "#F7F7F2"];

const THEME_IDEAS: Record<EventType, string[]> = {
  wedding: [
    "Welcome sign with the couple's story at the entrance",
    "A dedicated photo-booth corner with props matching the palette",
    "Signature mocktail/cocktail named after the couple",
  ],
  birthday: [
    "A memory wall with photos from past years",
    "Themed cake-cutting playlist moment",
    "DIY craft/activity corner for younger guests",
  ],
  community: [
    "Local volunteer recognition segment",
    "QR-code feedback wall for attendee suggestions",
    "Partner with a local vendor/NGO for a shared cause moment",
  ],
};

const ACTIVITY_IDEAS: Record<EventType, string[]> = {
  wedding: ["Live music during cocktail hour", "Guest book or video message station", "Sparkler or confetti send-off"],
  birthday: ["Theme-based games with small prizes", "Surprise video montage", "Photo booth with instant prints"],
  community: ["Panel discussion or open mic segment", "Interactive booths/stalls", "Raffle or giveaway for participation"],
};

export function buildIdeas(input: EventInput): IdeaSet {
  const vibe = input.vibe.toLowerCase();
  const match = PALETTES.find((p) => p.keywords.some((k) => vibe.includes(k)));

  return {
    palette: match?.palette ?? DEFAULT_PALETTE,
    themeIdeas: THEME_IDEAS[input.eventType],
    activityIdeas: ACTIVITY_IDEAS[input.eventType],
  };
}
