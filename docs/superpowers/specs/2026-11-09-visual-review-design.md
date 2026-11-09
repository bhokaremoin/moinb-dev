# Visual review setup: design

Date: 2026-11-09. Status: approved in chat, awaiting written-spec review.

## Why

The site is live, but nothing checks how it _looks_. The current tests prove that routing, links,
SEO and the theme work, and that a phone screen has no sideways scroll. None of them would notice
that on a laptop every page is a 680px column with more than half the screen empty, which is the
problem Moin noticed by eye.

Goal: before a PR with a UI change is opened, Claude screenshots the major pages at several screen
sizes, reviews every image against a written definition of "correct", fixes what is wrong and
re-checks. The objective parts of that definition also run as cheap automated tests in CI.

This is piece 1 of 2. Piece 2, the wider laptop layout, is the first change to go through this
setup and gets its own spec. Piece 1 changes no page's appearance.

## What Moin said vs. what is assumed

- Said: screenshots of the major pages and sections; Claude checks the images for colour, alignment
  and how the portfolio should look; it self-evaluates and fixes; this happens before raising a PR.
  The laptop problem is "too narrow / wasted space". Chosen approach: Claude review plus
  automated layout checks.
- Assumed: screenshots are not committed and are not compared pixel-by-pixel against saved
  baselines (see "Not included"); the review runs locally, not in CI.

## Success criteria

1. `npm run visual` produces a full set of screenshots of the local production build in one command.
2. A checklist in the repo states what correct looks like, specifically enough that two reviews of
   the same image reach the same verdict.
3. A project skill makes Claude capture, review every image against the checklist, write a report,
   fix and repeat, and `CLAUDE.project.md` makes it a required step before any PR that changes UI.
4. `npm run e2e` (and so CI) checks layout rules at four screen sizes and passes on today's site.

## 1. Screenshot capture: `npm run visual`

- **Config:** `playwright.visual.config.ts`, separate from `playwright.config.ts` so `npm run e2e`
  and CI never run it. It shares the e2e web server (production build on `*.moinb.localhost:3200`,
  `reuseExistingServer` locally). To avoid duplicating that block, the server settings move into a
  small shared module both configs import.
- **Code:** `visual/capture.visual.ts`, outside `e2e/` so the e2e config can't pick it up. The page
  and size lists live in `visual/targets.ts`.
- **Pages (9):**

  | Name              | URL                                                             |
  | ----------------- | --------------------------------------------------------------- |
  | `home`            | `ROOT_URL/`                                                     |
  | `now`             | `ROOT_URL/now`                                                  |
  | `uses`            | `ROOT_URL/uses`                                                 |
  | `projects`        | `PROJECTS_URL/`                                                 |
  | `case-study`      | `PROJECTS_URL/ledgerly`                                         |
  | `blog`            | `BLOG_URL/`                                                     |
  | `post`            | `BLOG_URL/rest-to-trpc`                                         |
  | `not-found`       | `BLOG_URL/missing-visual-review`                                |
  | `command-palette` | `ROOT_URL/`, palette opened with the "Open command menu" button |

- **Sizes:** phone 390×844, tablet 768×1024, laptop 1280×800, wide 1440×900.
- **Themes:** light at all four sizes; dark at phone and laptop. Dark covers the same layouts as
  light, so two sizes are enough to catch colour problems. Total: 9 pages × 6 = 54 images.
- **Theme selection:** set the `theme` cookie on the root domain before loading, the same way a
  returning visitor arrives, so the inline head script applies it before paint.
- **Stable images:** full-page screenshots, Playwright's `animations: "disabled"`, wait for
  `document.fonts.ready`. The command palette is captured at viewport size, since it is an overlay.
- **Output:** `visual-output/<page>/<size>-<theme>.png`, for example
  `visual-output/home/laptop-dark.png`. The folder is wiped at the start of a full run and is
  gitignored (`/visual-output/` added to `.gitignore`).
- **One page at a time:** `npm run visual -- --grep home` uses Playwright's own test filter; each
  page × size × theme is one test named `<page> <size> <theme>`.

## 2. Design checklist: `docs/design/visual-checklist.md`

The written definition of "correct" that every review is judged against, together with the
approved demo (https://claude.ai/artifact/Lx4txZYZjSSnisU2EE9Fez). Sections:

- **Colour:** only the tokens in `src/app/globals.css` (listed with their light and dark values);
  accent used for links, focus and active nav only; no raw greys or pure black/white; text meets
  WCAG AA contrast.
- **Dark mode:** no light patches (code blocks, cards, palette, form controls), no images or icons
  that disappear against `--bg`.
- **Alignment:** nav, main content and footer share one left edge at every size; headings, body
  text and cards line up on it; nothing is off by a few pixels.
- **Spacing:** a consistent vertical rhythm between sections; equal gaps between items in a list or
  grid; no cramped or doubled gaps.
- **Typography:** body text lines of roughly 45–80 characters; a clear heading hierarchy; no orphaned
  single words in headings where avoidable.
- **Per size:** phone has no sideways scroll and tap targets of at least 44px; tablet and up use the
  extra width rather than stretching or leaving it empty. The exact laptop width rule is set by
  piece 2 and added here then.
- **Each page's purpose:** one line per page on what a visitor must see first (for example: home
  shows name, role and the call to action without scrolling on a laptop).

Each item is phrased as a yes/no question so a review can answer it per image.

## 3. Review step: project skill `visual-review`

`.claude/skills/visual-review/SKILL.md`. Project skills sit next to the harness's `h-*` skills; the
harness manifest lists only its own files, so a sync leaves this one alone.

Steps:

1. **Capture.** All pages if shared layout or styles changed (`src/app/globals.css`,
   `src/site-shell/`, `src/ui/`, the root layout); otherwise only the pages the change touches,
   via `--grep`.
2. **Review.** Open every image in scope and answer the checklist for it. "Clean" may only be
   reported after every image in scope has been opened; the report lists each one.
3. **Report.** Write `visual-output/report.md`: per image, a verdict (pass / issues) and each issue
   with the checklist item it breaks and where on the page it is.
4. **Fix and repeat.** Fix each issue. If the rule behind it is objective (a measurable size,
   overlap or alignment), add a failing layout test first (section 4). Re-capture the affected
   pages and review again. Stop after 3 rounds and list what remains for Moin instead of looping.
5. **Hand-off.** The PR description gets a "Visual review" line: rounds run, images reviewed,
   issues fixed, anything left open.

Wiring:

- `CLAUDE.project.md` gains the `npm run visual` command and the rule "UI changes: run the
  `visual-review` skill before opening a PR".
- Later, if it proves useful, suggest promoting the skill to the harness with `h-harness-improve`.
  Not part of this work.

## 4. Automated layout checks in CI: `e2e/layout.spec.ts`

Replaces `e2e/mobile.spec.ts`; its no-sideways-scroll check carries over and widens to every size.
Runs the 8 page targets (light theme; the command palette is an overlay on `home`, so it is skipped)
at all four sizes, reusing `visual/targets.ts`, with three rules each:

1. **No sideways scroll:** `scrollWidth` is not greater than the viewport width.
2. **Shared left edge:** the nav's content and `main`'s content start at the same x position
   (within 1px).
3. **No overlap in the header:** the bounding boxes of the nav's links and buttons don't intersect.

All three pass on today's site. The rule "content uses enough of a laptop screen" would fail today,
so it is written in piece 2 as that change's failing test, together with the fix.

Each new rule is proven able to fail by breaking the layout it guards (for example a temporary
fixed-width element, or a nudged nav margin) and confirming the test goes red.

## Error handling

- The capture run fails loudly, naming the page, if a page doesn't return 200 (404 for
  `not-found`), so a review never runs on an error page by mistake.
- If the build or server fails, Playwright's web server error is the output; nothing is captured.
- The skill reports a capture failure to Moin instead of reviewing a partial set.

## Testing

- `npm run check` stays green (format, lint, typecheck, unit tests).
- `npm run e2e` runs the new layout spec; each rule is shown failing once on a deliberately broken
  layout before the PR.
- `npm run visual` is run once end to end and its 54 images reviewed as the first real use of the
  skill; that report goes in the PR description.

## Not included

- **Pixel-baseline diffs** (Playwright `toHaveScreenshot`): every intended visual change would mean
  regenerating and committing dozens of images, and font rendering differs between macOS and the CI
  runner, causing false failures. The checklist review plus layout tests cover the same risk with
  less upkeep.
- **Capturing or reviewing screenshots in CI:** the review needs Claude, which runs locally before
  the PR.
- **The laptop layout fix itself:** piece 2.
