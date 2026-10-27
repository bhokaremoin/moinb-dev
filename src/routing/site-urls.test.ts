import { describe, expect, it } from "vitest";

import {
  cookieDomain,
  createRoutingConfig,
  sectionHref,
  sectionPath,
  sectionUrl,
} from "./site-urls";

const production = createRoutingConfig({ rootDomain: "moinb.dev" });
const local = createRoutingConfig({ rootDomain: "localhost:3000" });
const namedLocal = createRoutingConfig({ rootDomain: "moinb.localhost:3000" });
const preview = createRoutingConfig({ vercelUrl: "preview.vercel.app" });
const pathOnLocalhost = createRoutingConfig({});

describe("createRoutingConfig", () => {
  it("uses host mode over https for a real root domain", () => {
    expect(production).toEqual({
      mode: "host",
      rootDomain: "moinb.dev",
      protocol: "https",
    });
  });

  it("uses http for a localhost root domain", () => {
    expect(local).toEqual({
      mode: "host",
      rootDomain: "localhost:3000",
      protocol: "http",
    });
  });

  it("uses http for a named root under .localhost", () => {
    expect(namedLocal).toEqual({
      mode: "host",
      rootDomain: "moinb.localhost:3000",
      protocol: "http",
    });
  });

  it("falls back to path mode on the Vercel deployment url when no root domain is set", () => {
    expect(preview).toEqual({
      mode: "path",
      origin: "https://preview.vercel.app",
    });
  });

  it("falls back to path mode on localhost when nothing is set", () => {
    expect(pathOnLocalhost).toEqual({
      mode: "path",
      origin: "http://localhost:3000",
    });
  });
});

describe("sectionUrl", () => {
  it("puts each section on its own subdomain in host mode", () => {
    expect(sectionUrl("home", "/", production)).toBe("https://moinb.dev/");
    expect(sectionUrl("projects", "/ledgerly", production)).toBe(
      "https://projects.moinb.dev/ledgerly",
    );
    expect(sectionUrl("blog", "/x", local)).toBe(
      "http://blogs.localhost:3000/x",
    );
  });

  it("defaults the path to the section root", () => {
    expect(sectionUrl("blog", undefined, production)).toBe(
      "https://blogs.moinb.dev/",
    );
  });

  it("prefixes the internal section path in path mode", () => {
    expect(sectionUrl("blog", "/x", preview)).toBe(
      "https://preview.vercel.app/blog/x",
    );
    expect(sectionUrl("projects", "/", preview)).toBe(
      "https://preview.vercel.app/projects",
    );
    expect(sectionUrl("home", "/now", preview)).toBe(
      "https://preview.vercel.app/now",
    );
  });
});

describe("sectionPath", () => {
  it("returns the public path unchanged in host mode", () => {
    expect(sectionPath("projects", "/ledgerly", production)).toBe("/ledgerly");
    expect(sectionPath("blog", "/", production)).toBe("/");
  });

  it("prefixes the internal section path in path mode", () => {
    expect(sectionPath("projects", "/", preview)).toBe("/projects");
    expect(sectionPath("projects", "/ledgerly", preview)).toBe(
      "/projects/ledgerly",
    );
    expect(sectionPath("home", "/now", preview)).toBe("/now");
  });
});

describe("sectionHref", () => {
  it("returns a same-host path when linking within the current section", () => {
    expect(sectionHref("projects", "projects", "/ledgerly", production)).toBe(
      "/ledgerly",
    );
  });

  it("returns an absolute url when the current section is unknown", () => {
    expect(sectionHref("home", undefined, "/#about", production)).toBe(
      "https://moinb.dev/#about",
    );
  });

  it("returns an absolute url when linking to another section", () => {
    expect(sectionHref("blog", "projects", "/x", production)).toBe(
      "https://blogs.moinb.dev/x",
    );
  });
});

describe("cookieDomain", () => {
  it("shares cookies across subdomains of a real root domain", () => {
    expect(cookieDomain(production)).toBe(".moinb.dev");
  });

  it("shares cookies under a named .localhost root, which browsers allow", () => {
    expect(cookieDomain(namedLocal)).toBe(".moinb.localhost");
  });

  it("leaves the domain unset for bare localhost and path mode", () => {
    expect(cookieDomain(local)).toBeUndefined();
    expect(cookieDomain(preview)).toBeUndefined();
  });
});
