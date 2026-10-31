import { Sparkles } from "lucide-react";
import type { IdeaSet } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function IdeaCards({ ideas }: { ideas: IdeaSet }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-semibold">Personalized ideas</h3>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Color palette</p>
        <ul className="flex flex-wrap gap-3" aria-label="Suggested color palette">
          {ideas.palette.map((color) => (
            <li key={color} className="flex flex-col items-center gap-1">
              <span
                aria-hidden="true"
                className="h-9 w-9 rounded-full border border-slate-200 shadow-sm dark:border-slate-700"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-[10px] text-slate-500">{color}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Theme touches</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {ideas.themeIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Activity ideas</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {ideas.activityIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
