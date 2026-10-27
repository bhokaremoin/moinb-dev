import { describe, expect, it } from "vitest";

import { robotsText } from "./robots-text";

describe("robotsText", () => {
  it("allows crawling and points at the host's own sitemap", () => {
    expect(robotsText("blog")).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://blogs.moinb.dev/sitemap.xml\n",
    );
  });
});
