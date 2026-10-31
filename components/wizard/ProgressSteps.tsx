const STEP_LABELS = ["Event basics", "Scale & budget", "Vibe & focus"];

export function ProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Form progress">
      {STEP_LABELS.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-current={isActive ? "step" : undefined}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                isDone
                  ? "bg-indigo-600 text-white"
                  : isActive
                    ? "border-2 border-indigo-600 text-indigo-700"
                    : "border border-slate-300 text-slate-400"
              }`}
            >
              {isDone ? "✓" : stepNumber}
            </span>
            <span className={`text-sm ${isActive ? "font-medium text-slate-900 dark:text-slate-100" : "text-slate-500"}`}>
              {label}
            </span>
            {stepNumber < STEP_LABELS.length && <span className="mx-1 h-px w-6 bg-slate-300" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
