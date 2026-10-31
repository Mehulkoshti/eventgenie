import type { EventInput, EventType, Priority, TimelinePlan, TimelineTask } from "./types";

interface TaskTemplate {
  task: string;
  category: string;
  weeksBefore: number;
  priority: Priority;
}

const TIMELINE_TEMPLATES: Record<EventType, TaskTemplate[]> = {
  wedding: [
    { task: "Finalize guest list and budget", category: "Planning", weeksBefore: 36, priority: "critical" },
    { task: "Book venue", category: "Venue", weeksBefore: 32, priority: "critical" },
    { task: "Shortlist and book caterer", category: "Catering", weeksBefore: 24, priority: "critical" },
    { task: "Book photographer & videographer", category: "Photography", weeksBefore: 20, priority: "important" },
    { task: "Order outfits and finalize styling", category: "Attire", weeksBefore: 16, priority: "important" },
    { task: "Send invitations", category: "Stationery", weeksBefore: 10, priority: "important" },
    { task: "Confirm decor & floral order", category: "Decor", weeksBefore: 8, priority: "important" },
    { task: "Book entertainment/DJ", category: "Entertainment", weeksBefore: 8, priority: "optional" },
    { task: "Confirm final guest count with caterer", category: "Catering", weeksBefore: 2, priority: "critical" },
    { task: "Vendor payment & day-of schedule confirmation", category: "Planning", weeksBefore: 1, priority: "critical" },
  ],
  birthday: [
    { task: "Decide theme and guest list", category: "Planning", weeksBefore: 6, priority: "critical" },
    { task: "Book venue or confirm home setup", category: "Venue", weeksBefore: 5, priority: "critical" },
    { task: "Order cake and finalize menu", category: "Catering", weeksBefore: 3, priority: "critical" },
    { task: "Send invitations", category: "Stationery", weeksBefore: 3, priority: "important" },
    { task: "Book entertainer/activities", category: "Entertainment", weeksBefore: 2, priority: "important" },
    { task: "Order decor and return gifts", category: "Decor", weeksBefore: 2, priority: "important" },
    { task: "Confirm final headcount with vendors", category: "Catering", weeksBefore: 1, priority: "critical" },
  ],
  community: [
    { task: "Define goal, scope and budget", category: "Planning", weeksBefore: 10, priority: "critical" },
    { task: "Secure venue and local permits", category: "Venue", weeksBefore: 8, priority: "critical" },
    { task: "Line up speakers/performers", category: "Program", weeksBefore: 6, priority: "important" },
    { task: "Arrange catering/refreshments", category: "Catering", weeksBefore: 4, priority: "important" },
    { task: "Launch promotion (flyers, social posts)", category: "Promotion", weeksBefore: 4, priority: "important" },
    { task: "Arrange seating, signage & first-aid", category: "Logistics", weeksBefore: 2, priority: "critical" },
    { task: "Final volunteer & safety briefing", category: "Logistics", weeksBefore: 1, priority: "critical" },
  ],
  anniversary: [
    { task: "Decide theme, guest list and budget", category: "Planning", weeksBefore: 8, priority: "critical" },
    { task: "Book venue", category: "Venue", weeksBefore: 7, priority: "critical" },
    { task: "Book caterer and order cake", category: "Catering", weeksBefore: 4, priority: "critical" },
    { task: "Book photographer", category: "Photography", weeksBefore: 4, priority: "important" },
    { task: "Send invitations", category: "Stationery", weeksBefore: 3, priority: "important" },
    { task: "Confirm decor and entertainment", category: "Decor", weeksBefore: 2, priority: "important" },
    { task: "Confirm final headcount with vendors", category: "Catering", weeksBefore: 1, priority: "critical" },
  ],
  babyShower: [
    { task: "Decide theme and guest list", category: "Planning", weeksBefore: 6, priority: "critical" },
    { task: "Book venue or confirm home setup", category: "Venue", weeksBefore: 5, priority: "critical" },
    { task: "Order cake and finalize menu", category: "Catering", weeksBefore: 3, priority: "critical" },
    { task: "Send invitations", category: "Stationery", weeksBefore: 3, priority: "important" },
    { task: "Plan games and order favors", category: "Games & favors", weeksBefore: 2, priority: "important" },
    { task: "Order decor and backdrop", category: "Decor", weeksBefore: 2, priority: "important" },
    { task: "Confirm final headcount with vendors", category: "Catering", weeksBefore: 1, priority: "critical" },
  ],
  graduation: [
    { task: "Decide theme and guest list", category: "Planning", weeksBefore: 6, priority: "critical" },
    { task: "Book venue", category: "Venue", weeksBefore: 5, priority: "critical" },
    { task: "Order cake and finalize menu", category: "Catering", weeksBefore: 3, priority: "critical" },
    { task: "Book photographer/DJ", category: "Entertainment", weeksBefore: 3, priority: "important" },
    { task: "Send invitations", category: "Stationery", weeksBefore: 3, priority: "important" },
    { task: "Order decor and memory wall props", category: "Decor", weeksBefore: 2, priority: "important" },
    { task: "Confirm final headcount with vendors", category: "Catering", weeksBefore: 1, priority: "critical" },
  ],
  corporate: [
    { task: "Define objective, budget and guest list", category: "Planning", weeksBefore: 12, priority: "critical" },
    { task: "Book venue and confirm AV setup", category: "Venue", weeksBefore: 10, priority: "critical" },
    { task: "Confirm speakers/performers", category: "Program", weeksBefore: 8, priority: "important" },
    { task: "Book caterer", category: "Catering", weeksBefore: 6, priority: "critical" },
    { task: "Send invitations and open registration", category: "Stationery", weeksBefore: 4, priority: "important" },
    { task: "Confirm decor, branding and signage", category: "Decor", weeksBefore: 2, priority: "important" },
    { task: "Confirm final headcount with vendors", category: "Catering", weeksBefore: 1, priority: "critical" },
  ],
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function buildTimeline(input: EventInput, now: Date = new Date()): TimelinePlan {
  const eventDate = new Date(input.eventDate);
  const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / DAY_MS);
  const templates = TIMELINE_TEMPLATES[input.eventType];

  // Urgent mode: there isn't enough runway for the slowest template task.
  const longestLeadDays = Math.max(...templates.map((t) => t.weeksBefore * 7));
  const urgentMode = daysUntilEvent < longestLeadDays;

  const tasks: TimelineTask[] = templates.map((template, index) => {
    const naturalDaysBeforeEvent = template.weeksBefore * 7;
    // The ideal lead time has already passed relative to today — flagged
    // regardless of compression, so urgent-mode tasks still show as overdue.
    const naturalDueDate = new Date(eventDate.getTime() - naturalDaysBeforeEvent * DAY_MS);
    const overdue = naturalDueDate.getTime() < now.getTime();

    let daysBeforeEvent = naturalDaysBeforeEvent;
    if (urgentMode) {
      // Compress every task proportionally into the available runway, keeping relative order.
      const scale = Math.max(daysUntilEvent, 1) / longestLeadDays;
      daysBeforeEvent = Math.max(1, Math.round(naturalDaysBeforeEvent * scale));
    }

    const dueDate = new Date(eventDate.getTime() - daysBeforeEvent * DAY_MS);

    return {
      id: `${input.eventType}-${index}`,
      task: template.task,
      category: template.category,
      daysBeforeEvent,
      dueDate: dueDate.toISOString(),
      priority: template.priority,
      overdue,
    };
  });

  return { urgentMode, daysUntilEvent, tasks };
}
