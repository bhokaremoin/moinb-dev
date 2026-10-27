import { expect, test } from "@playwright/test";

import { E2E_ROOT_DOMAIN } from "../playwright.config";
import { BLOG_URL, PROJECTS_URL, ROOT_URL } from "./hosts";

function isSiteUrl(url: URL): boolean {
  return (
    url.host === E2E_ROOT_DOMAIN || url.host.endsWith(`.${E2E_ROOT_DOMAIN}`)
  );
}

function withoutHash(url: URL): string {
  return `${url.origin}${url.pathname}${url.search}`;
}

test("every internal link on every page resolves", async ({
  page,
  request,
}) => {
  test.setTimeout(120_000);
  const pagesToVisit = [`${ROOT_URL}/`, `${PROJECTS_URL}/`, `${BLOG_URL}/`];
  const visitedPages = new Set<string>();
  const checkedLinks = new Map<string, number>();

  while (pagesToVisit.length > 0) {
    const pageUrl = pagesToVisit.shift()!;
    if (visitedPages.has(pageUrl)) {
      continue;
    }
    visitedPages.add(pageUrl);
    await page.goto(pageUrl);

    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
      );

    for (const href of hrefs) {
      const url = new URL(href);
      if (!url.protocol.startsWith("http") || !isSiteUrl(url)) {
        continue;
      }
      const target = withoutHash(url);
      if (!checkedLinks.has(target)) {
        const response = await request.get(target);
        checkedLinks.set(target, response.status());
        const isPage = (response.headers()["content-type"] ?? "").includes(
          "text/html",
        );
        if (response.ok() && isPage) {
          pagesToVisit.push(target);
        }
      }
    }
  }

  const brokenLinks = [...checkedLinks].filter(([, status]) => status >= 400);
  expect(brokenLinks).toEqual([]);
  expect(visitedPages.size).toBeGreaterThan(12);
});
