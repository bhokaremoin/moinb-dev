export type Theme = "light" | "dark";

export const THEME_COOKIE = "theme";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function parseTheme(value: string | undefined): Theme | undefined {
  if (value === "light" || value === "dark") {
    return value;
  }
  return undefined;
}

/** `domain` shares the cookie across subdomains; leave it undefined for a host-only cookie. */
export function serializeThemeCookie(
  theme: Theme,
  domain: string | undefined,
): string {
  const attributes = [
    `${THEME_COOKIE}=${theme}`,
    "Path=/",
    `Max-Age=${ONE_YEAR_IN_SECONDS}`,
    "SameSite=Lax",
  ];
  if (domain) {
    attributes.push(`Domain=${domain}`);
  }
  return attributes.join("; ");
}
