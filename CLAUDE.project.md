# Project context

**moinb.dev**: Moin's personal portfolio and a showcase of the applications Moin builds. Public repo:
https://github.com/bhokaremoin/moinb-dev. Domain `moinb.dev` is owned; hosting not yet chosen.

## Stack

- Next.js 16 (App Router, `src/` dir, Turbopack, `cacheComponents` enabled), React 19, TypeScript (strict)
- Tailwind CSS v4 (configured in CSS via `@theme` in `src/app/globals.css`; no `tailwind.config` file)
- Vitest + React Testing Library + jsdom for unit/component tests
- ESLint (`eslint-config-next`) + Prettier (with `prettier-plugin-tailwindcss` for class sorting)
- Node 24 (`.nvmrc`), npm

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run check` | **Full test command**: format check, lint, typecheck, tests. Must pass before done. |
| `npm run build` | Production build (CI also runs this) |
| `npm test` / `npm run test:watch` | Vitest once / in watch mode |
| `npm run format` | Prettier write |

CI (`.github/workflows/ci.yml`) runs `npm run check` and `npm run build` on every PR and push to `main`.

## Gotchas

- **Read `AGENTS.md`**: Next 16 differs from older versions; the authoritative docs are in
  `node_modules/next/dist/docs/`. `next dev` regenerates `AGENTS.md`, so keep it committed.
- `typecheck` runs `next typegen` first: global route types like `LayoutProps`/`PageProps` are
  generated, so plain `tsc` fails on a fresh checkout.
- Vitest can't render `async` Server Components; test those with E2E tests instead.
- Tests are colocated next to the code (`page.test.tsx` beside `page.tsx`).
- `CLAUDE.md` and `.claude/harness/` are managed by the harness and excluded from Prettier;
  don't edit them here.
- `npm audit` reports high-severity issues in `braces` via `eslint-config-next`. Dev-only lint
  tooling, not shipped; the suggested `--force` fix downgrades to Next 14's config, so ignore it
  until upstream updates.
