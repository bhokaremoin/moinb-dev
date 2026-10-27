import { describe, expect, it } from "vitest";

import { pageMetadata } from "./page-metadata";

describe("pageMetadata", () => {
  const metadata = pageMetadata({
    section: "projects",
    path: "/ledgerly",
    title: "Ledgerly",
    description: "Expense splitting for flatmates.",
    ogImagePath: "/ledgerly/og.png",
  });

  it("sets an absolute canonical url on the section's own host", () => {
    expect(metadata.alternates?.canonical).toBe(
      "https://projects.moinb.dev/ledgerly",
    );
  });

  it("shares the page with its own open graph image", () => {
    expect(metadata.openGraph).toMatchObject({
      title: "Ledgerly",
      description: "Expense splitting for flatmates.",
      url: "https://projects.moinb.dev/ledgerly",
      siteName: "moinb.dev",
      images: [
        {
          url: "https://projects.moinb.dev/ledgerly/og.png",
          width: 1200,
          height: 630,
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("falls back to the site-wide image", () => {
    const home = pageMetadata({
      section: "home",
      path: "/now",
      title: "Now",
      description: "What I'm doing now.",
    });

    expect(home.openGraph).toMatchObject({
      images: [{ url: "https://moinb.dev/og.png" }],
    });
  });

  it("marks posts as articles with their publish date", () => {
    const post = pageMetadata({
      section: "blog",
      path: "/x",
      title: "X",
      description: "Y",
      publishedTime: "2026-10-12T00:00:00.000Z",
    });

    expect(post.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-10-12T00:00:00.000Z",
    });
  });
});
