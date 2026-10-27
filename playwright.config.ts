import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;
export const E2E_ROOT_DOMAIN = `moinb.localhost:${PORT}`;

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
  // Tests run against a production build so they see real prerendering and the proxy.
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://${E2E_ROOT_DOMAIN}`,
    env: { NEXT_PUBLIC_ROOT_DOMAIN: E2E_ROOT_DOMAIN },
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
