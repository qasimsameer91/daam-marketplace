import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQ accordion built on native <details>: keyboard-accessible and works without JavaScript. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border rounded-card border border-border">
      {items.map((item) => (
        <details
          key={item.question}
          className="group px-4 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 font-medium">
            {item.question}
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 transition-transform duration-(--duration-base) group-open:rotate-180 reduced-motion:transition-none"
            />
          </summary>
          <p className="pb-4 text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
