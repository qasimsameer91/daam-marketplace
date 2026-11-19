import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-7 flex flex-wrap items-end justify-between gap-5", className)}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 text-[0.65rem] font-bold tracking-[0.2em] text-clay-ink uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-[clamp(1.7rem,3vw,2.6rem)] leading-tight font-semibold tracking-display rtl:leading-[1.8]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
