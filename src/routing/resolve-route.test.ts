import { describe, expect, it } from "vitest";

import { resolveRoute } from "./resolve-route";
import { createRoutingConfig } from "./site-urls";

const production = createRoutingConfig({ rootDomain: "moinb.dev" });
const local = createRoutingConfig({ rootDomain: "localhost:3000" });
const preview = createRoutingConfig({ vercelUrl: "preview.vercel.app" });

describe("resolveRoute on a section host", () => {
  it("rewrites a projects subdomain path into the projects section", () => {
    expect(
      resolveRoute(
        { host: "projects.moinb.dev", pathname: "/ledgerly" },
        production,
      ),
    ).toEqual({ action: "rewrite", pathname: "/projects/ledgerly" });
  });

  it("rewrites the subdomain root to the section index", () => {
    expect(
      resolveRoute({ host: "projects.moinb.dev", pathname: "/" }, production),
    ).toEqual({
      action: "rewrite",
      pathname: "/projects",
    });
  });

  it("rewrites blogs subdomain files such as the rss feed", () => {
    expect(
      resolveRoute(
        { host: "blogs.moinb.dev", pathname: "/rss.xml" },
        production,
      ),
    ).toEqual({
      action: "rewrite",
      pathname: "/blog/rss.xml",
    });
  });

  it("matches the host case-insensitively and ignores the port", () => {
    expect(
      resolveRoute({ host: "Projects.LOCALHOST:3000", pathname: "/x" }, local),
    ).toEqual({
      action: "rewrite",
      pathname: "/projects/x",
    });
  });

  it("does not treat an already prefixed path as a second public url", () => {
    expect(
      resolveRoute(
        { host: "projects.moinb.dev", pathname: "/projects/ledgerly" },
        production,
      ),
    ).toEqual({ action: "rewrite", pathname: "/projects/projects/ledgerly" });
  });

  it("passes shared root files and framework assets through unchanged", () => {
    for (const pathname of [
      "/favicon.ico",
      "/resume.pdf",
      "/_next/static/a.js",
      "/static/x.png",
      "/_vercel/insights/script.js",
    ]) {
      expect(
        resolveRoute({ host: "projects.moinb.dev", pathname }, production),
      ).toEqual({
        action: "next",
      });
    }
  });
});

describe("resolveRoute on the root host", () => {
  it("serves root pages as they are", () => {
    expect(
      resolveRoute({ host: "moinb.dev", pathname: "/now" }, production),
    ).toEqual({
      action: "next",
    });
  });

  it("redirects internal section paths to their subdomain", () => {
    expect(
      resolveRoute(
        { host: "moinb.dev", pathname: "/projects/ledgerly" },
        production,
      ),
    ).toEqual({
      action: "redirect",
      url: "https://projects.moinb.dev/ledgerly",
    });
    expect(
      resolveRoute({ host: "moinb.dev", pathname: "/blog" }, production),
    ).toEqual({
      action: "redirect",
      url: "https://blogs.moinb.dev/",
    });
  });

  it("does not redirect paths that only start with a section name", () => {
    expect(
      resolveRoute({ host: "moinb.dev", pathname: "/blogroll" }, production),
    ).toEqual({
      action: "next",
    });
  });

  it("serves unknown subdomains as the root site", () => {
    expect(
      resolveRoute({ host: "www.moinb.dev", pathname: "/" }, production),
    ).toEqual({
      action: "next",
    });
  });
});

describe("resolveRoute in path mode", () => {
  it("leaves every request alone", () => {
    expect(
      resolveRoute(
        { host: "preview.vercel.app", pathname: "/projects/ledgerly" },
        preview,
      ),
    ).toEqual({ action: "next" });
  });
});

describe("resolveRoute with the published slugs", () => {
  const publishedSlugs = { projects: ["ledgerly"], blog: ["rest-to-trpc"] };

  function resolve(host: string, pathname: string) {
    return resolveRoute({ host, pathname }, production, publishedSlugs);
  }

  it("rewrites a published slug as usual", () => {
    expect(resolve("projects.moinb.dev", "/ledgerly")).toEqual({
      action: "rewrite",
      pathname: "/projects/ledgerly",
    });
  });

  it("answers an unknown slug with not-found before the page renders", () => {
    expect(resolve("projects.moinb.dev", "/missing")).toEqual({
      action: "not-found",
    });
    expect(resolve("blogs.moinb.dev", "/ledgerly")).toEqual({
      action: "not-found",
    });
  });

  it("leaves each section's index and own files to their routes", () => {
    for (const pathname of [
      "/",
      "/sitemap.xml",
      "/robots.txt",
      "/rss.xml",
      "/rest-to-trpc/og.png",
    ]) {
      expect(resolve("blogs.moinb.dev", pathname).action).toBe("rewrite");
    }
  });

  it("answers unknown files on a section host with not-found", () => {
    for (const pathname of ["/apple-touch-icon.png", "/feed.xml", "/og.png"]) {
      expect(resolve("projects.moinb.dev", pathname)).toEqual({
        action: "not-found",
      });
    }
  });

  it("only serves the rss feed on the blog host", () => {
    expect(resolve("projects.moinb.dev", "/rss.xml")).toEqual({
      action: "not-found",
    });
  });
});
