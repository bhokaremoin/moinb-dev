import { expect, test } from "@playwright/test";

import { BLOG_URL, ROOT_URL } from "./hosts";

test("a chosen theme follows the visitor to another subdomain", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(`${ROOT_URL}/`);

  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.goto(`${BLOG_URL}/`);

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("the saved theme is applied before the page body is parsed", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "theme", value: "dark", url: `${BLOG_URL}/` },
  ]);
  // Record the theme at the moment <body> is created, i.e. before anything can be painted.
  await page.addInitScript(() => {
    new MutationObserver((_records, observer) => {
      if (document.body) {
        (window as unknown as { themeAtBody?: string }).themeAtBody =
          document.documentElement.dataset.theme;
        observer.disconnect();
      }
    }).observe(document, { childList: true, subtree: true });
  });

  await page.goto(`${BLOG_URL}/rest-to-trpc`);

  const themeAtBody = await page.evaluate(
    () => (window as unknown as { themeAtBody?: string }).themeAtBody,
  );
  expect(themeAtBody).toBe("dark");
});

test("without a saved theme the system preference is used", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(`${ROOT_URL}/`);

  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(background).toBe("rgb(15, 17, 21)");
});
