"use client";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CampaignCreativeProps {
  title: string;
  eyebrow?: string;
  description?: string;
  cta: string;
  href?: string;
  desktop?: string | null;
  mobile?: string | null;
  theme: string;
  previewMobile?: boolean;
  compact?: boolean;
}
export function CampaignCreative({
  title,
  eyebrow,
  description,
  cta,
  href,
  desktop,
  mobile,
  theme,
  previewMobile = false,
  compact = false,
}: CampaignCreativeProps) {
  const [failed, setFailed] = useState<string[]>([]);
  const art = previewMobile ? mobile || desktop : desktop;
  const mobileArt = mobile || desktop;
  const image = (url: string, small: boolean) =>
    !failed.includes(url) ? (
      <Image
        key={`${small}-${url}`}
        unoptimized
        fill
        src={url}
        alt=""
        sizes={small ? "390px" : "(max-width:768px) 100vw, 1280px"}
        onError={() => setFailed((old) => [...old, url])}
        className={cn(
          "object-cover opacity-75",
          !previewMobile && (small ? "md:hidden" : "hidden md:block"),
        )}
      />
    ) : null;
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-card border border-border",
        theme === "dark"
          ? "bg-ink text-paper"
          : theme === "pearl"
            ? "bg-pearl text-ink"
            : theme === "lime" || theme === "sand"
              ? "bg-sand text-ink"
              : "bg-paper text-ink",
        compact ? "p-5" : "p-7 md:p-10",
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-20">
        {art ? image(art, false) : null}
        {!previewMobile && mobileArt ? image(mobileArt, true) : null}
      </div>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r rtl:bg-gradient-to-l",
          theme === "dark"
            ? "from-ink via-ink/95 to-ink/20"
            : theme === "pearl"
              ? "from-pearl via-pearl/95 to-pearl/20"
              : theme === "sand" || theme === "lime"
                ? "from-sand via-sand/95 to-sand/20"
                : "from-paper via-paper/95 to-paper/20",
        )}
      />
      <div className={cn("max-w-xl", previewMobile && "max-w-full")}>
        {eyebrow ? (
          <p className="mb-3 text-[0.65rem] font-semibold tracking-[0.18em] uppercase opacity-80">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "font-semibold tracking-display",
            compact || previewMobile ? "text-2xl" : "text-3xl md:text-4xl",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed opacity-80">{description}</p>
        ) : null}
        {href ? (
          <a
            href={href}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-current/25 px-5 text-sm font-semibold"
          >
            {cta}
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        ) : (
          <span className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-current/25 px-5 text-sm font-semibold">
            {cta}
            <ArrowUpRight aria-hidden className="size-4" />
          </span>
        )}
      </div>
    </div>
  );
}
