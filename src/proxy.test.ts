import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { proxy } from "./proxy";

function requestFor(url: string) {
  const { host } = new URL(url);
  return new NextRequest(url, { headers: { host } });
}

describe("proxy", () => {
  it("rewrites a section subdomain into its internal route", () => {
    const response = proxy(requestFor("https://projects.moinb.dev/ledgerly"));

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://projects.moinb.dev/projects/ledgerly",
    );
  });

  it("redirects internal section paths on the root host to the subdomain", () => {
    const response = proxy(requestFor("https://moinb.dev/blog/rest-to-trpc"));

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://blogs.moinb.dev/rest-to-trpc",
    );
  });

  it("keeps the query string when rewriting", () => {
    const response = proxy(requestFor("https://blogs.moinb.dev/?tag=nextjs"));

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://blogs.moinb.dev/blog?tag=nextjs",
    );
  });

  it("rewrites an unpublished slug to a path no route serves, so it gets the real 404", () => {
    // Not /_not-found: that is a prerendered page, and Vercel's CDN serves it with a 200.
    const response = proxy(requestFor("https://blogs.moinb.dev/no-such-post"));

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://blogs.moinb.dev/_no-route",
    );
  });

  it("lets root pages through untouched", () => {
    const response = proxy(requestFor("https://moinb.dev/now"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
