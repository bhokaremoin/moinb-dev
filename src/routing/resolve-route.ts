import {
  type RoutingConfig,
  routingConfig,
  SECTION_PREFIXES,
  SECTION_SUBDOMAINS,
  sectionUrl,
} from "./site-urls";

export type RouteDecision =
  | { action: "next" }
  | { action: "rewrite"; pathname: string }
  | { action: "redirect"; url: string }
  | { action: "not-found" };

type RoutedSection = keyof typeof SECTION_PREFIXES;

export type PublishedSlugs = Record<RoutedSection, readonly string[]>;

const ROUTED_SECTIONS = Object.keys(SECTION_PREFIXES) as RoutedSection[];

// Files every host serves from the app root rather than from its own section. A new file in
// public/ must be listed here, or section hosts will answer it with a 404.
const SHARED_PATHS = new Set(["/favicon.ico", "/resume.pdf"]);
// `/_vercel/` carries Vercel Analytics' script and events, which must work on every host.
const SHARED_PREFIXES = ["/_next/", "/__nextjs", "/_vercel/", "/static/"];

// Single-segment files each section serves itself, from route handlers under its folder.
const SECTION_FILES: Record<RoutedSection, readonly string[]> = {
  projects: ["/robots.txt", "/sitemap.xml"],
  blog: ["/robots.txt", "/sitemap.xml", "/rss.xml"],
};

function isSharedPath(pathname: string): boolean {
  return (
    SHARED_PATHS.has(pathname) ||
    SHARED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

const SINGLE_SEGMENT = /^\/([^/]+)$/;

/**
 * Below a section's index, a single segment is either one of the section's own files or a
 * published slug; anything else would fall into the [slug] page and stream a 200.
 */
function isUnknownSectionPath(
  pathname: string,
  section: RoutedSection,
  publishedSlugs: readonly string[],
): boolean {
  const segment = SINGLE_SEGMENT.exec(pathname)?.[1];
  if (segment === undefined) {
    return false;
  }
  return (
    !SECTION_FILES[section].includes(pathname) &&
    !publishedSlugs.includes(segment)
  );
}

function sectionForHost(
  host: string,
  rootDomain: string,
): RoutedSection | undefined {
  const hostname = host.toLowerCase().split(":")[0];
  const rootHostname = rootDomain.split(":")[0];
  return ROUTED_SECTIONS.find(
    (section) => hostname === `${SECTION_SUBDOMAINS[section]}.${rootHostname}`,
  );
}

function sectionForInternalPath(
  pathname: string,
): { section: RoutedSection; publicPath: string } | undefined {
  for (const section of ROUTED_SECTIONS) {
    const prefix = SECTION_PREFIXES[section];
    if (pathname === prefix) {
      return { section, publicPath: "/" };
    }
    if (pathname.startsWith(`${prefix}/`)) {
      return { section, publicPath: pathname.slice(prefix.length) };
    }
  }
  return undefined;
}

/**
 * Maps a public request (host + path) onto the app's internal routes. Section hosts are rewritten
 * into their section; internal section paths on the root host redirect to their subdomain so each
 * page has exactly one public URL.
 *
 * With `publishedSlugs`, unknown slugs and files resolve to not-found here. The slug pages render their
 * fallback through a streamed shell, which has already sent a 200 by the time the page itself
 * can call notFound(); deciding in the proxy keeps the status a real 404.
 */
export function resolveRoute(
  request: { host: string; pathname: string },
  config: RoutingConfig = routingConfig,
  publishedSlugs?: PublishedSlugs,
): RouteDecision {
  if (config.mode === "path" || isSharedPath(request.pathname)) {
    return { action: "next" };
  }

  const hostSection = sectionForHost(request.host, config.rootDomain);
  if (hostSection) {
    if (
      publishedSlugs &&
      isUnknownSectionPath(
        request.pathname,
        hostSection,
        publishedSlugs[hostSection],
      )
    ) {
      return { action: "not-found" };
    }
    const prefix = SECTION_PREFIXES[hostSection];
    const pathname =
      request.pathname === "/" ? prefix : `${prefix}${request.pathname}`;
    return { action: "rewrite", pathname };
  }

  const internal = sectionForInternalPath(request.pathname);
  if (internal) {
    return {
      action: "redirect",
      url: sectionUrl(internal.section, internal.publicPath, config),
    };
  }

  return { action: "next" };
}
