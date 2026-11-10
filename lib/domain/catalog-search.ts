/**
 * Model search with Pakistani shorthand (plan §5, §9): "13 pm" → iPhone 13 Pro Max,
 * "s23u" → Galaxy S23 Ultra. Pure; Phase 7 moves the same idea into a Postgres RPC.
 */

export interface SearchableModel {
  slug: string;
  brandSlug: string;
  name: string;
  aliases: string[];
  popularity: number;
}

/** Lowercase and drop everything but letters/digits, so "13 Pro-Max" ≈ "13promax". */
export function normalizeQuery(s: string): string {
  return s
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]/g, "");
}

/** 3 = exact name/alias, 2 = starts with, 1 = contains, 0 = no match. */
function score(model: SearchableModel, q: string): number {
  let best = 0;
  for (const term of [model.name, ...model.aliases]) {
    const t = normalizeQuery(term);
    if (t === q) return 3;
    if (t.startsWith(q)) best = Math.max(best, 2);
    else if (t.includes(q)) best = Math.max(best, 1);
  }
  return best;
}

/**
 * Best matches first (match quality, then popularity). With an empty query, returns the most
 * popular models. Optionally limited to one brand (Redmi/Poco count as Xiaomi children only if
 * you pass them explicitly).
 */
export function searchModels<T extends SearchableModel>(
  models: T[],
  query: string,
  { brandSlug, limit = 8 }: { brandSlug?: string; limit?: number } = {},
): T[] {
  const pool = brandSlug ? models.filter((m) => m.brandSlug === brandSlug) : models;
  const q = normalizeQuery(query);
  if (!q) return [...pool].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
  return pool
    .map((m) => ({ m, s: score(m, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.m.popularity - a.m.popularity)
    .slice(0, limit)
    .map((x) => x.m);
}
