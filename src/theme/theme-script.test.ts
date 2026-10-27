import { afterEach, describe, expect, it } from "vitest";

import { buildThemeScript } from "./theme-script";

function runThemeScript() {
  new Function(buildThemeScript())();
}

function clearThemeCookie() {
  document.cookie = "theme=; Max-Age=0; Path=/";
}

describe("theme script", () => {
  afterEach(() => {
    clearThemeCookie();
    document.documentElement.removeAttribute("data-theme");
  });

  it("applies a saved theme before the page renders", () => {
    document.cookie = "theme=dark; Path=/";

    runThemeScript();

    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("finds the theme among other cookies", () => {
    document.cookie = "a=1; Path=/";
    document.cookie = "theme=light; Path=/";

    runThemeScript();

    expect(document.documentElement.dataset.theme).toBe("light");
    document.cookie = "a=; Max-Age=0; Path=/";
  });

  it("ignores cookies whose name only ends with theme", () => {
    document.cookie = "colortheme=dark; Path=/";

    runThemeScript();

    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    document.cookie = "colortheme=; Max-Age=0; Path=/";
  });

  it("ignores values that only start with a theme name", () => {
    document.cookie = "theme=darkness; Path=/";

    runThemeScript();

    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("leaves the theme to the system preference when nothing is saved", () => {
    runThemeScript();

    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("ignores a saved value that is not a theme", () => {
    document.cookie = "theme=purple; Path=/";

    runThemeScript();

    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });
});
