"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export type MarketCard = {
  href: string;
  name: string;
  storage: string;
  price: string;
  city: string;
  condition: string;
  badge: string;
  pta: string;
  ptaApproved: boolean;
  battery: string;
  id: string;
};

export function MarketListingCard({ card }: { card: MarketCard }) {
  const t = useTranslations("DaamHome");
  const [saved, setSaved] = useState(false);

  return (
    <Link
      href={card.href}
      prefetch={false}
      className="group flex flex-col border-2 border-ink bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] reduced-motion:hover:translate-y-0 reduced-motion:hover:shadow-none"
    >
      <div className="relative flex aspect-square flex-col items-center justify-center gap-2 border-b-2 border-ink bg-sand">
        <span className="flex size-12 items-center justify-center rounded-full border-2 border-ink/40 text-[22px] text-ink/50">
          ⌁
        </span>
        <span className="text-xs font-semibold tracking-wide text-ink/50">{t("sellerPhoto")}</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSaved((v) => !v);
          }}
          aria-pressed={saved}
          aria-label={card.name}
          className={cn(
            "absolute end-[10px] top-[10px] flex size-[34px] items-center justify-center border-[1.5px] border-ink text-base text-ink",
            saved ? "bg-lime" : "bg-paper/90",
          )}
        >
          {saved ? "★" : "☆"}
        </button>
        <span className="absolute start-[10px] top-[10px] border-[1.5px] border-ink bg-paper px-2 py-[3px] text-[11px] font-bold">
          {card.badge}
        </span>
      </div>
      <div className="px-[15px] pt-[14px] pb-4">
        <div className="font-display text-[19px] font-bold tracking-[-0.4px]">{card.name}</div>
        <div className="mt-0.5 text-[13px] font-semibold text-slate">{card.storage}</div>
        <div className="mt-3">
          <span className="bg-lime [box-decoration-break:clone] px-[7px] py-[3px] font-display text-[17px] font-bold">
            {card.price}
          </span>
        </div>
        <div className="mt-[10px] flex flex-wrap gap-[6px]">
          <span
            className={cn(
              "border-[1.5px] border-ink px-2 py-[3px] text-[11px] font-bold",
              card.ptaApproved ? "bg-success" : "bg-danger",
            )}
          >
            {card.pta}
          </span>
          <span className="border-[1.5px] border-ink bg-white px-2 py-[3px] text-[11px] font-bold">
            🔋 {card.battery}
          </span>
        </div>
        <div className="mt-[11px] flex items-center gap-[7px] border-t-[1.5px] border-ink/[0.18] pt-[11px] text-[12.5px] font-semibold text-slate">
          <span>◉ {card.city}</span>
          <span className="opacity-40">|</span>
          <span>{card.condition}</span>
        </div>
      </div>
    </Link>
  );
}
