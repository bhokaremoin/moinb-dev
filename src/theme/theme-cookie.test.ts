import { describe, expect, it } from "vitest";

import { parseTheme, serializeThemeCookie } from "./theme-cookie";

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
