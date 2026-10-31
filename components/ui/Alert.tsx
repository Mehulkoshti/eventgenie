import type { ReactNode } from "react";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";

type Variant = "warning" | "danger" | "info" | "success";

const VARIANT_STYLES: Record<Variant, { wrap: string; icon: string; Icon: typeof Info }> = {
  warning: {
    wrap: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40",
    icon: "text-amber-600 dark:text-amber-400",
    Icon: AlertTriangle,
  },
  danger: {
    wrap: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40",
    icon: "text-rose-600 dark:text-rose-400",
    Icon: XCircle,
  },
  info: {
    wrap: "border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/40",
    icon: "text-indigo-600 dark:text-indigo-400",
    Icon: Info,
  },
  success: {
    wrap: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40",
    icon: "text-emerald-600 dark:text-emerald-400",
    Icon: CheckCircle2,
  },
};

export function Alert({
  variant = "info",
  title,
  children,
  role = "status",
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
  role?: "alert" | "status";
}) {
  const { wrap, icon, Icon } = VARIANT_STYLES[variant];

  return (
    <div role={role} className={`flex gap-3 rounded-xl border p-3.5 ${wrap}`}>
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${icon}`} aria-hidden="true" />
      <div className="text-sm">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-slate-700 dark:text-slate-300">{children}</div>
      </div>
    </div>
  );
}
