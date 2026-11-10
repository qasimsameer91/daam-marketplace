# daam

**Sahi phone. Sahi daam.** A marketplace in Pakistan for used, refurbished and new phones.

- Product spec: [`docs/DAAM_MASTER_PLAN.md`](docs/DAAM_MASTER_PLAN.md)
- Build phases: [`docs/PHASE_PROMPTS.md`](docs/PHASE_PROMPTS.md)
- Coding rules: [`CLAUDE.md`](CLAUDE.md)

## Getting started

Requires Node 24+, pnpm 12+ and Docker (for local Supabase).

```bash
pnpm install
cp .env.example .env.local   # fill in values
pnpm dev                     # http://localhost:3000 → /en, /ur (RTL)
```

## Scripts

| Command                        | What it does                              |
| ------------------------------ | ----------------------------------------- |
| `pnpm dev`                     | Dev server (Turbopack)                    |
| `pnpm build` / `pnpm start`    | Production build / serve                  |
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript                       |
| `pnpm format`                  | Prettier (with Tailwind class sorting)    |
| `pnpm test`                    | Vitest unit tests                         |
| `pnpm test:e2e`                | Playwright (mobile + desktop)             |
| `pnpm db:start`                | Start local Supabase                      |
| `pnpm db:reset`                | Rebuild DB from migrations + seed         |
| `pnpm db:types`                | Generate `lib/supabase/database.types.ts` |

A pre-commit hook runs lint-staged and the typecheck.
