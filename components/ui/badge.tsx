import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * Chips are full pills (plan §4.5). Status tones use a solid token background with ink text,
 * which passes WCAG AA in light and dark mode. Always pair a tone with an icon + label.
 */
const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-chip border border-transparent px-2.5 text-xs font-medium whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        neutral: "bg-muted text-foreground",
        outline: "border-border text-foreground",
        success: "bg-success text-ink",
        warning: "bg-warning text-ink",
        danger: "bg-danger text-ink",
        destructive: "bg-destructive text-destructive-foreground",
        info: "bg-info text-ink",
        ghost: "hover:bg-muted",
        link: "text-foreground underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
