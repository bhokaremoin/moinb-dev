import { Analytics } from "@vercel/analytics/next";

/**
 * The single place analytics is wired in. Vercel Analytics needs no setup on Vercel and sets no
 * cookies; to switch to Umami, replace this component's body with Umami's <Script> tag.
 *
 * Its script is served by Vercel itself, so it is only rendered in Vercel builds; elsewhere it
 * would 404 on every page.
 */
export function SiteAnalytics() {
  if (process.env.VERCEL !== "1") {
    return null;
  }
  return <Analytics />;
}
