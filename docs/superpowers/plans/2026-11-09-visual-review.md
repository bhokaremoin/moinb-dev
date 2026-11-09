# Visual Review Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the repo a one-command screenshot run of the major pages, a written visual checklist, a `visual-review` skill that makes Claude review and fix before a UI PR, and CI layout tests at four screen sizes.

**Architecture:** A second Playwright config (`playwright.visual.config.ts`) reuses the e2e production server through a shared module and writes PNGs to a gitignored `visual-output/`. Page and screen-size lists live in `visual/targets.ts`, shared by the capture run and a new `e2e/layout.spec.ts` that replaces `e2e/mobile.spec.ts`. The review itself is a project skill plus a checklist document.

**Tech Stack:** Playwright (Chromium), Next.js 16 production build, TypeScript, Markdown.

**Spec:** `docs/superpowers/specs/2026-11-09-visual-review-design.md`

## Global Constraints

- Sizes: phone 390×844, tablet 768×1024, laptop 1280×800, wide 1440×900.
- Themes: light at all four sizes; dark at phone and laptop. 9 pages × 6 = 54 images.
- Output path: `visual-output/<page>/<size>-<theme>.png`, gitignored.
- `npm run e2e` and CI must not run the capture.
- Layout tests must pass on today's site; no "uses enough width" rule (that is piece 2).
- Piece 1 changes no page's appearance: no edits under `src/` in this plan.
- Every new layout rule is shown failing once against a deliberately broken layout, then reverted.
- `npm run check` and `npm run e2e` pass at the end of every task. Conventional Commits with the session trailer.

## Review Focus

1. **Theme cookie not reaching subdomains in capture**: a dark screenshot of `projects.`/`blogs.` must actually be dark. Task 2 checks `data-theme` before shooting.
2. **Capturing an error page by mistake**: a broken route must fail the run, not produce a screenshot. Task 2 asserts the response status per page.
3. **Hidden nav items counted as overlapping**: "About" is `display:none` on phone; zero-size boxes must be ignored, not compared. Task 3's overlap rule filters them.
4. **Layout tests passing for the wrong reason**: e.g. the left-edge test finding no `h1` and comparing `undefined`. Task 3 asserts the boxes exist and proves each rule red.
5. **`--grep` partial runs leaving stale images**: the skill tells Claude to clear `visual-output/` before a full run (Task 5).

---

### Task 1: Share the production server between Playwright configs

**Files:**

- Create: `playwright.server.ts`
- Modify: `playwright.config.ts`, `e2e/hosts.ts`, `.gitignore`, `.prettierignore`

**Interfaces:**

- Produces: `playwright.server.ts` exports `E2E_ROOT_DOMAIN: string` and `productionServer` (a Playwright `webServer` config object).

This is a refactor; the existing e2e suite is its test.

- [ ] **Step 1: Create `playwright.server.ts`**

```ts
import type { PlaywrightTestConfig } from "@playwright/test";

const PORT = 3200;
export const E2E_ROOT_DOMAIN = `moinb.localhost:${PORT}`;

// Tests run against a production build so they see real prerendering and the proxy.
export const productionServer: PlaywrightTestConfig["webServer"] = {
  command: `npm run build && npx next start -p ${PORT}`,
  url: `http://${E2E_ROOT_DOMAIN}`,
  env: { NEXT_PUBLIC_ROOT_DOMAIN: E2E_ROOT_DOMAIN },
  reuseExistingServer: !process.env.CI,
  timeout: 240_000,
};
```

- [ ] **Step 2: Use it in `playwright.config.ts`**

Replace the `PORT`/`E2E_ROOT_DOMAIN` constants and the `webServer` block:

```ts
import { defineConfig, devices } from "@playwright/test";

import { E2E_ROOT_DOMAIN, productionServer } from "./playwright.server";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://${E2E_ROOT_DOMAIN}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: productionServer,
});
```

- [ ] **Step 3: Point `e2e/hosts.ts` at the shared module**

```ts
import { E2E_ROOT_DOMAIN } from "../playwright.server";
```

- [ ] **Step 4: Ignore the screenshot folder**

Append to `.gitignore` under `# playwright`: `/visual-output/`. Append to `.prettierignore`: `visual-output/`.

- [ ] **Step 5: Verify**

Run: `npm run check && npm run e2e`
Expected: both pass; e2e reports the same 33 tests as before.

- [ ] **Step 6: Commit**

```bash
git add playwright.server.ts playwright.config.ts e2e/hosts.ts .gitignore .prettierignore
git commit -m "test(e2e): share the production server config between playwright runs"
```

---

### Task 2: Screenshot capture (`npm run visual`)

**Files:**

- Create: `visual/targets.ts`, `visual/capture.visual.ts`, `playwright.visual.config.ts`
- Modify: `package.json` (script `visual`)

**Interfaces:**

- Consumes: `E2E_ROOT_DOMAIN`, `productionServer` (Task 1); `ROOT_URL`, `PROJECTS_URL`, `BLOG_URL` from `e2e/hosts.ts`.
- Produces (`visual/targets.ts`):
  - `type Theme = "light" | "dark"`
  - `type ScreenSize = { name: "phone" | "tablet" | "laptop" | "wide"; width: number; height: number; themes: readonly Theme[] }`
  - `type PageTarget = { name: string; url: string; expectedStatus: 200 | 404 }`
  - `SCREEN_SIZES: readonly ScreenSize[]`, `PAGES: readonly PageTarget[]` (8 pages, no palette)

- [ ] **Step 1: Write the targets**

`visual/targets.ts`:

```ts
import { BLOG_URL, PROJECTS_URL, ROOT_URL } from "../e2e/hosts";

export type Theme = "light" | "dark";

export type ScreenSize = {
  name: "phone" | "tablet" | "laptop" | "wide";
  width: number;
  height: number;
  /** Dark mode shares the light layouts, so two sizes are enough to catch colour problems. */
  themes: readonly Theme[];
};

export type PageTarget = {
  name: string;
  url: string;
  expectedStatus: 200 | 404;
};

export const SCREEN_SIZES: readonly ScreenSize[] = [
  { name: "phone", width: 390, height: 844, themes: ["light", "dark"] },
  { name: "tablet", width: 768, height: 1024, themes: ["light"] },
  { name: "laptop", width: 1280, height: 800, themes: ["light", "dark"] },
  { name: "wide", width: 1440, height: 900, themes: ["light"] },
];

export const PAGES: readonly PageTarget[] = [
  { name: "home", url: `${ROOT_URL}/`, expectedStatus: 200 },
  { name: "now", url: `${ROOT_URL}/now`, expectedStatus: 200 },
  { name: "uses", url: `${ROOT_URL}/uses`, expectedStatus: 200 },
  { name: "projects", url: `${PROJECTS_URL}/`, expectedStatus: 200 },
  { name: "case-study", url: `${PROJECTS_URL}/ledgerly`, expectedStatus: 200 },
  { name: "blog", url: `${BLOG_URL}/`, expectedStatus: 200 },
  { name: "post", url: `${BLOG_URL}/rest-to-trpc`, expectedStatus: 200 },
  {
    name: "not-found",
    url: `${BLOG_URL}/missing-visual-review`,
    expectedStatus: 404,
  },
];
```

- [ ] **Step 2: Write the capture run**

`visual/capture.visual.ts`:

```ts
import { expect, type Page, test } from "@playwright/test";

import { ROOT_URL } from "../e2e/hosts";
import { PAGES, type PageTarget, SCREEN_SIZES, type Theme } from "./targets";

const OUTPUT_DIR = "visual-output";

async function openWithTheme(page: Page, target: PageTarget, theme: Theme) {
  // The cookie is how a returning visitor's choice arrives; the head script applies it before paint.
  await page
    .context()
    .addCookies([{ name: "theme", value: theme, url: target.url }]);
  const response = await page.goto(target.url);
  expect(response?.status(), `${target.url} returned the wrong status`).toBe(
    target.expectedStatus,
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await page.evaluate(() => document.fonts.ready);
}

for (const size of SCREEN_SIZES) {
  test.describe(size.name, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    for (const theme of size.themes) {
      for (const target of PAGES) {
        test(`${target.name} ${theme}`, async ({ page }) => {
          await openWithTheme(page, target, theme);
          await page.screenshot({
            path: `${OUTPUT_DIR}/${target.name}/${size.name}-${theme}.png`,
            fullPage: true,
            animations: "disabled",
          });
        });
      }

      test(`command-palette ${theme}`, async ({ page }) => {
        await openWithTheme(
          page,
          { name: "home", url: `${ROOT_URL}/`, expectedStatus: 200 },
          theme,
        );
        // The button only works once React has hydrated.
        await page.waitForLoadState("networkidle");
        await page.getByRole("button", { name: "Open command menu" }).click();
        await expect(page.getByRole("dialog")).toBeVisible();
        // An overlay: the viewport is what a visitor sees, not the full page behind it.
        await page.screenshot({
          path: `${OUTPUT_DIR}/command-palette/${size.name}-${theme}.png`,
          animations: "disabled",
        });
      });
    }
  });
}
```

Each test's full title is `<size> <page> <theme>` (for example `laptop home dark`), so
`--grep home` or `--grep "laptop home"` picks out a subset.

- [ ] **Step 3: Run it before the config exists to see it fail**

Run: `npx playwright test -c playwright.visual.config.ts`
Expected: FAIL, "playwright.visual.config.ts" not found.

- [ ] **Step 4: Write the config and script**

`playwright.visual.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

import { E2E_ROOT_DOMAIN, productionServer } from "./playwright.server";

// Screenshots for the visual-review skill. Kept out of playwright.config.ts so e2e and CI never run it.
export default defineConfig({
  testDir: "./visual",
  testMatch: "**/*.visual.ts",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: `http://${E2E_ROOT_DOMAIN}` },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: productionServer,
});
```

`package.json` scripts: add `"visual": "playwright test -c playwright.visual.config.ts"` after `"e2e"`.

- [ ] **Step 5: Run the full capture**

Run: `rm -rf visual-output && npm run visual && find visual-output -name '*.png' | wc -l`
Expected: 54 passed; `54`.

- [ ] **Step 6: Prove the status guard fails**

Temporarily change the `post` target's URL to `${BLOG_URL}/no-such-post`, run `npm run visual -- --grep "laptop post light"`.
Expected: FAIL with "returned the wrong status", expected 200, received 404. Revert.

- [ ] **Step 7: Prove the theme guard fails**

Temporarily change the cookie value to `"light"` in `openWithTheme`, run `npm run visual -- --grep "laptop projects dark"`.
Expected: FAIL on `data-theme` (expected "dark", received "light"). Revert.

- [ ] **Step 8: Open two images to sanity-check**

Read `visual-output/projects/laptop-dark.png` and `visual-output/command-palette/phone-light.png`.
Expected: the first is dark; the second shows the open palette.

- [ ] **Step 9: Verify and commit**

Run: `npm run check && npm run e2e`
Expected: both pass; e2e still 33 tests (capture not included).

```bash
git add visual playwright.visual.config.ts package.json
git commit -m "test(visual): capture screenshots of the major pages at four sizes"
```

---

### Task 3: Layout checks in CI (`e2e/layout.spec.ts`)

**Files:**

- Create: `e2e/layout.spec.ts`
- Delete: `e2e/mobile.spec.ts` (its check moves into the new spec at every size)

**Interfaces:**

- Consumes: `PAGES`, `SCREEN_SIZES` from `visual/targets.ts`.

- [ ] **Step 1: Write the spec**

```ts
import { expect, type Locator, type Page, test } from "@playwright/test";

import { PAGES, SCREEN_SIZES } from "../visual/targets";

type Box = { x: number; y: number; width: number; height: number };

async function boxOf(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  expect(box, "element should be on the page").not.toBeNull();
  return box as Box;
}

function overlaps(a: Box, b: Box) {
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  );
}

async function visibleNavItemBoxes(page: Page) {
  const items = page
    .getByRole("navigation", { name: "Main" })
    .locator("a, button");
  const boxes: Box[] = [];
  for (const item of await items.all()) {
    const box = await item.boundingBox();
    // Items hidden at this size (e.g. "About" on a phone) have no box.
    if (box && box.width > 0) boxes.push(box);
  }
  return boxes;
}

for (const size of SCREEN_SIZES) {
  test.describe(`${size.name} (${size.width}px)`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    for (const target of PAGES) {
      test(`${target.name} has no sideways scroll`, async ({ page }) => {
        await page.goto(target.url);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });

      test(`${target.name} starts its heading on the nav's left edge`, async ({
        page,
      }) => {
        await page.goto(target.url);

        const brand = await boxOf(
          page.getByRole("link", { name: "moinb.dev home" }),
        );
        const heading = await boxOf(page.locator("main h1").first());
        expect(Math.abs(heading.x - brand.x)).toBeLessThanOrEqual(1);
      });

      test(`${target.name} has no overlapping nav items`, async ({ page }) => {
        await page.goto(target.url);

        const boxes = await visibleNavItemBoxes(page);
        expect(boxes.length).toBeGreaterThanOrEqual(4);
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            expect(
              overlaps(boxes[i], boxes[j]),
              `nav items ${i} and ${j}`,
            ).toBe(false);
          }
        }
      });
    }
  });
}
```

- [ ] **Step 2: Delete `e2e/mobile.spec.ts` and format**

Run: `git rm e2e/mobile.spec.ts && npm run format`

- [ ] **Step 3: Run it on today's site**

Run: `npx playwright test e2e/layout.spec.ts`
Expected: 96 passed (8 pages × 4 sizes × 3 rules). If any fails, stop and use systematic-debugging: the spec says these pass today, so a failure is a real finding to report, not something to loosen.

- [ ] **Step 4: Prove "no sideways scroll" can fail**

Temporarily add `<div style={{ width: 2000 }} />` as the first child of `<main>` in `src/site-shell/SiteShell.tsx`. Run `npx playwright test e2e/layout.spec.ts --grep "sideways"`.
Expected: FAIL at every size. Revert with `git checkout src/site-shell/SiteShell.tsx`.

- [ ] **Step 5: Prove "left edge" can fail**

Temporarily add `ml-2` to the brand link's className in `src/site-shell/SiteNav.tsx`. Run `npx playwright test e2e/layout.spec.ts --grep "left edge"`.
Expected: FAIL (difference 8px). Revert with `git checkout src/site-shell/SiteNav.tsx`.

- [ ] **Step 6: Prove "no overlap" can fail**

Temporarily add `-ml-6` to `NAV_LINK_CLASS` in `src/site-shell/SiteNav.tsx`. Run `npx playwright test e2e/layout.spec.ts --grep "overlapping"`.
Expected: FAIL. Revert with `git checkout src/site-shell/SiteNav.tsx`.

- [ ] **Step 7: Verify and commit**

Run: `git status --short src` (Expected: empty) then `npm run check && npm run e2e`.
Expected: all pass; e2e count is 33 − 5 + 96 = 124.

```bash
git add e2e/layout.spec.ts e2e/mobile.spec.ts
git commit -m "test(e2e): check layout rules at phone, tablet, laptop and wide sizes"
```

---

### Task 4: Design checklist

**Files:**

- Create: `docs/design/visual-checklist.md`

- [ ] **Step 1: Write the checklist**

Every item is a yes/no question. Content:

```markdown
# Visual checklist

What "looks correct" means for moinb.dev. The `visual-review` skill answers every question below
for every screenshot. The reference for the intended look is the approved demo:
https://claude.ai/artifact/Lx4txZYZjSSnisU2EE9Fez. Colour values come from `src/app/globals.css`;
if they change there, change them here.

## Colour

| Token           | Light     | Dark      | Used for                       |
| --------------- | --------- | --------- | ------------------------------ |
| `--bg`          | `#f7f8fa` | `#0f1115` | page background                |
| `--surface`     | `#ffffff` | `#161920` | cards, palette, raised areas   |
| `--fg`          | `#14161c` | `#e8eaf0` | body text, headings            |
| `--muted`       | `#5d6472` | `#949bab` | secondary text, nav links      |
| `--line`        | `#e3e6ec` | `#262a33` | borders, dividers              |
| `--accent`      | `#2b47c9` | `#8fa3ff` | links, focus rings, active nav |
| `--accent-soft` | `#e8ecfb` | `#1c2340` | tag and highlight backgrounds  |
| `--code-bg`     | `#f0f2f6` | `#1a1d25` | code blocks                    |

- Does every colour on the page come from this table (no stray greys, pure black or pure white)?
- Is the accent used only for links, focus rings, the active nav item and small highlights?
- Is all text clearly readable against its background (WCAG AA: 4.5:1 body, 3:1 large text)?

## Dark mode

- Is there no light patch anywhere (code blocks, cards, inputs, the palette, embedded images)?
- Are icons and borders still visible against the dark background?

## Alignment

- Do the nav, the page heading, the body content and the footer start on the same left edge?
- Do cards, list items and images in one column line up on both edges?
- Is anything visibly off by a few pixels from its neighbours?

## Spacing

- Is the vertical gap between sections consistent down the page?
- Are gaps between items in a list or grid equal?
- Is anything cramped against an edge or another element, or separated by an odd double gap?

## Typography

- Are body text lines roughly 45–80 characters long?
- Is the heading hierarchy clear (page title > section heading > item title > body)?
- Do headings avoid a single orphaned word on their last line where a small change would fix it?

## Per screen size

- **Phone (390px):** no sideways scroll; tap targets at least 44px; nothing cut off.
- **Tablet (768px):** the layout uses the extra width instead of looking like a stretched phone.
- **Laptop (1280px) and wide (1440px):** the page uses the screen instead of leaving most of it
  empty. (A measured width rule is added with the laptop layout change.)

## Each page's purpose

- **home:** name, role and the call to action are visible without scrolling on a laptop.
- **now / uses:** easy to scan; the page heading says what the page is.
- **projects:** each project's name, one-line summary and stack are scannable side by side.
- **case-study:** the title, summary and key facts come before the long text.
- **blog:** post titles and dates are scannable; the newest is first.
- **post:** comfortable reading width; code blocks are readable and don't overflow.
- **not-found:** says the page is missing and offers clear ways back.
- **command-palette:** clearly sits above the page; the input and results are readable.
```

- [ ] **Step 2: Format, verify, commit**

Run: `npm run format && npm run check`
Expected: pass.

```bash
git add docs/design/visual-checklist.md
git commit -m "docs(design): add the visual checklist screenshots are reviewed against"
```

---

### Task 5: `visual-review` skill and project wiring

**Files:**

- Create: `.claude/skills/visual-review/SKILL.md`
- Modify: `CLAUDE.project.md` (Commands table, a "Before a PR" rule)

- [ ] **Step 1: Write the skill**

```markdown
---
name: visual-review
description: Use before opening a PR that changes anything visible on the site (pages, components, styles, content layout). Screenshots the major pages, reviews every image against the visual checklist, fixes issues and re-checks.
---

# Visual review

Screenshots come from `npm run visual` (production build, `*.moinb.localhost:3200`) and land in
`visual-output/<page>/<size>-<theme>.png`. The definition of correct is
`docs/design/visual-checklist.md`; read it fully before reviewing.

## 1. Capture

- Shared layout or styles changed (`src/app/globals.css`, `src/app/layout.tsx`, `src/site-shell/`,
  `src/ui/`): full run. `rm -rf visual-output && npm run visual`.
- Otherwise capture only the affected pages: `npm run visual -- --grep "<page>"` (page names are in
  `visual/targets.ts`).
- If the run fails, stop and report the failure. Never review a partial set.

## 2. Review

Open every image in scope with the Read tool. For each, answer every checklist question that
applies. Compare against the approved demo when judging the intended look. You may report "clean"
only after opening every image in scope.

## 3. Report

Write `visual-output/report.md`:

    # Visual review, round <n>
    | Image | Verdict | Issues |
    |---|---|---|
    | home/laptop-light.png | pass | |
    | projects/wide-light.png | issues | Alignment: cards start 24px right of the heading |

Each issue names the checklist item it breaks and where on the page it is.

## 4. Fix and repeat

- Fix each issue. If the rule behind it is measurable (a size, an overlap, an alignment), first add
  a failing test to `e2e/layout.spec.ts`, then fix (superpowers:test-driven-development).
- Re-capture the affected pages and review again as a new round.
- Stop after 3 rounds. List what remains for the user instead of continuing.

## 5. Hand-off

Add a line to the PR description:

    Visual review: <rounds> round(s), <n> images reviewed, <k> issues fixed, open: <none | list>.
```

- [ ] **Step 2: Wire it into `CLAUDE.project.md`**

Add to the Commands table after the `npm run e2e` row:

```markdown
| `npm run visual` | Screenshots of the major pages at 4 sizes into `visual-output/` (not run in CI) |
```

Add a section after the CI paragraph:

```markdown
## Before a PR

- **UI changes** (anything a visitor can see): run the `visual-review` skill before opening the PR
  and put its summary line in the PR description. Checklist: `docs/design/visual-checklist.md`.
```

- [ ] **Step 3: Verify and commit**

Run: `npm run check`
Expected: pass (`.claude/` and `CLAUDE.project.md` are Prettier-ignored).

```bash
git add .claude/skills/visual-review/SKILL.md CLAUDE.project.md
git commit -m "docs: add the visual-review skill and require it before ui prs"
```

---

### Task 6: First real review run

No code changes; this is the skill's first use and the evidence for the PR.

- [ ] **Step 1: Run the `visual-review` skill end to end on all 54 images.**

Expected: a `visual-output/report.md` covering 54 images. The laptop and wide images are expected to
fail "uses the screen"; that is piece 2's job, so it is listed as open, not fixed here (Global
Constraint: no edits under `src/`). Any other issue found is also recorded as open for piece 2 and
reported to the user.

- [ ] **Step 2: Final verification**

Run: `npm run check && npm run e2e`
Expected: both pass, e2e 124 tests.

- [ ] **Step 3: Push and open the PR**

PR body: what changed, why, how it was tested (check + e2e counts, the three red proofs, the capture
count), the visual review summary line and the open issues list.
