import type { Priority } from "@/lib/types";

const PRIORITY_CLASSES: Record<Priority, string> = {
  critical: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  important: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  optional: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${PRIORITY_CLASSES[priority]}`}
    >
      {priority}
    </span>
  );
}
