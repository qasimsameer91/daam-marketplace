import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseCsv, type CsvRow } from "@/lib/csv";

/**
 * TEMPORARY: the sell wizard's catalog, read from the seed CSVs until Phase 4 serves brands,
 * models, variants, colours, aliases, cities and areas from Supabase. Compact by design: this
 * is serialized to the client for the model picker.
 */
export interface CatalogModel {
  slug: string;
  brandSlug: string;
  name: string;
  popularity: number;
  supportsBatteryHealth: boolean;
  aliases: string[];
  variants: { ramGb: number | null; storageGb: number }[];
  /** Colour names + swatch hex from catalog data (UI swatch only). */
  colors: { name: string; hex: string }[];
}

export interface SellCatalog {
  brands: { slug: string; name: string }[];
  models: CatalogModel[];
  cities: { slug: string; nameEn: string; nameUr: string }[];
  areas: { citySlug: string; slug: string; nameEn: string; nameUr: string }[];
}

async function csv(file: string): Promise<CsvRow[]> {
  const text = await readFile(join(process.cwd(), "supabase", "seed", file), "utf8");
  return parseCsv(text, file);
}

function groupBy<T>(rows: T[], key: (row: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const k = key(row);
    map.set(k, [...(map.get(k) ?? []), row]);
  }
  return map;
}

export async function getSellCatalog(): Promise<SellCatalog> {
  "use cache";
  const [brands, models, variants, colors, aliases, cities, areas] = await Promise.all([
    csv("brands.csv"),
    csv("models.csv"),
    csv("variants.csv"),
    csv("colors.csv"),
    csv("aliases.csv"),
    csv("cities.csv"),
    csv("areas.csv"),
  ]);
  const variantsBy = groupBy(variants, (r) => r.model_slug ?? "");
  const colorsBy = groupBy(colors, (r) => r.model_slug ?? "");
  const aliasesBy = groupBy(aliases, (r) => r.model_slug ?? "");

  return {
    brands: [...brands]
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
      .map((b) => ({ slug: b.slug ?? "", name: b.name ?? "" })),
    models: models.map((m) => {
      const slug = m.slug ?? "";
      return {
        slug,
        brandSlug: m.brand_slug ?? "",
        name: m.name ?? "",
        popularity: Number(m.popularity ?? 0),
        supportsBatteryHealth: m.supports_battery_health === "true",
        aliases: (aliasesBy.get(slug) ?? []).map((a) => a.alias ?? ""),
        variants: (variantsBy.get(slug) ?? [])
          .map((v) => ({
            ramGb: v.ram_gb ? Number(v.ram_gb) : null,
            storageGb: Number(v.storage_gb),
          }))
          .sort((a, b) => a.storageGb - b.storageGb || (a.ramGb ?? 0) - (b.ramGb ?? 0)),
        colors: (colorsBy.get(slug) ?? []).map((c) => ({ name: c.name ?? "", hex: c.hex ?? "" })),
      };
    }),
    cities: cities.map((c) => ({
      slug: c.slug ?? "",
      nameEn: c.name_en ?? "",
      nameUr: c.name_ur ?? "",
    })),
    areas: areas.map((a) => ({
      citySlug: a.city_slug ?? "",
      slug: a.slug ?? "",
      nameEn: a.name_en ?? "",
      nameUr: a.name_ur ?? "",
    })),
  };
}
