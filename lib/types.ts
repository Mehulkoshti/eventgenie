export type EventType =
  | "wedding"
  | "birthday"
  | "anniversary"
  | "babyShower"
  | "graduation"
  | "corporate"
  | "community";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  wedding: "wedding",
  birthday: "birthday",
  anniversary: "anniversary",
  babyShower: "baby shower",
  graduation: "graduation party",
  corporate: "corporate event",
  community: "community event",
};

export type Priority = "critical" | "important" | "optional";

export interface EventInput {
  eventType: EventType;
  eventName: string;
  eventDate: string; // ISO date string
  guestCount: number;
  budget: number; // in INR
  location: string;
  vibe: string; // free-text theme/mood, e.g. "pastel garden, boho"
  focusAreas: string[]; // e.g. ["food", "decor", "photography"]
}

export interface BudgetLine {
  category: string;
  percent: number;
  amount: number;
  note: string;
}

export interface BudgetPlan {
  total: number;
  perGuest: number;
  lines: BudgetLine[];
  tightBudget: boolean;
  warning?: string;
}

export interface TimelineTask {
  id: string;
  task: string;
  dueDate: string; // ISO date string
  daysBeforeEvent: number;
  priority: Priority;
  category: string;
  overdue: boolean;
}

export interface TimelinePlan {
  urgentMode: boolean;
  daysUntilEvent: number;
  tasks: TimelineTask[];
}

export interface VendorItem {
  category: string;
  priority: Priority;
  leadTimeWeeks: number;
  bookImmediately: boolean;
  tips: string;
}

export interface VendorPlan {
  items: VendorItem[];
}

export interface IdeaSet {
  palette: string[];
  themeIdeas: string[];
  activityIdeas: string[];
}

export interface PlanResult {
  input: EventInput;
  budget: BudgetPlan;
  timeline: TimelinePlan;
  vendors: VendorPlan;
  ideas: IdeaSet;
  aiEnhanced: boolean;
  aiNarrative?: string;
  generatedAt: string;
}
