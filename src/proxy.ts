import { type NextRequest, NextResponse } from "next/server";

import publishedSlugs from "#site/published-slugs";
import { resolveRoute } from "@/routing/resolve-route";
import { routingConfig } from "@/routing/site-urls";

// Rendered by app/not-found.tsx with a real 404 status, because no route matches it.
const NOT_FOUND_PATH = "/_not-found";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? request.nextUrl.host;
  const decision = resolveRoute(
    { host, pathname: request.nextUrl.pathname },
    routingConfig,
    publishedSlugs,
  );

  if (decision.action === "not-found") {
    const target = request.nextUrl.clone();
    target.pathname = NOT_FOUND_PATH;
    target.search = "";
    return NextResponse.rewrite(target);
  }

  if (decision.action === "rewrite") {
    const target = request.nextUrl.clone();
    target.pathname = decision.pathname;
    return NextResponse.rewrite(target);
  }

  if (decision.action === "redirect") {
    const target = new URL(decision.url);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Static build output never needs routing; everything else, including sitemap.xml,
  // robots.txt and rss.xml, goes through resolveRoute.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
