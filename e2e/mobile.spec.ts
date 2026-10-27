import { expect, test } from "@playwright/test";

import { BLOG_URL, PROJECTS_URL, ROOT_URL } from "./hosts";

test.use({ viewport: { width: 390, height: 844 } });

const PAGES = [
  `${ROOT_URL}/`,
  `${PROJECTS_URL}/`,
  `${PROJECTS_URL}/ledgerly`,
  `${BLOG_URL}/`,
  `${BLOG_URL}/rest-to-trpc`,
];

for (const url of PAGES) {
  test(`${url} fits a phone screen without sideways scrolling`, async ({
    page,
  }) => {
    await page.goto(url);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
