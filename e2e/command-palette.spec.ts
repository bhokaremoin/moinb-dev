import { expect, test } from "@playwright/test";

import { PROJECTS_URL, ROOT_URL } from "./hosts";

test("the command palette jumps to a case study on another subdomain", async ({
  page,
}) => {
  await page.goto(`${ROOT_URL}/`);
  // The shortcut listener attaches on hydration; a real visitor never presses it sooner.
  await page.waitForLoadState("networkidle");

  await page.keyboard.press("ControlOrMeta+k");
  await page.getByRole("combobox").fill("ledgerly");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(`${PROJECTS_URL}/ledgerly`);
});

test("the nav button opens the command palette", async ({ page }) => {
  await page.goto(`${ROOT_URL}/`);

  await page.getByRole("button", { name: "Open command menu" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
});
