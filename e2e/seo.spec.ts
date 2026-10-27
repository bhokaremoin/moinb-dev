import { expect, test } from "@playwright/test";

import { BLOG_URL, PROJECTS_URL, ROOT_URL } from "./hosts";

const HOSTS = [
  { name: "root", url: ROOT_URL, samplePage: `${ROOT_URL}/now` },
  {
    name: "projects",
    url: PROJECTS_URL,
    samplePage: `${PROJECTS_URL}/ledgerly`,
  },
  { name: "blog", url: BLOG_URL, samplePage: `${BLOG_URL}/rest-to-trpc` },
];

for (const host of HOSTS) {
  test(`the ${host.name} host has its own sitemap`, async ({ request }) => {
    const response = await request.get(`${host.url}/sitemap.xml`);

    expect(response.status()).toBe(200);
    const sitemap = await response.text();
    expect(sitemap).toContain(`<loc>${host.url}/</loc>`);
    expect(sitemap).toContain(`<loc>${host.samplePage}</loc>`);
  });

  test(`the ${host.name} host has its own robots.txt`, async ({ request }) => {
    const response = await request.get(`${host.url}/robots.txt`);

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`Sitemap: ${host.url}/sitemap.xml`);
  });

  test(`a ${host.name} page declares its canonical url`, async ({ page }) => {
    await page.goto(host.samplePage);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      host.samplePage,
    );
  });
}

test("the blog serves an rss feed", async ({ request }) => {
  const response = await request.get(`${BLOG_URL}/rss.xml`);

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  expect(await response.text()).toContain(
    `<link>${BLOG_URL}/rest-to-trpc</link>`,
  );
});

test("every page's share image is a png that loads", async ({
  page,
  request,
}) => {
  for (const url of [
    `${ROOT_URL}/`,
    `${PROJECTS_URL}/ledgerly`,
    `${BLOG_URL}/rest-to-trpc`,
  ]) {
    await page.goto(url);
    const imageUrl = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");

    const image = await request.get(imageUrl!);
    expect(image.status(), imageUrl!).toBe(200);
    expect(image.headers()["content-type"]).toBe("image/png");
  }
});
