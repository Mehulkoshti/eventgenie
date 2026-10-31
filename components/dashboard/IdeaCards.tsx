import type { IdeaSet } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function IdeaCards({ ideas }: { ideas: IdeaSet }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Personalized ideas</h3>

      <div className="mt-3">
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Color palette</p>
        <div className="flex gap-2" role="list" aria-label="Suggested color palette">
          {ideas.palette.map((color) => (
            <span
              key={color}
              role="listitem"
              title={color}
              className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
