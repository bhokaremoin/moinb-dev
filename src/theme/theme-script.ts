import { THEME_COOKIE } from "./theme-cookie";

/**
 * A blocking inline script for `<head>` that applies the saved theme before first paint.
 * The cookie is read here instead of on the server so pages stay statically prerendered.
 */
export function buildThemeScript(): string {
  return `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)${THEME_COOKIE}=(light|dark)(?:;|$)/);if(m)document.documentElement.setAttribute("data-theme",m[1])}catch(e){}})()`;
}
