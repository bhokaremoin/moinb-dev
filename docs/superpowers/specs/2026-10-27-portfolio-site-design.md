# moinb.dev portfolio, projects and blog: design

Date: 2026-10-27 · Status: approved (user delegated remaining decisions)

## Goal

A personal site whose main job is to get Moin hired as a full-stack developer, and longer term to
build a personal brand for corporate or freelance work. It must match the approved static demo
(`https://claude.ai/artifact/Lx4txZYZjSSnisU2EE9Fez`) closely, be fast (Lighthouse 90+),
accessible, mobile-friendly, and have no broken links or "coming soon" pages.

## Hosts and routing

| Public URL                                | Internal route                           |
| ----------------------------------------- | ---------------------------------------- |
| `moinb.dev/`, `/now`, `/uses`             | `/`, `/now`, `/uses`                     |
| `projects.moinb.dev/`, `/[slug]`          | `/projects`, `/projects/[slug]`          |
| `blogs.moinb.dev/`, `/[slug]`, `/rss.xml` | `/blog`, `/blog/[slug]`, `/blog/rss.xml` |

- One Next.js app. `src/proxy.ts` calls a pure function `resolveRoute({ host, pathname })` from
  `src/routing/` that returns `rewrite`, `redirect` or `next`.
- On a section host, `/x` rewrites to `/<section>/x`. Each host also serves its own
  `sitemap.xml` and `robots.txt` (rewritten to per-section route handlers).
- On the root host, `/projects/...` and `/blog/...` 308-redirect to the matching subdomain so
  every page has exactly one public URL.
- `NEXT_PUBLIC_ROOT_DOMAIN` drives everything: `moinb.dev` in production, `localhost:3000`
  locally (Chrome and Firefox resolve `*.localhost` without `/etc/hosts`).
- **Path mode**: when `NEXT_PUBLIC_ROOT_DOMAIN` is unset (Vercel preview deployments only have
  one `*.vercel.app` host), the proxy does nothing and `siteUrl()` returns plain paths such as
  `/projects/ledgerly`. The site stays fully navigable on previews.
- `siteUrl(section, path)` in `src/routing/` builds every cross-section link. Same-section links
  may be relative; cross-section links are absolute in host mode.

## Theme

- Tokens are copied from the demo's `:root` block (light + dark, three font variables) into
  `src/app/globals.css` and exposed to Tailwind through `@theme inline`.
- A `theme` cookie (`light` | `dark`, absent = follow system) is written with
  `Domain=.<root domain>` so it carries across subdomains. On `localhost` the cookie is set
  without a domain if browsers reject `Domain=localhost` (verified during implementation).
- A small inline script in `<head>` reads the cookie and sets `data-theme` on `<html>` before
  first paint. The cookie is deliberately not read on the server: that would make every page
  dynamic and lose static rendering.
- The toggle in the nav flips between light and dark relative to the currently shown theme.

## Content

- Velite (`velite.config.ts`) compiles MDX in `content/` into typed data in `.velite/`
  (git-ignored). It is started from `next.config.ts` so `dev`/`build` stay single commands.
- `projects`: `title, summary, date, type, stack[], role, timeline, users, liveUrl?, repoUrl?,
featured, metrics[{ value, label }]` plus three additions: `tagline?` (case-study heading reads
  "title: tagline"), `architecture[]` (ordered node labels for the simple diagram) and
  `caseStudy` (default true). `summary` is the one-line outcome on cards and the case-study
  subtitle. The MDX body holds problem, constraints, decisions and what I'd do differently.
  Projects with `caseStudy: false` appear only in the archive and link to `repoUrl`/`liveUrl`.
- `posts`: `title, date, tags[], til, summary` plus body; Velite derives `slug`, `toc` and
  `metadata.readingTime`.
- `pages`: `now.mdx` and `uses.mdx`, with an `updated` date.
- `content/site.ts`: name, status line, location, headline, intro, email, résumé path, socials,
  experience entries. All seeded content is the demo's sample content, marked `PLACEHOLDER`.
- `public/resume.pdf`: a placeholder PDF so the Résumé button works.
- Code highlighting: `rehype-pretty-code` + Shiki with `github-light` / `github-dark-dimmed`,
  switched by `data-theme`. A `CodeBlock` component adds the filename header and copy button.
  MDX components: `Callout`, code block wrapper, headings with anchors.

## Pages

Home, projects index, case study, blog index and post follow the section lists in the brief and
the demo markup. Filter chips (project type, post tag / TIL) are client components that filter a
server-rendered list; the initial render shows everything so the page works without JS.
Prev/next links on case studies and posts are computed from date order.

## Global UI

- Sticky slim nav (logo, About, Projects, Blog, ⌘K button, theme toggle) and footer
  ("Built with" note, /now, /uses, RSS, GitHub).
- Command palette (`cmdk`): Cmd/Ctrl+K or the nav button. Items: pages, every project, every
  post, toggle theme, copy email. Navigation uses `router.push` within a section and
  `window.location` across sections.
- View Transitions via React's `<ViewTransition>` for in-section navigation (cross-subdomain
  navigation is a cross-origin full load, which browsers do not animate). Disabled under
  `prefers-reduced-motion`.
- Visible focus rings, AA contrast from the demo tokens, a skip link.

## SEO and integrations

- Per-page metadata with absolute canonical URLs from `siteUrl()`.
- Per-host `sitemap.xml` and `robots.txt`; `blogs.<root>/rss.xml` (RSS 2.0, hand-written XML
  with escaping; no dependency needed).
- `opengraph-image.tsx` for each project and post using `next/og`, with the site fonts.
- Analytics: Vercel Analytics, wrapped in one `SiteAnalytics` component so switching to Umami
  touches one file.
- Giscus comments on posts, rendered only when `NEXT_PUBLIC_GISCUS_REPO`, `_REPO_ID`,
  `_CATEGORY` and `_CATEGORY_ID` are all set.

## Testing

- Vitest: `resolveRoute`, `siteUrl`, theme cookie/script logic, content queries (sorting, year
  grouping, prev/next, filtering), RSS XML, and client components (copy button, filter chips,
  theme toggle, command palette, code block).
- Playwright (Chromium, run in CI against `next build && next start`): host rewrites and
  redirects, theme persists across subdomains without a flash, every internal link on every
  page resolves (no 404s), sitemaps/robots/RSS/OG images respond.
- Lighthouse run manually against a production build; scores reported in the PR.

## Out of scope

Vercel project and DNS setup (documented in `README.md`: add the three domains in Vercel so it
issues certificates, then point DNS; `.dev` is HSTS-preloaded, so certificates must exist first).
Real personal content (Moin replaces the placeholders).
