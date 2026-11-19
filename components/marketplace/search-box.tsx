"use client";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { models, brands, cities } from "@/lib/mock/marketplace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBox({
  compact = false,
  discovery = false,
}: {
  compact?: boolean;
  discovery?: boolean;
}) {
  const t = useTranslations("Market");
  const r = useTranslations("Redesign");
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  return (
    <form
      className={
        discovery
          ? "grid w-full gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto_auto]"
          : "flex w-full gap-2"
      }
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
        const parameters = new URLSearchParams();
        if (query.trim()) parameters.set("q", query.trim());
        if (discovery && city) parameters.set("city", city);
        if (discovery && budget) parameters.set(budget === "150000" ? "min" : "max", budget);
        router.push(`/phones${parameters.size ? `?${parameters}` : ""}`);
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
          className={
            discovery
              ? "h-12 border-transparent bg-surface ps-10 text-foreground shadow-none"
              : "h-12 bg-background ps-10 text-foreground"
          }
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
      {discovery ? (
        <>
          <label className="flex min-h-12 items-center lg:border-s lg:border-border lg:ps-4">
            <span className="sr-only">{t("city")}</span>
            <select
              aria-label={t("city")}
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="h-12 w-full rounded-xl bg-surface px-3 text-sm text-muted-foreground"
            >
              <option value="">{r("allPakistan")}</option>
              {cities.map((value) => (
                <option key={value} value={value}>
                  {t(`cities.${value}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-h-12 items-center lg:border-s lg:border-border lg:ps-4">
            <span className="sr-only">{r("anyBudget")}</span>
            <select
              aria-label={r("anyBudget")}
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              className="h-12 w-full rounded-xl bg-surface px-3 text-sm text-muted-foreground"
            >
              <option value="">{r("anyBudget")}</option>
              <option value="50000">{r("under50")}</option>
              <option value="100000">{r("under100")}</option>
              <option value="150000">{r("above150")}</option>
            </select>
          </label>
        </>
      ) : null}
      <Button type="submit" size="lg" aria-label={t("search")}>
        {compact ? <Search aria-hidden /> : discovery ? r("findPhone") : t("search")}
      </Button>
    </form>
  );
}
