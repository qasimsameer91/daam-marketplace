import { Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafetyCardProps {
  title: string;
  /** Tip copy from content_blocks (never hard-coded). */
  tips: string[];
  intro?: string;
  className?: string;
}

/** Safe-meetup / check-before-you-pay card (plan §11). Calm, specific, never scary. */
export function SafetyCard({ title, tips, intro, className }: SafetyCardProps) {
  return (
    <section
      data-slot="safety-card"
      className={cn("flex flex-col gap-3 rounded-card border border-border bg-card p-4", className)}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
          <ShieldCheck aria-hidden className="size-5" strokeWidth={1.75} />
        </span>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      {intro ? <p className="text-sm text-muted-foreground">{intro}</p> : null}
      <ul className="flex flex-col gap-2">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2 text-sm">
            <Check
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              strokeWidth={2}
            />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
