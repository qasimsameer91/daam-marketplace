"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChoiceOption<T extends string> {
  value: T;
  title: ReactNode;
  description?: string;
  icon?: ReactNode;
}

interface ChoiceCardsProps<T extends string> {
  name: string;
  legend: string;
  options: ChoiceOption<T>[];
  value: T | null | undefined;
  onChange: (next: T) => void;
  invalid?: boolean;
  describedBy?: string;
  columns?: 1 | 2;
}

/** Large radio cards with an explainer line each (PTA status, network lock, condition grade). */
export function ChoiceCards<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  invalid,
  describedBy,
  columns = 1,
}: ChoiceCardsProps<T>) {
  return (
    <fieldset
      id={`field-${name}`}
      tabIndex={-1}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className="flex flex-col gap-2 outline-none"
    >
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className={cn("grid gap-2", columns === 2 && "sm:grid-cols-2")}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label key={o.value} className="relative block">
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="peer absolute inset-0 size-full cursor-pointer opacity-0"
              />
              <span
                className={cn(
                  "flex h-full gap-3 rounded-card border p-4 peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                  checked
                    ? "border-foreground bg-muted"
                    : "border-input bg-surface hover:bg-muted/60",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    checked ? "border-foreground" : "border-input",
                  )}
                >
                  {checked ? <span className="size-2.5 rounded-full bg-foreground" /> : null}
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2 font-medium">
                    {o.icon}
                    {o.title}
                  </span>
                  {o.description ? (
                    <span className="text-sm text-muted-foreground">{o.description}</span>
                  ) : null}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
