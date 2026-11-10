import type { MockListing } from "@/lib/mock/marketplace";

export interface BrowseFilters {
  q: string;
  brand: string;
  model: string;
  city: string;
  area: string;
  pta: string;
  lock: string;
  condition: string;
  storage: number;
  ram: number;
  min: number;
  max: number;
  battery: number;
  color: string;
  seller: string;
  warranty: boolean;
  box: boolean;
  imei: boolean;
  checked: boolean;
  days: number;
  sort: string;
}
export function filterListings(
  items: MockListing[],
  f: BrowseFilters,
  now: Date,
  aliases: { name: string; slug: string; aliases: string[] }[],
) {
  const query = f.q.trim().toLowerCase();
  const matches = aliases
    .filter((m) => [m.name, ...m.aliases].some((a) => a.toLowerCase().includes(query)))
    .map((m) => m.slug);
  const result = items.filter(
    (l) =>
      (!query ||
        `${l.modelName} ${l.brand} ${l.variantLabel}`.toLowerCase().includes(query) ||
        matches.includes(l.model)) &&
      (!f.brand ||
        l.brand === f.brand ||
        (f.brand === "xiaomi" && ["redmi", "poco"].includes(l.brand))) &&
      (!f.model || l.model === f.model) &&
      (!f.city || l.citySlug === f.city) &&
      (!f.area || l.areaSlug === f.area) &&
      (!f.pta || l.ptaStatus === f.pta) &&
      (!f.lock || l.networkLock === f.lock) &&
      (!f.condition || l.condition === f.condition) &&
      (!f.storage || l.storage === f.storage) &&
      (!f.ram || l.ram === f.ram) &&
      (!f.min || l.pricePkr >= f.min) &&
      (!f.max || l.pricePkr <= f.max) &&
      (!f.battery || (l.batteryHealth !== null && l.batteryHealth >= f.battery)) &&
      (!f.color || l.color === f.color) &&
      (!f.seller ||
        (f.seller === "shop" ? l.verification === "shop" : l.verification !== "shop")) &&
      (!f.warranty || l.warranty) &&
      (!f.box || l.box) &&
      (!f.imei || l.imeiOnFile) &&
      (!f.checked || l.checked) &&
      (!f.days || now.getTime() - new Date(l.publishedAt).getTime() <= f.days * 86400000) &&
      (f.sort !== "deals" || (l.ptaStatus !== "cpid_patched" && l.ptaStatus !== "unknown")),
  );
  return result.sort((a, b) =>
    f.sort === "low"
      ? a.pricePkr - b.pricePkr
      : f.sort === "high"
        ? b.pricePkr - a.pricePkr
        : f.sort === "deals"
          ? ["great", "fair", "high", "unknown"].indexOf(a.daamBand) -
            ["great", "fair", "high", "unknown"].indexOf(b.daamBand)
          : f.sort === "relevant" && query
            ? Number(matches.includes(b.model)) - Number(matches.includes(a.model)) ||
              b.publishedAt.localeCompare(a.publishedAt)
            : b.publishedAt.localeCompare(a.publishedAt),
  );
}
