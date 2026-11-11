import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cacheLife } from "next/cache";
import { z } from "zod";
import type { Database } from "@/lib/supabase/database.types";

export type CatalogBrand = { slug: string; name: string };
export type CatalogModel = { slug: string; brand: string; name: string; aliases: string[] };
export type CatalogCity = { slug: string; nameEn: string; nameUr: string };
export type CatalogArea = CatalogCity & { citySlug: string };
export type Catalog = {
  brands: CatalogBrand[];
  models: CatalogModel[];
  cities: CatalogCity[];
  areas: CatalogArea[];
};

const brandRows = z.array(z.object({ id: z.number(), slug: z.string(), name: z.string() }));
const modelRows = z.array(
  z.object({ id: z.number(), brand_id: z.number(), slug: z.string(), name: z.string() }),
);
const aliasRows = z.array(z.object({ model_id: z.number(), alias: z.string() }));
const cityRows = z.array(
  z.object({ id: z.number(), slug: z.string(), name_en: z.string(), name_ur: z.string() }),
);
const areaRows = z.array(
  z.object({
    city_id: z.number(),
    slug: z.string(),
    name_en: z.string(),
    name_ur: z.string().nullable(),
  }),
);

/** null means no local configuration; configured failures surface as errors, never fake data. */
export async function getCatalog(): Promise<Catalog | null> {
  "use cache";
  cacheLife({ revalidate: 300 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url && !key) return null;
  if (!url || !key) throw new Error("Supabase catalog configuration is incomplete");
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [brandResponse, modelResponse, cityResponse, areaResponse] = await Promise.all([
    client
      .from("brands")
      .select("id, slug, name")
      .eq("is_active", true)
      .order("sort_order")
      .order("id"),
    client.from("models").select("id, brand_id, slug, name").eq("is_active", true).order("id"),
    client.from("cities").select("id, slug, name_en, name_ur").order("sort_order").order("id"),
    client.from("areas").select("city_id, slug, name_en, name_ur").order("id"),
  ]);
  if (brandResponse.error || modelResponse.error || cityResponse.error || areaResponse.error)
    throw new Error("Catalog could not be loaded");
  const brands = brandRows.parse(brandResponse.data);
  const models = modelRows.parse(modelResponse.data);
  const cities = cityRows.parse(cityResponse.data);
  const areas = areaRows.parse(areaResponse.data);
  const aliases: z.infer<typeof aliasRows> = [];
  // The API defaults to a 1,000-row cap; include all alias pages.
  for (let start = 0; ; start += 1000) {
    const response = await client
      .from("model_aliases")
      .select("model_id, alias")
      .order("id")
      .range(start, start + 999);
    if (response.error) throw new Error("Catalog aliases could not be loaded");
    const page = aliasRows.parse(response.data);
    aliases.push(...page);
    if (page.length < 1000) break;
  }
  const brandById = new Map(brands.map((brand) => [brand.id, brand.slug]));
  const cityById = new Map(cities.map((city) => [city.id, city.slug]));
  const aliasesByModel = new Map<number, string[]>();
  for (const alias of aliases) {
    const list = aliasesByModel.get(alias.model_id) ?? [];
    list.push(alias.alias);
    aliasesByModel.set(alias.model_id, list);
  }
  return {
    brands: brands.map(({ slug, name }) => ({ slug, name })),
    cities: cities.map(({ slug, name_en, name_ur }) => ({
      slug,
      nameEn: name_en,
      nameUr: name_ur,
    })),
    areas: areas.flatMap(({ slug, city_id, name_en, name_ur }) => {
      const citySlug = cityById.get(city_id);
      return citySlug ? [{ slug, citySlug, nameEn: name_en, nameUr: name_ur ?? name_en }] : [];
    }),
    models: models.flatMap((model) => {
      const brand = brandById.get(model.brand_id);
      return brand
        ? [
            {
              slug: model.slug,
              brand,
              name: model.name,
              aliases: aliasesByModel.get(model.id) ?? [],
            },
          ]
        : [];
    }),
  };
}
