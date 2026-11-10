import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Inline only this tracked public asset; no user content enters executable script markup. */
export async function getThemeScript(): Promise<string> {
  "use cache";
  return readFile(join(process.cwd(), "public", "theme-init.js"), "utf8");
}
