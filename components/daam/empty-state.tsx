import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** One clear action (plan §13.5), e.g. a Button or Link. */
  action?: ReactNode;
  /** `error` uses an alert role so screen readers announce it. */
  variant?: "empty" | "error";
  className?: string;
}

/** Empty / error state: line-style illustration, one line of copy, a single CTA. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "empty",
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      role={variant === "error" ? "alert" : undefined}
      className={cn("flex flex-col items-center gap-3 px-4 py-10 text-center", className)}
    >
      <span className="flex size-16 items-center justify-center rounded-full border border-dashed border-input text-muted-foreground">
        <Icon aria-hidden className="size-7" strokeWidth={1.25} />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
