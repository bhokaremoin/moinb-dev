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

// Files every host serves from the app root rather than from its own section.
const SHARED_PATHS = new Set(["/favicon.ico", "/resume.pdf"]);
const SHARED_PREFIXES = ["/_next/", "/__nextjs", "/static/"];

function isSharedPath(pathname: string): boolean {
  return (
    SHARED_PATHS.has(pathname) ||
    SHARED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

// A single path segment without a file extension, e.g. `/ledgerly`, is always a content slug.
const SLUG_PATH = /^\/([^/.]+)$/;

function isUnpublishedSlug(
  pathname: string,
  publishedSlugs: readonly string[],
): boolean {
  const slug = SLUG_PATH.exec(pathname)?.[1];
  return slug !== undefined && !publishedSlugs.includes(slug);
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
 * With `publishedSlugs`, unknown slugs resolve to not-found here. The slug pages render their
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
      isUnpublishedSlug(request.pathname, publishedSlugs[hostSection])
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
