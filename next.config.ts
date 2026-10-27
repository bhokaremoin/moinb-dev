import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");

// Velite compiles content/ into .velite/ before Next starts. Its webpack plugin doesn't run
// under Turbopack, so it is started here instead; the env flag stops Next's worker processes,
// which re-load this file, from starting it again.
export default async function createNextConfig(): Promise<NextConfig> {
  if ((isDev || isBuild) && !process.env.VELITE_STARTED) {
    process.env.VELITE_STARTED = "1";
    const { build } = await import("velite");
    // Strict in builds so an invalid content file fails the deploy instead of silently vanishing.
    await build({ watch: isDev, clean: !isDev, strict: isBuild });
  }
  return nextConfig;
}
