import { type Section, sectionUrl } from "@/routing/site-urls";

/** Each host has its own robots.txt, so each one names its own sitemap. */
export function robotsText(section: Section): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${sectionUrl(section, "/sitemap.xml")}\n`;
}

export function robotsResponse(section: Section): Response {
  return new Response(robotsText(section), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
