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
