"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChipOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface ChipGroupProps<T extends string> {
  /** Shared name for the native inputs; also used for `field-<name>` focus targets. */
  name: string;
  legend: string;
  options: ChipOption<T>[];
  /** Single choice (radios) or many (checkboxes). */
  multiple?: boolean;
  value: T | T[] | null | undefined;
  onChange: (next: T | T[]) => void;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
}

/**
 * One-tap chips (plan §8) built on native radios/checkboxes, so arrow keys, Space and screen
 * readers work without extra code. Each chip is at least 44px tall.
 */
export function ChipGroup<T extends string>({
  name,
  legend,
  options,
  multiple = false,
  value,
  onChange,
  invalid,
  describedBy,
  className,
}: ChipGroupProps<T>) {
  const selected = new Set(Array.isArray(value) ? value : value ? [value] : []);

  const toggle = (v: T) => {
    if (!multiple) return onChange(v);
    const next = new Set(selected);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange([...next] as T[]);
  };

  return (
    <fieldset
      id={`field-${name}`}
      tabIndex={-1}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn("flex flex-col gap-2 outline-none", className)}
    >
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = selected.has(o.value);
          return (
            <label key={o.value} className="relative">
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => toggle(o.value)}
                className="peer absolute inset-0 size-full cursor-pointer opacity-0"
              />
              <span
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 rounded-chip border px-4 text-sm peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                  checked
                    ? "border-transparent bg-secondary text-secondary-foreground"
                    : "border-input bg-surface text-foreground hover:bg-muted",
                )}
              >
                {checked ? <Check aria-hidden className="size-4" strokeWidth={2.5} /> : null}
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
