import { cookieDomain } from "@/routing/site-urls";

import { parseTheme, serializeThemeCookie, type Theme } from "./theme-cookie";

function displayedTheme(): Theme {
  const chosenTheme = parseTheme(document.documentElement.dataset.theme);
  if (chosenTheme) {
    return chosenTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Flips the theme currently on screen and saves the choice for every subdomain. */
export function toggleTheme(): Theme {
  const nextTheme = displayedTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  document.cookie = serializeThemeCookie(nextTheme, cookieDomain());
  return nextTheme;
}
