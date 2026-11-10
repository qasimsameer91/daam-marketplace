"use client";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { models, brands } from "@/lib/mock/marketplace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("Market");
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  return (
    <form
      className="flex w-full gap-2"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        try {
          if (query.trim())
            localStorage.setItem(
              "daam-recent-searches",
              JSON.stringify(
                [query.trim(), ...recent.filter((q) => q !== query.trim())].slice(0, 5),
              ),
            );
        } catch {
          /* Browsing still works when storage is unavailable. */
        }
        router.push(`/phones${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
      }}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden
          className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label={t("search")}
          list={id}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            try {
              const saved: unknown = JSON.parse(
                localStorage.getItem("daam-recent-searches") ?? "[]",
              );
              if (Array.isArray(saved))
                setRecent(
                  saved
                    .filter(
                      (item): item is string => typeof item === "string" && item.length <= 150,
                    )
                    .slice(0, 5),
                );
            } catch {
              setRecent([]);
            }
          }}
          placeholder={t("searchPlaceholder")}
          className="h-12 bg-background ps-10"
        />
        <datalist id={id}>
          {models.map((m) => (
            <option key={m.slug} value={m.name} label={t("models")} />
          ))}
          {brands.map((b) => (
            <option key={b.slug} value={b.name} label={t("brand")} />
          ))}
          {recent.map((value) => (
            <option key={`recent-${value}`} value={value} label={t("recent")} />
          ))}
        </datalist>
      </div>
      <Button type="submit" size="lg" aria-label={t("search")}>
        {compact ? <Search aria-hidden /> : t("search")}
      </Button>
    </form>
  );
}
