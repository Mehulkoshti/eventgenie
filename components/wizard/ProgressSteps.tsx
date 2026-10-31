const STEP_LABELS = ["Event basics", "Scale & budget", "Vibe & focus"];

export function ProgressSteps({ currentStep }: { currentStep: number }) {
  const percent = ((currentStep - 1) / (STEP_LABELS.length - 1)) * 100;

  return (
    <div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ol className="flex items-center justify-between" aria-label="Form progress">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isDone = stepNumber < currentStep;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                aria-current={isActive ? "step" : undefined}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isDone
                    ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white"
                    : isActive
                      ? "border-2 border-indigo-600 text-indigo-700 dark:text-indigo-400"
                      : "border border-slate-300 text-slate-400 dark:border-slate-700"
                }`}
              >
                {isDone ? "✓" : stepNumber}
              </span>
              <span
                className={`hidden text-sm sm:inline ${isActive ? "font-medium text-slate-900 dark:text-slate-100" : "text-slate-500"}`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
