import { describe, expect, it } from "vitest";

import { buildRssFeed } from "./rss-feed";

const posts = [
  {
    slug: "older",
    title: "Older post",
    summary: "First",
    date: "2025-01-01T00:00:00.000Z",
    tags: ["career"],
  },
  {
    slug: "tricky",
    title: `Ampersands & <tags> "quoted" 'single'`,
    summary: "Second",
    date: "2026-10-12T00:00:00.000Z",
    tags: ["nextjs"],
  },
];

describe("buildRssFeed", () => {
  const feed = buildRssFeed(posts);

  it("is an rss 2.0 document that links to itself", () => {
    expect(feed).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(feed).toContain('<rss version="2.0"');
    expect(feed).toContain(
      '<atom:link href="https://blogs.moinb.dev/rss.xml" rel="self" type="application/rss+xml"/>',
    );
  });

  it("lists posts newest first with absolute links and rfc 822 dates", () => {
    const firstItem = feed.indexOf("<item>");
    expect(feed.indexOf("tricky")).toBeGreaterThan(firstItem);
    expect(feed.indexOf("tricky")).toBeLessThan(feed.indexOf("older"));
    expect(feed).toContain("<link>https://blogs.moinb.dev/older</link>");
    expect(feed).toContain("<pubDate>Mon, 12 Oct 2026 00:00:00 GMT</pubDate>");
  });

  it("escapes xml special characters in text", () => {
    expect(feed).toContain(
      "<title>Ampersands &amp; &lt;tags&gt; &quot;quoted&quot; &apos;single&apos;</title>",
    );
  });

  it("tags each item with its categories", () => {
    expect(feed).toContain("<category>nextjs</category>");
  });
});
