import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseCsv } from "@/lib/csv";
import type { AppLocale } from "@/lib/i18n/routing";

/**
 * TEMPORARY: reads PTA/safety copy from the seed CSV until Phase 4 serves `content_blocks`
 * from Supabase. Callers should treat this as the content_blocks table.
 */
export async function getSeedContentBlocks(locale: AppLocale): Promise<Map<string, string>> {
  "use cache";
  const text = await readFile(
    join(process.cwd(), "supabase", "seed", "content_blocks.csv"),
    "utf8",
  );
  const rows = parseCsv(text, "content_blocks.csv");
  return new Map(
    rows.map((r) => [r.key ?? "", (locale === "ur" && r.body_ur ? r.body_ur : r.body_en) ?? ""]),
  );
}
