import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    environmentOptions: { jsdom: { url: "https://moinb.dev/" } },
    setupFiles: ["./vitest.setup.ts"],
    // Playwright owns e2e/; its *.spec.ts files must not run under Vitest.
    exclude: ["e2e/**", "node_modules/**"],
    // Component tests render links as production would, with each section on its own subdomain.
    env: { NEXT_PUBLIC_ROOT_DOMAIN: "moinb.dev" },
  },
});
