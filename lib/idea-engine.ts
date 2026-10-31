import type { EventInput, EventType, IdeaSet } from "./types";

const PALETTES: { keywords: string[]; palette: string[] }[] = [
  { keywords: ["pastel", "soft", "blush"], palette: ["#F7D9DA", "#F4E9E1", "#CDE6D0", "#FFFFFF"] },
  { keywords: ["boho", "earthy", "rustic"], palette: ["#B5835A", "#D9C3A0", "#7A6C53", "#F5EFE6"] },
  { keywords: ["royal", "regal", "traditional"], palette: ["#7A0C2E", "#D4AF37", "#1B1B1B", "#F8EEDD"] },
  { keywords: ["beach", "tropical", "summer"], palette: ["#00A8A8", "#FFD166", "#FF6B6B", "#F7FFF7"] },
  { keywords: ["neon", "glow", "party"], palette: ["#FF00C8", "#00F0FF", "#39FF14", "#1A1A2E"] },
  { keywords: ["minimal", "modern", "monochrome"], palette: ["#111111", "#555555", "#CCCCCC", "#FFFFFF"] },
];

/**
 * Used when the vibe text doesn't match a specific keyword palette below.
 * Varies by event type so two events without a matching vibe still look
 * different, instead of every unmatched event falling back to one palette.
 */
const DEFAULT_PALETTES: Record<EventType, string[]> = {
  wedding: ["#F7D9DA", "#D4AF37", "#FFFFFF", "#F4E9E1"],
  birthday: ["#FF6B6B", "#FFD166", "#06D6A0", "#FFFFFF"],
  anniversary: ["#7A0C2E", "#D4AF37", "#F8EEDD", "#4A1E1E"],
  babyShower: ["#CDE6D0", "#F7D9DA", "#BFD7EA", "#FFFFFF"],
  graduation: ["#1B1B3A", "#FFD166", "#4361EE", "#FFFFFF"],
  corporate: ["#1F2937", "#2563EB", "#F3F4F6", "#FFFFFF"],
  community: ["#00A8A8", "#FF6B6B", "#FFD166", "#FFFFFF"],
};

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
  anniversary: [
    "A timeline wall of photos through the years",
    "A short speech/toast segment from close family",
    "Signature drink named after a shared memory",
  ],
  babyShower: [
    "A 'guess the due date' board at the entrance",
    "A wishes-for-baby card station",
    "Soft pastel balloon arch as the photo backdrop",
  ],
  graduation: [
    "A memory wall with throwback school/college photos",
    "A 'what's next' guestbook with well-wishes",
    "Cap-and-gown themed photo corner",
  ],
  corporate: [
    "A branded welcome backdrop for photo moments",
    "A short highlights/milestones recap segment",
    "QR-code feedback wall for attendee suggestions",
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
  anniversary: ["Live music or a curated playlist", "A slideshow of memories", "A toast and speech segment"],
  babyShower: ["Baby-themed games with small prizes", "A diaper-decorating station", "Advice cards for the parents-to-be"],
  graduation: ["Group photo sessions by friend circles", "A playlist request board", "A short video montage of memories"],
  corporate: ["Panel discussion or Q&A segment", "Networking icebreaker activity", "Recognition/awards segment"],
  community: ["Panel discussion or open mic segment", "Interactive booths/stalls", "Raffle or giveaway for participation"],
};

export function buildIdeas(input: EventInput): IdeaSet {
  const vibe = input.vibe.toLowerCase();
  const match = PALETTES.find((p) => p.keywords.some((k) => vibe.includes(k)));

  return {
    palette: match?.palette ?? DEFAULT_PALETTES[input.eventType],
    themeIdeas: THEME_IDEAS[input.eventType],
    activityIdeas: ACTIVITY_IDEAS[input.eventType],
  };
}
