import { expect, test } from "@playwright/test";

import { BLOG_URL, PROJECTS_URL, ROOT_URL } from "./hosts";

test("the projects subdomain serves the projects index", async ({ page }) => {
  await page.goto(`${PROJECTS_URL}/`);

  await expect(
    page.getByRole("heading", { level: 1, name: "Things I've built" }),
  ).toBeVisible();
});

test("a project slug on the projects subdomain serves its case study", async ({
  page,
}) => {
  await page.goto(`${PROJECTS_URL}/ledgerly`);

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Ledgerly",
  );
});

test("a post slug on the blogs subdomain serves the post", async ({ page }) => {
  await page.goto(`${BLOG_URL}/rest-to-trpc`);

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "REST to tRPC",
  );
});

test("internal section paths on the root host redirect to their subdomain", async ({
  page,
}) => {
  await page.goto(`${ROOT_URL}/projects/ledgerly`);

  await expect(page).toHaveURL(`${PROJECTS_URL}/ledgerly`);
});

test("shared files are served on every subdomain", async ({ request }) => {
  const response = await request.get(`${PROJECTS_URL}/favicon.ico`);

  expect(response.status()).toBe(200);
});

test("an unknown slug is a real 404, not a soft one", async ({ request }) => {
  // A fresh slug each run: the first request for a URL is the one that used to return 200.
  const response = await request.get(`${BLOG_URL}/missing-${Date.now()}`);

  expect(response.status()).toBe(404);
  expect(await response.text()).toContain("Page not found");
});

test("an unknown page on the root host is a 404", async ({ request }) => {
  const response = await request.get(`${ROOT_URL}/missing-${Date.now()}`);

  expect(response.status()).toBe(404);
});

test("the nav moves between subdomains", async ({ page }) => {
  await page.goto(`${PROJECTS_URL}/`);

  await page.getByRole("link", { name: "Blog" }).click();

  await expect(page).toHaveURL(`${BLOG_URL}/`);
  await expect(
    page.getByRole("heading", { level: 1, name: "Writing" }),
  ).toBeVisible();
});

test("archive-only projects have no case study page", async ({ request }) => {
  const response = await request.get(`${PROJECTS_URL}/dotfiles`);

  expect(response.status()).toBe(404);
});

test("unknown files on a section host are a real 404", async ({ request }) => {
  const response = await request.get(`${PROJECTS_URL}/apple-touch-icon.png`);

  expect(response.status()).toBe(404);
});
