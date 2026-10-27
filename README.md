# moinb.dev

Source for [moinb.dev](https://moinb.dev): my personal portfolio, project case studies and blog.

| URL                  | What                            |
| -------------------- | ------------------------------- |
| `moinb.dev`          | Portfolio home, `/now`, `/uses` |
| `projects.moinb.dev` | Projects index and case studies |
| `blogs.moinb.dev`    | Blog, RSS feed at `/rss.xml`    |

It is one Next.js app. `src/proxy.ts` maps each hostname onto internal routes (`/projects/*`,
`/blog/*`), and every URL is built by `src/routing/site-urls.ts` from `NEXT_PUBLIC_ROOT_DOMAIN`.

Built with [Claude Code](https://claude.com/claude-code). Project-specific context lives in
`CLAUDE.project.md`.

## Development

Requires Node 24 (see `.nvmrc`).

```bash
npm install
npm run dev     # http://moinb.localhost:3000, http://projects.moinb.localhost:3000, http://blogs.moinb.localhost:3000
npm run check   # format check, lint, typecheck, unit tests
npm run e2e     # Playwright tests against a production build
npm run build   # production build
```

Browsers resolve `*.localhost` to your machine, so no `/etc/hosts` changes are needed.

## Editing content

- **Profile** (name, intro, experience, email, socials): `content/site.ts`
- **Projects**: `content/projects/*.mdx`. Frontmatter is validated at build time; see
  `velite.config.ts` for every field. Use `<ArchitectureDiagram />` and `<MetricCards />` in the
  body to place the diagram and results; set `caseStudy: false` for archive-only entries.
- **Posts**: `content/posts/*.mdx` with `title, date, tags, til, summary`. Code blocks take a
  filename with ` ```ts title="file.ts" `; use `<Callout>` for asides.
- **/now and /uses**: `content/pages/*.mdx`
- **Résumé**: replace `public/resume.pdf`

Everything seeded from the design demo is marked `PLACEHOLDER`.

## Environment variables

| Variable                                                           | Where                                    | Purpose                                                                                                                                   |
| ------------------------------------------------------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_ROOT_DOMAIN`                                          | Vercel **Production** only (`moinb.dev`) | Serves each section on its subdomain. Leave unset on Preview: the site then uses plain paths (`/projects/...`) on the single preview URL. |
| `NEXT_PUBLIC_GISCUS_REPO`, `_REPO_ID`, `_CATEGORY`, `_CATEGORY_ID` | optional                                 | Turns on Giscus comments on posts (all four required). Values come from [giscus.app](https://giscus.app).                                 |

## Deploying to Vercel

`.dev` is on the HSTS preload list, so browsers only ever use HTTPS: a host without a valid
certificate is unreachable, with no "continue anyway" option. Vercel issues each certificate a few
minutes after DNS points at it. Nothing is served on these domains yet, so that gap is harmless;
just don't share the links until all three certificates are valid.

1. Import the repo into Vercel (framework: Next.js) and set `NEXT_PUBLIC_ROOT_DOMAIN=moinb.dev`
   for the Production environment only.
2. In **Settings → Domains**, add `moinb.dev`, `projects.moinb.dev` and `blogs.moinb.dev` to the
   project.
3. At your DNS provider, point the apex at Vercel (`A 76.76.21.21`, or the value Vercel shows) and
   add `CNAME projects` and `CNAME blogs` to `cname.vercel-dns.com`.
4. Wait until Vercel shows a valid certificate for all three domains, then open each over HTTPS.
   Turn on Web Analytics in the Vercel dashboard.
