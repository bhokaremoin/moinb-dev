# Project context

**moinb.dev**: Moin's personal portfolio, project case studies and blog, built to help Moin get
hired and later build a personal brand. Public repo: https://github.com/bhokaremoin/moinb-dev.
Hosting: Vercel (setup steps in `README.md`). Design reference: the approved static demo at
https://claude.ai/artifact/Lx4txZYZjSSnisU2EE9Fez. Spec and plan: `docs/superpowers/`.

## Architecture

- One app, three hosts: `moinb.dev` (home, /now, /uses), `projects.moinb.dev`, `blogs.moinb.dev`.
  `src/proxy.ts` → `resolveRoute` (`src/routing/`) rewrites section hosts onto internal routes
  `/projects/*` and `/blog/*`, redirects those paths on the root host to the subdomain, and 404s
  unknown slugs.
- Build every URL with `sectionUrl` / `sectionPath` / `sectionHref` from `src/routing/site-urls.ts`;
  never hand-write a host. `NEXT_PUBLIC_ROOT_DOMAIN` unset = path mode (Vercel previews).
- Content: MDX in `content/`, compiled by Velite (`velite.config.ts`) into `.velite/`, imported as
  `#site/content`. Profile data in `content/site.ts` (`@content/site`).
- Theme: `theme` cookie on the root domain, applied by an inline `<head>` script before paint.
- Code is organised by feature: `src/home`, `src/projects`, `src/blog`, `src/command-palette`,
  `src/theme`, `src/site-shell`, `src/seo`, shared bits in `src/ui`.

## Stack

- Next.js 16 (App Router, `src/` dir, Turbopack, `cacheComponents` enabled), React 19, TypeScript (strict)
- Velite + MDX, rehype-pretty-code + Shiki (github-light-default / github-dark-default; the github-light and github-dark-dimmed comment greys fail AA contrast), cmdk, next/og
- Vercel Analytics (`src/analytics/SiteAnalytics.tsx` is the only place to swap it), optional Giscus
- Tailwind CSS v4 (configured in CSS via `@theme` in `src/app/globals.css`; no `tailwind.config` file)
- Vitest + React Testing Library + jsdom for unit/component tests; Playwright (Chromium) for e2e
- ESLint (`eslint-config-next`) + Prettier (with `prettier-plugin-tailwindcss` for class sorting)
- Node 24 (`.nvmrc`), npm

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://moinb.localhost:3000 (+ `projects.` / `blogs.` subdomains) |
| `npm run check` | **Full test command**: format check, lint, typecheck, tests. Must pass before done. |
| `npm run e2e` | Playwright against a production build on `*.moinb.localhost:3200` |
| `npm run content` | Velite build (strict); `typecheck` and `test` run it first |
| `npm run build` | Production build (CI also runs this) |
| `npm test` / `npm run test:watch` | Vitest once / in watch mode |
| `npm run format` | Prettier write |

CI (`.github/workflows/ci.yml`) runs `npm run check` + `npm run build`, and `npm run e2e` in a
second job, on every PR and push to `main`.

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
- Local dev uses the root `moinb.localhost`, not bare `localhost`: browsers never send a
  `Domain=localhost` cookie to subdomains, so the theme wouldn't carry across hosts.
- Velite drops a file that fails schema validation and still exits 0 unless run with `--strict`;
  `content` and `next build` are strict, the dev watcher is not.
- Unknown slugs on `[slug]` pages would stream a 200 before `notFound()` (PPR fallback shell), so
  the proxy 404s them using `.velite/published-slugs.json`. On a section host, every single-segment
  path must be a published slug, a section file (`SECTION_FILES`) or a shared file
  (`SHARED_PATHS`) in `src/routing/resolve-route.ts`. **A new file in `public/` or a new section
  route handler must be added there**, or subdomains will 404 it.
- `[slug]` pages export `instant = false`: every real slug is prerendered; dev validation would
  otherwise flag awaiting `params`.
- OG images are route handlers at `/<slug>/og.png`, not `opengraph-image` files: the file
  convention emits internal `/projects/...` URLs. Fonts for them live in `src/seo/fonts/`.
- Compiled MDX is called as a plain function in `MdxContent` (React Compiler lint forbids creating
  components during render; compiled MDX has no hooks).
- Vitest runs with `NEXT_PUBLIC_ROOT_DOMAIN=moinb.dev` on a jsdom URL of `https://moinb.dev/`, so
  component tests assert production URLs and cookies.
