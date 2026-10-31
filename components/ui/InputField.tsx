import type { InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export function InputField({ label, icon, id, className = "", ...props }: InputFieldProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-900 ${icon ? "pl-10" : ""} ${className}`}
          {...props}
        />
      </div>
    </label>
  );
}
