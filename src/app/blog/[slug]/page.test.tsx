import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PostPage, { generateMetadata, generateStaticParams } from "./page";

async function renderPost(slug: string) {
  render(
    await PostPage({
      params: Promise.resolve({ slug }),
      searchParams: Promise.resolve({}),
    }),
  );
}

describe("PostPage", () => {
  it("prerenders every post", async () => {
    expect(
      (await generateStaticParams()).map((params) => params.slug),
    ).toHaveLength(5);
  });

  it("shows the title, date, reading time and tags", async () => {
    await renderPost("rest-to-trpc");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Why I moved my side projects from REST to tRPC",
    );
    expect(screen.getByText("Oct 12, 2026")).toBeInTheDocument();
    expect(screen.getByText(/min read/)).toBeInTheDocument();
    expect(screen.getByText("#nextjs #typescript")).toBeInTheDocument();
  });

  it("has a table of contents and a copyable code block with its filename", async () => {
    await renderPost("rest-to-trpc");

    expect(
      screen.getByRole("navigation", { name: "On this page" }),
    ).toBeInTheDocument();
    expect(screen.getByText("server/routers/expense.ts")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
  });

  it("links to the older and newer posts", async () => {
    await renderPost("debugging-ttfb");

    expect(screen.getByRole("link", { name: /^Older/ })).toHaveAttribute(
      "href",
      "/postgres-partial-indexes",
    );
    expect(screen.getByRole("link", { name: /^Newer/ })).toHaveAttribute(
      "href",
      "/rest-to-trpc",
    );
  });

  it("is not found for an unknown slug", async () => {
    await expect(renderPost("missing")).rejects.toThrow();
  });
});

describe("post metadata", () => {
  it("is an article canonical on the blogs host with its own share image", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "rest-to-trpc" }),
      searchParams: Promise.resolve({}),
    });

    expect(metadata.alternates?.canonical).toBe(
      "https://blogs.moinb.dev/rest-to-trpc",
    );
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      images: [{ url: "https://blogs.moinb.dev/rest-to-trpc/og.png" }],
    });
  });
});
