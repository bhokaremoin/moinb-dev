export type Section = "home" | "projects" | "blog";

/**
 * Host mode: each section lives on its own subdomain of `rootDomain`.
 * Path mode: everything lives on one origin under internal prefixes. Used when no root domain is
 * configured, e.g. Vercel preview deployments, which only get a single `*.vercel.app` hostname.
 */
export type RoutingConfig =
  | { mode: "host"; rootDomain: string; protocol: "http" | "https" }
  | { mode: "path"; origin: string };

export const SECTION_SUBDOMAINS = {
  projects: "projects",
  blog: "blogs",
} as const satisfies Record<Exclude<Section, "home">, string>;

export const SECTION_PREFIXES = {
  projects: "/projects",
  blog: "/blog",
} as const satisfies Record<Exclude<Section, "home">, string>;

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname.endsWith(".localhost");
}

export function createRoutingConfig(env: {
  rootDomain?: string;
  vercelUrl?: string;
}): RoutingConfig {
  const rootDomain = env.rootDomain?.trim().toLowerCase();
  if (rootDomain) {
    const protocol = isLocalHostname(rootDomain.split(":")[0])
      ? "http"
      : "https";
    return { mode: "host", rootDomain, protocol };
  }

  if (env.vercelUrl) {
    return { mode: "path", origin: `https://${env.vercelUrl}` };
  }

  return { mode: "path", origin: "http://localhost:3000" };
}

// NEXT_PUBLIC_ variables must be read as literal property accesses so Next can inline them
// into client bundles.
export const routingConfig: RoutingConfig = createRoutingConfig({
  rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
});

function sectionHost(section: Section, rootDomain: string): string {
  if (section === "home") {
    return rootDomain;
  }
  return `${SECTION_SUBDOMAINS[section]}.${rootDomain}`;
}

/** The path for a section page as seen on the current host, for same-section links. */
export function sectionPath(
  section: Section,
  path = "/",
  config: RoutingConfig = routingConfig,
): string {
  if (config.mode === "host" || section === "home") {
    return path;
  }

  const prefix = SECTION_PREFIXES[section];
  return path === "/" ? prefix : `${prefix}${path}`;
}

/** The absolute public URL of a section page. Use for canonical URLs, feeds and cross-section links. */
export function sectionUrl(
  section: Section,
  path = "/",
  config: RoutingConfig = routingConfig,
): string {
  if (config.mode === "path") {
    return `${config.origin}${sectionPath(section, path, config)}`;
  }

  return `${config.protocol}://${sectionHost(section, config.rootDomain)}${path}`;
}

/**
 * A link target from a page in `current`: a relative path within a section, absolute across
 * them. Pass `undefined` when the page can appear on any host, such as the 404 page.
 */
export function sectionHref(
  target: Section,
  current: Section | undefined,
  path = "/",
  config: RoutingConfig = routingConfig,
): string {
  // In path mode every section shares one host, so a path keeps the visitor on it.
  if (target === current || config.mode === "path") {
    return sectionPath(target, path, config);
  }
  return sectionUrl(target, path, config);
}

/** The cookie `Domain` that shares a cookie across every section host. */
export function cookieDomain(
  config: RoutingConfig = routingConfig,
): string | undefined {
  if (config.mode === "path") {
    return undefined;
  }

  const hostname = config.rootDomain.split(":")[0];
  // Browsers never send a `Domain=localhost` cookie to its subdomains, which is why local
  // development uses a named root such as `moinb.localhost`.
  if (hostname === "localhost") {
    return undefined;
  }
  return `.${hostname}`;
}
