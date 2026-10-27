import { describe, expect, it } from "vitest";

import {
  parseTheme,
  readThemeCookie,
  serializeThemeCookie,
} from "./theme-cookie";

describe("parseTheme", () => {
  it("accepts light and dark", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
  });

  it("ignores unknown or missing values so the system preference wins", () => {
    expect(parseTheme("purple")).toBeUndefined();
    expect(parseTheme(undefined)).toBeUndefined();
  });
});

describe("readThemeCookie", () => {
  it("finds the theme among other cookies", () => {
    expect(readThemeCookie("a=1; theme=light; b=2")).toBe("light");
  });

  it("ignores a theme cookie with an invalid value", () => {
    expect(readThemeCookie("theme=purple")).toBeUndefined();
  });

  it("does not match cookies whose name only ends with theme", () => {
    expect(readThemeCookie("colortheme=dark")).toBeUndefined();
  });
});

describe("serializeThemeCookie", () => {
  it("shares the cookie across subdomains for a year", () => {
    const cookie = serializeThemeCookie("dark", ".moinb.dev");

    expect(cookie).toContain("theme=dark");
    expect(cookie).toContain("Domain=.moinb.dev");
    expect(cookie).toContain("Max-Age=31536000");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("SameSite=Lax");
  });

  it("writes a host-only cookie when no domain is given", () => {
    expect(serializeThemeCookie("light", undefined)).not.toContain("Domain=");
  });
});
