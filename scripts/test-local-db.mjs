import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const container = process.env.DAAM_DB_CONTAINER || "supabase_db_daam";
for (const name of ["phase4_read_security.sql", "phase4_write_security.sql"]) {
  process.stdout.write(`Running ${name} against ${container} (fixtures roll back)\n`);
  const result = spawnSync(
    "docker",
    [
      "exec",
      "-i",
      container,
      "psql",
      "-U",
      "postgres",
      "-d",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-q",
    ],
    {
      input: readFileSync(join(root, "supabase", "tests", name)),
      stdio: ["pipe", "inherit", "inherit"],
    },
  );
  if (result.error || result.status !== 0) {
    if (result.error) process.stderr.write(`${result.error.message}\n`);
    process.exit(result.status || 1);
  }
}
