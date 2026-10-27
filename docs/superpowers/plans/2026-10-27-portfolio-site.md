# moinb.dev portfolio site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the portfolio (`moinb.dev`), projects (`projects.moinb.dev`) and blog
(`blogs.moinb.dev`) as one Next.js app that matches the approved demo.

**Architecture:** One Next 16 app with internal routes `/`, `/now`, `/uses`, `/projects/*`,
`/blog/*`. `src/proxy.ts` maps hostnames onto those routes using a pure `resolveRoute`. All URLs
are built by `src/routing/site-urls.ts` from `NEXT_PUBLIC_ROOT_DOMAIN` (unset = path mode for
Vercel previews). Content is MDX compiled by Velite into typed data; pages are statically
prerendered; the theme is applied by an inline cookie-reading script.

**Tech Stack:** Next 16.4 (Cache Components, Turbopack), React 19.3, TypeScript, Tailwind v4,
Velite 0.4, rehype-pretty-code 0.14 + Shiki 4, cmdk 1.1, @vercel/analytics 2, @giscus/react 3,
Vitest 5 + RTL, Playwright 1.64.

**Spec:** `docs/superpowers/specs/2026-10-27-portfolio-site-design.md`

## Global Constraints

- One column `max-width: 680px`, 16px side gutter, sticky slim nav, one accent colour.
- Tokens verbatim from the demo: light `--bg #f7f8fa --surface #ffffff --fg #14161c --muted #5d6472
  --line #e3e6ec --accent #2b47c9 --accent-soft #e8ecfb --code-bg #f0f2f6`; dark `--bg #0f1115
  --surface #161920 --fg #e8eaf0 --muted #949bab --line #262a33 --accent #8fa3ff
  --accent-soft #1c2340 --code-bg #1a1d25`.
- Fonts via `next/font/google`: Bricolage Grotesque (headings), IBM Plex Sans (body), JetBrains Mono
  (dates, tags, code only).
- No skill bars, no "coming soon" pages, no link that 404s.
- Every cross-section link is built with `sectionUrl`/`sectionHref`; never hand-write a host.
- Under `cacheComponents`, no `new Date()`/`Date.now()` outside `"use cache"` and no
  request-time APIs in layouts.
- Respect `prefers-reduced-motion`; visible `:focus-visible` outline in accent.
- Placeholder content is marked `PLACEHOLDER` in `content/site.ts` and in every seed MDX file.
- `npm run check` and `npm run build` pass after every task; one commit per task (Conventional
  Commits, with the session attribution trailer).

## Review Focus

1. Shared root files requested on a subdomain (`projects.moinb.dev/favicon.ico`, `/_next/...`,
   `/resume.pdf`) must not be rewritten into the section → `resolveRoute` passes them through
   (Task 1 test).
2. Host header with port or uppercase (`Projects.localhost:3000`) or an unknown subdomain
   (`www.moinb.dev`) → section hosts match case-insensitively; unknown hosts are served as root
   (Task 1 test).
3. Theme cookie with a garbage value (`theme=purple`) → ignored, system preference wins
   (Task 2 test).
4. Clipboard API missing or rejecting (insecure context, denied permission) → copy buttons still
   show feedback and never throw (Task 4 test).
5. A project with `caseStudy: false` or missing `liveUrl`/`repoUrl` → no dead buttons, archive
   links to whichever URL exists (Task 5 test).

---

### Task 1: Site URL helpers (routing core)

**Files:**
- Create: `src/routing/site-urls.ts`, `src/routing/resolve-route.ts`
- Test: `src/routing/site-urls.test.ts`, `src/routing/resolve-route.test.ts`
- Create: `.env.development` (`NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000`), `.env.example`
- Modify: `.gitignore` (add `!.env.development`)

**Interfaces (Produces):**
```ts
export type Section = "home" | "projects" | "blog";
export type RoutingConfig =
  | { mode: "host"; rootDomain: string; protocol: "http" | "https" }
  | { mode: "path"; origin: string };
export function createRoutingConfig(env: { rootDomain?: string; vercelUrl?: string }): RoutingConfig;
export const routingConfig: RoutingConfig; // from process.env.NEXT_PUBLIC_ROOT_DOMAIN / NEXT_PUBLIC_VERCEL_URL
export function sectionUrl(section: Section, path?: string, config?: RoutingConfig): string; // always absolute
export function sectionPath(section: Section, path?: string, config?: RoutingConfig): string; // same-host path
export function sectionHref(target: Section, current: Section, path?: string, config?: RoutingConfig): string;
export function cookieDomain(config?: RoutingConfig): string | undefined;

export type RouteDecision =
  | { action: "next" }
  | { action: "rewrite"; pathname: string }
  | { action: "redirect"; url: string };
export function resolveRoute(input: { host: string; pathname: string }, config?: RoutingConfig): RouteDecision;
```

Rules: subdomain per section is `projects.` and `blogs.`; internal prefixes are `/projects` and
`/blog`. `protocol` is `http` when the root domain starts with `localhost`, else `https`.
Path-mode origin is `https://${vercelUrl}` or `http://localhost:3000`. `cookieDomain` returns
`.moinb.dev` in host mode for real domains, `undefined` for localhost and path mode (verified in
Task 7 e2e whether Chromium shares host-only `localhost` cookies across `*.localhost`; if not,
switch to `localhost`). Pass-through paths: `/_next/*`, `/static/*`, `/favicon.ico`,
`/resume.pdf`, `/__nextjs*`.

- [ ] **Step 1: Write failing tests** covering:
  - host mode: `sectionUrl("projects","/ledgerly")` → `https://projects.moinb.dev/ledgerly`;
    `sectionUrl("home")` → `https://moinb.dev/`; localhost → `http://blogs.localhost:3000/x`.
  - path mode: `sectionUrl("blog","/x")` → `https://preview.vercel.app/blog/x`;
    `sectionPath("projects","/")` → `/projects`; `sectionPath("home","/now")` → `/now`.
  - `sectionHref` returns a path when target === current, absolute URL otherwise.
  - `resolveRoute`: `projects.moinb.dev /ledgerly` → rewrite `/projects/ledgerly`;
    `projects.moinb.dev /` → rewrite `/projects`; `blogs.moinb.dev /rss.xml` → rewrite
    `/blog/rss.xml`; `moinb.dev /projects/ledgerly` → redirect `https://projects.moinb.dev/ledgerly`;
    `moinb.dev /blog` → redirect `https://blogs.moinb.dev/`; `moinb.dev /now` → next;
    `Projects.LOCALHOST:3000 /x` → rewrite `/projects/x`; `www.moinb.dev /` → next;
    `projects.moinb.dev /favicon.ico` and `/_next/static/a.js` → next; path mode anything → next;
    `projects.moinb.dev /projects/x` → rewrite `/projects/projects/x` (404, no duplicate URL).
- [ ] **Step 2:** `npx vitest run src/routing` → FAIL (modules missing).
- [ ] **Step 3:** Implement both modules (pure functions, `URL`-free string building, early returns).
- [ ] **Step 4:** `npx vitest run src/routing` → PASS.
- [ ] **Step 5:** Commit `feat(routing): add section url helpers and host route resolver`.

### Task 2: Design tokens, fonts, theme and site shell

**Files:**
- Modify: `src/app/globals.css` (tokens, base styles, `.prose`, focus, reduced motion),
  `src/app/layout.tsx` (fonts, inline theme script, skip link), `src/app/layout.test.ts`
- Create: `content/site.ts`, `src/theme/theme-cookie.ts` (+test), `src/theme/theme-script.ts`
  (+test), `src/theme/ThemeToggle.tsx` (+test), `src/site-shell/SiteNav.tsx` (+test),
  `src/site-shell/SiteFooter.tsx` (+test), `src/site-shell/SiteShell.tsx`,
  `src/app/(home)/layout.tsx` (move `page.tsx` + test into `(home)`)

**Interfaces (Produces):**
```ts
// src/theme/theme-cookie.ts
export type Theme = "light" | "dark";
export const THEME_COOKIE = "theme";
export function parseTheme(value: string | undefined): Theme | undefined;
export function readThemeCookie(cookieHeader: string): Theme | undefined;
export function serializeThemeCookie(theme: Theme, domain: string | undefined): string; // 1-year, path=/, SameSite=Lax
// src/theme/theme-script.ts
export function buildThemeScript(): string; // IIFE reading document.cookie, sets data-theme if valid
// src/site-shell/SiteShell.tsx
export function SiteShell(props: { section: Section; children: React.ReactNode }): JSX.Element;
// content/site.ts
export const site: SiteProfile; // name, shortName, status, location, headline {before, emphasis, after},
// intro, email, resumePath, socials {github, linkedin}, experience[{period, role, company, impact, tags}],
// contact {heading, body}, builtWith, copyrightYear
```

- Theme CSS: tokens on `:root`; dark under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and `:root[data-theme="dark"]`, exactly like the demo. Tailwind `@theme inline` maps `--color-bg`, `--color-surface`, `--color-fg`, `--color-muted`, `--color-line`, `--color-accent`, `--color-accent-soft`, `--color-code-bg`, `--font-display`, `--font-body`, `--font-mono`.
- `ThemeToggle` (client): current = `data-theme` or `matchMedia` result; on click sets the other theme on `<html>` and writes the cookie with `cookieDomain()`.
- `SiteNav` (server): logo `moin<span>b</span>.dev` → home; About → `sectionHref("home", current, "/#about")`; Projects / Blog with `aria-current="page"` when section matches; ⌘K button (wired in Task 9, rendered here as `CommandMenuButton` placeholder-free: it dispatches a `open-command-menu` window event) and `ThemeToggle`.
- `SiteFooter`: `© {copyrightYear} {name} · {builtWith}` and links /now, /uses, RSS (`sectionUrl("blog","/rss.xml")`), GitHub.

- [ ] **Step 1:** Failing tests: `parseTheme("dark")`→dark, `("purple")`→undefined, `(undefined)`→undefined; `readThemeCookie("a=1; theme=light")`→light; `serializeThemeCookie("dark",".moinb.dev")` contains `Domain=.moinb.dev`, `Max-Age=31536000`, `Path=/`, `SameSite=Lax`; omitted domain has no `Domain=`; theme script executed against a fake `document` sets `data-theme` only for valid values; ThemeToggle flips light→dark and writes cookie; SiteNav marks Projects `aria-current="page"` when section is projects and links home logo to an absolute URL from a projects page; footer RSS link points to blog host.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** `npm run check` → PASS.
- [ ] **Step 5:** Commit `feat(theme): add design tokens, fonts, theme cookie and site shell`.

### Task 3: Content pipeline (Velite + MDX)

**Files:**
- Create: `velite.config.ts`, `content/projects/{ledgerly,shipnote,queueless,dotfiles}.mdx`,
  `content/posts/{rest-to-trpc,debugging-ttfb,postgres-partial-indexes,three-years-full-stack,structured-clone}.mdx`,
  `content/pages/{now,uses}.mdx`, `src/content/MdxContent.tsx`, `src/content/mdx-components.tsx`,
  `src/content/format-date.ts` (+test)
- Create: `src/projects/project-queries.ts` (+test), `src/blog/post-queries.ts` (+test)
- Modify: `next.config.ts` (await Velite build in dev/build), `tsconfig.json` (`#site/content` → `./.velite`),
  `.gitignore` (`.velite`), `eslint.config.mjs` (ignore `.velite/**`), `package.json`
  (`content` script = `velite build`; `typecheck` and `test` run it first)

**Interfaces (Produces):**
```ts
// Velite types from "#site/content": Project, Post, Page
// project-queries.ts
export function sortProjectsByDate(projects: Project[]): Project[]; // newest first
export function featuredProjects(projects: Project[], limit?: number): Project[];
export function projectTypes(projects: Project[]): string[]; // unique, in first-seen order
export function caseStudies(projects: Project[]): Project[];
export function adjacentItems<T extends { slug: string }>(items: T[], slug: string): { previous?: T; next?: T };
export function projectLink(project: Project): string | undefined; // case study path, else liveUrl, else repoUrl
// post-queries.ts
export function sortPostsByDate(posts: Post[]): Post[];
export function groupPostsByYear(posts: Post[]): { year: number; posts: Post[] }[]; // years desc
export function postTags(posts: Post[]): string[];
export function latestPosts(posts: Post[], limit?: number): Post[];
// format-date.ts
export function formatShortDate(iso: string): string; // "Oct 12" (UTC)
export function formatLongDate(iso: string): string; // "Oct 12, 2026" (UTC)
// MdxContent.tsx
export function MdxContent(props: { code: string }): JSX.Element;
```

Velite schemas: projects `title, tagline?, summary, date (isodate), type, stack[], role, timeline,
users, liveUrl? (url), repoUrl? (url), featured (bool, default false), caseStudy (default true),
metrics[{value,label}] (default []), architecture[] (default [])`, plus `slug: s.path()`
(stripped of `projects/`) and `content: s.mdx()`. Posts `title, date, tags[], til (default false),
summary, slug, toc: s.toc(), metadata: s.metadata(), content: s.mdx()`. MDX uses `rehype-slug` and
`rehype-pretty-code` (`theme: { light: "github-light", dark: "github-dark-dimmed" }`,
`keepBackground: false`). Dates are formatted in UTC so server and client agree.

- [ ] **Step 1:** Failing tests for the query and date functions with small fixture arrays (sort order, year grouping desc, unique tags/types, featured limit 3, adjacent at start/middle/end, `projectLink` precedence incl. `caseStudy:false` with only `repoUrl`, and with neither URL → undefined).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Install `velite rehype-pretty-code shiki rehype-slug`, write config and seed content (demo text, `PLACEHOLDER` comment in each file), implement modules. **Step 4:** `npm run check && npm run build` → PASS.
- [ ] **Step 5:** Commit `feat(content): add velite mdx pipeline, seed content and queries`.

### Task 4: Home page

**Files:**
- Modify: `src/app/(home)/page.tsx`, `src/app/(home)/page.test.tsx`
- Create: `src/home/{StatusLine,Hero,ExperienceList,FeaturedProjects,LatestPosts,ContactBox}.tsx`,
  `src/ui/{ButtonLink,TagList,CopyButton,SectionHeading}.tsx`, `src/ui/copy-to-clipboard.ts` (+test),
  `src/projects/ProjectCard.tsx`, `src/blog/PostList.tsx`, `public/resume.pdf` (placeholder),
  tests beside each component with behaviour.

**Interfaces (Produces):** `ProjectCard({ project, href })`, `PostList({ posts, current: Section, dateFormat: "short" })`,
`CopyButton({ text, label, copiedLabel? })`, `copyToClipboard(text): Promise<boolean>` (false when
the API is missing or rejects; never throws), `TagList({ tags })`, `ButtonLink({ href, variant })`.

- [ ] **Step 1:** Failing tests: home renders sections in order (status, h1, three CTAs with résumé `href="/resume.pdf"`, Experience, 3 featured cards, 3 posts, contact, all-project/all-post links pointing at the right hosts); `copyToClipboard` resolves false when `navigator.clipboard` is undefined and when `writeText` rejects; CopyButton shows "Copied" then reverts.
- [ ] **Steps 2-4:** FAIL → implement → `npm run check` PASS.
- [ ] **Step 5:** Commit `feat(home): build portfolio home page`.

### Task 5: Projects index and case study

**Files:**
- Create: `src/app/projects/{layout,page}.tsx`, `src/app/projects/[slug]/page.tsx`,
  `src/projects/{ProjectFilters,ProjectArchive,FactsGrid,ArchitectureDiagram,MetricCards,ScreenshotFrame}.tsx`,
  `src/ui/PrevNextLinks.tsx`, tests for filters, archive and page module.

- Index: eyebrow, h1 "Things I've built", intro, client `ProjectFilters` (chips "All" + types, `aria-pressed`, filters featured cards), archive table (year / project / built with / link via `projectLink`).
- Case study: back link, `title: tagline`, summary, Live/Source buttons only when URLs exist, facts grid, screenshot frame, MDX body (Problem, Constraints, Architecture diagram via `<ArchitectureDiagram>` slot after the Architecture heading, Key decisions, Results metric cards, What I'd do differently), prev/next. `generateStaticParams` from case studies; `notFound()` for unknown slugs.
- [ ] Tests: chips filter cards and set `aria-pressed`; archive renders a row per project with link fallbacks; prev/next omit missing sides.
- [ ] Commit `feat(projects): add projects index and case study pages`.

### Task 6: Blog index, post page, /now and /uses

**Files:**
- Create: `src/app/blog/{layout,page}.tsx`, `src/app/blog/[slug]/page.tsx`,
  `src/app/(home)/now/page.tsx`, `src/app/(home)/uses/page.tsx`,
  `src/blog/{PostFilters,TableOfContents,CodeBlock,Callout,GiscusComments}.tsx`, tests.

- Index: posts grouped by year, chips All / Posts / TIL / each tag, `TIL` chip on TIL posts.
- Post: back link, title, long date, reading time, `#tags`, TOC from `toc`, MDX with `figure[data-rehype-pretty-code-figure]` wrapped by `CodeBlock` (filename from `title` meta, copy button), `Callout`, prev ("Older") / next ("Newer"), Giscus when all env vars are set.
- [ ] Tests: filter chips (TIL shows only TIL posts; tag filter), TOC renders nested links, CodeBlock copies the code text, Giscus renders nothing without env.
- [ ] Commit `feat(blog): add blog index, post page and now/uses pages`.

### Task 7: Subdomain proxy + Playwright

**Files:**
- Create: `src/proxy.ts`, `playwright.config.ts`, `e2e/routing.spec.ts`, `e2e/theme.spec.ts`
- Modify: `package.json` (`e2e` script), `.gitignore` (playwright output), `vitest.config.mts` (exclude `e2e/`)

- `proxy.ts` calls `resolveRoute` and returns `NextResponse.rewrite/redirect/next`; matcher excludes `_next/static`, `_next/image`.
- Playwright `webServer`: `npm run build && npm run start` with `NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000`; base URL `http://localhost:3000`.
- [ ] e2e: `projects.localhost:3000/` shows "Things I've built"; `/ledgerly` shows the case study; `blogs.localhost:3000/rest-to-trpc` shows the post; `localhost:3000/projects/ledgerly` redirects to the subdomain; toggling dark on the home host then visiting the blog host renders dark with `data-theme="dark"` present before hydration (checked via `page.route` HTML + attribute on first `domcontentloaded`).
- [ ] Commit `feat(routing): route subdomains through proxy` and `test(e2e): add playwright routing and theme tests`.

### Task 8: SEO (metadata, sitemaps, robots, RSS, OG images)

**Files:**
- Create: `src/seo/{page-metadata,sitemap-entries,robots-text,rss-feed}.ts` (+tests),
  `src/app/sitemap.ts`, `src/app/projects/sitemap.ts`, `src/app/blog/sitemap.ts`,
  `src/app/robots.txt/route.ts`, `src/app/projects/robots.txt/route.ts`, `src/app/blog/robots.txt/route.ts`,
  `src/app/blog/rss.xml/route.ts`, `src/app/projects/[slug]/og.png/route.tsx`, `src/app/blog/[slug]/og.png/route.tsx`,
  `src/seo/og-card.tsx`, `src/seo/fonts/*.ttf`
- Modify: every page's `metadata`/`generateMetadata` to use `pageMetadata({ section, path, title, description, ogImage? })`.

- OG images are route handlers (not the `opengraph-image` file convention) because the convention emits internal `/projects/...` URLs that are wrong once the subdomain rewrite applies; `pageMetadata` points `openGraph.images` at `sectionUrl(section, "/<slug>/og.png")`.
- RSS 2.0 with `<atom:link rel="self">`, items sorted newest first, all text XML-escaped.
- [ ] Tests: `pageMetadata` canonical is absolute on the right host; sitemap entries per section; robots text lists the host's sitemap; RSS escapes `&<>"'` and includes every post; e2e asserts each host's `sitemap.xml`, `robots.txt`, `rss.xml`, and an `og.png` return 200 with the right content type.
- [ ] Commit `feat(seo): add canonical metadata, sitemaps, robots, rss and og images`.

### Task 9: Polish (command palette, transitions, analytics, CI, docs)

**Files:**
- Create: `src/command-palette/{CommandPalette,command-items}.tsx` (+tests), `src/analytics/SiteAnalytics.tsx`,
  `e2e/links.spec.ts`
- Modify: root layout (palette + analytics + `<ViewTransition>` around section content), CSS
  (view transition fade, reduced motion), `.github/workflows/ci.yml` (Playwright job),
  `README.md` (Vercel + DNS steps, env vars), `CLAUDE.project.md` (new commands, gotchas)

- Palette items: Home, Projects, Blog, /now, /uses, each project case study, each post, Toggle theme, Copy email. Cmd/Ctrl+K toggles; Escape closes; same-section items use `router.push`, others `window.location.assign`.
- e2e link checker: crawl every page on all three hosts, request every internal link, expect 2xx/3xx→2xx.
- Lighthouse on a production build for home, a case study and a post; record scores in the PR.
- [ ] Commit `feat(ui): add command palette, view transitions and analytics`, `ci: run playwright e2e tests`, `docs: document hosting, env vars and content editing`.
