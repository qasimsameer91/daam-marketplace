import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
// The local CLI emits types on stdout. Save only after a successful run so a
// transient connection failure never overwrites previously generated types.
const executable = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = spawnSync(
  executable,
  ["exec", "supabase", "gen", "types", "typescript", "--schema", "public"],
  {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
    maxBuffer: 10 * 1024 * 1024,
  },
);
if (result.error || result.status !== 0 || !result.stdout.includes("export type Database")) {
  process.stderr.write(
    result.error?.message || result.stderr || "Type generation returned invalid output\n",
  );
  process.exit(result.status || 1);
}
writeFileSync(join(root, "lib", "supabase", "database.types.ts"), result.stdout, "utf8");
process.stdout.write("Generated lib/supabase/database.types.ts from the local database.\n");
