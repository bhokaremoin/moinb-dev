import { describe, expect, it } from "vitest";

import { blogSitemap, homeSitemap, projectsSitemap } from "./sitemap-entries";

describe("sitemaps", () => {
  it("lists the root host's pages", () => {
    expect(homeSitemap().map((entry) => entry.url)).toEqual([
      "https://moinb.dev/",
      "https://moinb.dev/now",
      "https://moinb.dev/uses",
    ]);
  });

  it("lists the projects index and each case study on the projects host", () => {
    const urls = projectsSitemap([
      { slug: "ledgerly", date: "2025-08-01T00:00:00.000Z", caseStudy: true },
      { slug: "dotfiles", date: "2023-03-01T00:00:00.000Z", caseStudy: false },
    ]).map((entry) => entry.url);

    expect(urls).toEqual([
      "https://projects.moinb.dev/",
      "https://projects.moinb.dev/ledgerly",
    ]);
  });

  it("lists the blog index and each post with its date", () => {
    const entries = blogSitemap([
      { slug: "rest-to-trpc", date: "2026-10-12T00:00:00.000Z" },
    ]);

    expect(entries).toEqual([
      { url: "https://blogs.moinb.dev/" },
      {
        url: "https://blogs.moinb.dev/rest-to-trpc",
        lastModified: "2026-10-12T00:00:00.000Z",
      },
    ]);
  });
});
