"use client";
import { useMemo, useState } from "react";
import { ShieldCheck, ShoppingCart, Check, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

/** Serializable shape the server page passes down. No seller/contact data on Daam stock. */
export interface StorePhone {
  id: string;
  href: string;
  name: string;
  price: number;
  priceLabel: string;
  brand: string;
  available: boolean;
}

interface DaamStoreProps {
  phones: StorePhone[];
  brands: { slug: string; name: string }[];
}

const PAGE = 24;
const CART_KEY = "daam-cart";

function readCart(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeCart(ids: string[]) {
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(ids));
  } catch {
    /* private mode / blocked storage — cart stays in-memory only */
  }
}

/**
 * Daam's own "New mobiles" store — a secure, buy-direct experience (no chat, no bidding).
 * Search, brand categories, a hot strip, then a Buy / Add-to-cart grid.
 */
export function DaamStore({ phones, brands }: DaamStoreProps) {
  const t = useTranslations("DaamStore");
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string>("all");
  const [sort, setSort] = useState<"default" | "low" | "high">("default");
  const [shown, setShown] = useState(PAGE);
  const [cart, setCart] = useState<string[]>(() => readCart());

  const brandsPresent = useMemo(() => {
    const set = new Set(phones.map((p) => p.brand));
    return brands.filter((b) => set.has(b.slug));
  }, [phones, brands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = phones.filter((p) => {
      if (brand !== "all" && p.brand !== brand) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [phones, query, brand, sort]);

  // "Hot right now" — a few premium, in-stock sets, shown only on the default view.
  const hot = useMemo(
    () =>
      [...phones]
        .filter((p) => p.available)
        .sort((a, b) => b.price - a.price)
        .slice(0, 8),
    [phones],
  );
  const showHot = query.trim() === "" && brand === "all" && sort === "default";

  const inCart = (id: string) => cart.includes(id);

  function addToCart(id: string) {
    setCart((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeCart(next);
      return next;
    });
    toast.success(t("addedToCart"));
  }

  function buyNow(id: string) {
    addToCartSilent(id);
    toast.success(t("orderPlaced"));
  }

  function addToCartSilent(id: string) {
    setCart((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeCart(next);
      return next;
    });
  }

  return (
    <div>
      {/* STORE HEADER */}
      <div className="flex flex-col gap-3 border-2 border-ink bg-ink px-5 py-5 text-paper md:flex-row md:items-center md:justify-between md:px-7">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-bold tracking-[2px] text-lime uppercase">
            <ShieldCheck aria-hidden className="size-4" />
            {t("official")}
          </div>
          <h1 className="mt-1 font-display text-[clamp(26px,3.2vw,40px)] leading-none font-extrabold tracking-[-1px]">
            {t("title")}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-paper/30 px-3 py-2 text-[13px] font-semibold">
            <ShieldCheck aria-hidden className="size-4 text-lime" />
            {t("secureBadge")}
          </span>
          <span className="inline-flex items-center gap-2 border border-paper/30 px-3 py-2 text-[13px] font-semibold">
            <ShoppingCart aria-hidden className="size-4" />
            {t("cart")} · {cart.length}
          </span>
        </div>
      </div>
      <p className="mt-3 max-w-[680px] text-[15px] font-medium text-body">{t("intro")}</p>

      {/* SEARCH */}
      <div className="mt-5 flex items-center gap-[10px] border-2 border-ink bg-white px-4">
        <Search aria-hidden className="size-[18px] opacity-60" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShown(PAGE);
          }}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="w-full border-none bg-transparent py-[13px] text-[15px] text-ink outline-none"
        />
      </div>

      {/* CATEGORY CHIPS + SORT */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setBrand("all");
            setShown(PAGE);
          }}
          className={cn(
            "min-h-11 border-2 border-ink px-4 text-[13px] font-bold",
            brand === "all" ? "bg-lime" : "bg-white",
          )}
        >
          {t("allBrands")}
        </button>
        {brandsPresent.map((b) => (
          <button
            key={b.slug}
            type="button"
            onClick={() => {
              setBrand(b.slug);
              setShown(PAGE);
            }}
            className={cn(
              "min-h-11 border-2 border-ink px-4 text-[13px] font-bold",
              brand === b.slug ? "bg-lime" : "bg-white",
            )}
          >
            {b.name}
          </button>
        ))}
        <label className="ms-auto flex items-center gap-2 text-[13px] font-semibold">
          {t("sortLabel")}:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "default" | "low" | "high")}
            className="min-h-11 border-2 border-ink bg-white px-3 text-[13px] font-semibold"
          >
            <option value="default">{t("hotDeals")}</option>
            <option value="low">{t("priceLow")}</option>
            <option value="high">{t("priceHigh")}</option>
          </select>
        </label>
      </div>

      {/* HOT STRIP */}
      {showHot && hot.length > 0 ? (
        <section className="mt-7">
          <h2 className="mb-3 font-display text-[clamp(18px,2.2vw,26px)] font-extrabold tracking-[-0.6px]">
            🔥 {t("hotDeals")}
          </h2>
          <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
            {hot.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                prefetch={false}
                className="w-[180px] shrink-0 snap-start border-2 border-ink bg-white"
              >
                <div className="flex aspect-square items-center justify-center border-b-2 border-ink bg-sand text-[26px] text-ink/40">
                  ⌁
                </div>
                <div className="p-3">
                  <div className="truncate font-display text-[15px] font-bold">{p.name}</div>
                  <span className="mt-1 inline-block bg-lime px-[6px] py-[2px] font-display text-[14px] font-bold">
                    {p.priceLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* RESULTS GRID */}
      <h2 className="mt-8 mb-4 font-display text-[clamp(18px,2.2vw,26px)] font-extrabold tracking-[-0.6px]">
        {brand === "all"
          ? t("topModels")
          : (brandsPresent.find((b) => b.slug === brand)?.name ?? t("topModels"))}{" "}
        <span className="text-slate">({t("results", { count: filtered.length })})</span>
      </h2>

      {filtered.length === 0 ? (
        <p className="border-2 border-ink bg-white p-6 text-sm text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {filtered.slice(0, shown).map((p) => (
              <article
                key={p.id}
                className={cn(
                  "flex flex-col border-2 border-ink bg-white",
                  !p.available && "opacity-70",
                )}
              >
                <Link
                  href={p.href}
                  prefetch={false}
                  className="relative flex aspect-[4/3] items-center justify-center border-b-2 border-ink bg-sand text-[26px] text-ink/40 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  ⌁
                  {!p.available ? (
                    <span className="absolute start-[10px] top-[10px] border-[1.5px] border-ink bg-danger px-2 py-[3px] text-[11px] font-bold text-danger-ink">
                      {t("notAvailable")}
                    </span>
                  ) : null}
                </Link>
                <div className="flex flex-1 flex-col px-[13px] pt-[12px] pb-[13px]">
                  <Link
                    href={p.href}
                    prefetch={false}
                    className="font-display text-[16px] leading-tight font-bold tracking-[-0.3px] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {p.name}
                  </Link>
                  <div className="mt-[9px]">
                    <span className="bg-lime [box-decoration-break:clone] px-[7px] py-[3px] font-display text-[16px] font-bold">
                      {p.priceLabel}
                    </span>
                  </div>
                  <div className="mt-auto flex gap-2 pt-[13px]">
                    {p.available ? (
                      <>
                        <button
                          type="button"
                          onClick={() => addToCart(p.id)}
                          disabled={inCart(p.id)}
                          className={cn(
                            "inline-flex min-h-11 flex-1 items-center justify-center gap-1 border-2 border-ink text-[12px] font-bold disabled:opacity-60",
                            inCart(p.id) ? "bg-success" : "bg-white",
                          )}
                        >
                          {inCart(p.id) ? (
                            <>
                              <Check aria-hidden className="size-[14px]" />
                              {t("inCart")}
                            </>
                          ) : (
                            <>
                              <ShoppingCart aria-hidden className="size-[14px]" />
                              {t("addToCart")}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => buyNow(p.id)}
                          className="inline-flex min-h-11 flex-1 items-center justify-center border-2 border-ink bg-lime text-[12px] font-bold text-ink"
                        >
                          {t("buyNow")}
                        </button>
                      </>
                    ) : (
                      <span className="inline-flex min-h-11 flex-1 items-center justify-center border-2 border-ink/30 text-[12px] font-bold text-ink/40">
                        {t("notAvailable")}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {shown < filtered.length ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE)}
                className="border-2 border-ink bg-white px-6 py-3 font-display font-bold hover:bg-lime"
              >
                {t("loadMore")}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
