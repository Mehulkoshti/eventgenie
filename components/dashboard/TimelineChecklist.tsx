"use client";

import { useEffect, useState } from "react";
import type { TimelinePlan } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PriorityBadge } from "@/components/ui/Badge";

const STORAGE_KEY = "eventgenie-checklist-progress";

function loadChecked(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveChecked(state: Record<string, boolean>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures (private mode, quota, etc.) — UI still works.
  }
}

export function TimelineChecklist({ timeline }: { timeline: TimelinePlan }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Deliberately deferred to after mount: localStorage isn't available during
    // SSR, and reading it here (vs. a lazy initializer) avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked(loadChecked());
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecked(next);
      return next;
    });
  };

  const sorted = [...timeline.tasks].sort((a, b) => b.daysBeforeEvent - a.daysBeforeEvent);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Countdown checklist</h3>
        <span className="text-sm text-slate-500">{timeline.daysUntilEvent} days to go</span>
      </div>

      {timeline.urgentMode && (
        <p role="alert" className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          ⏱️ Tight timeline — tasks below have been compressed to fit your remaining days. Prioritize critical items first.
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {sorted.map((task) => (
          <li
            key={task.id}
            className={`flex items-start gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-800 ${
              checked[task.id] ? "opacity-50" : ""
            }`}
          >
            <input
              type="checkbox"
              id={task.id}
              checked={Boolean(checked[task.id])}
              onChange={() => toggle(task.id)}
              className="mt-1 h-4 w-4 accent-indigo-600"
            />
            <label htmlFor={task.id} className="flex-1 cursor-pointer">
              <p className={`font-medium ${checked[task.id] ? "line-through" : ""}`}>{task.task}</p>
              <p className="text-xs text-slate-500">
                {task.category} · due {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                {task.overdue && <span className="ml-2 font-medium text-rose-600">overdue</span>}
              </p>
            </label>
            <PriorityBadge priority={task.priority} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
