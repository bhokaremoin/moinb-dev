import { posts } from "#site/content";
import { buildRssFeed } from "@/seo/rss-feed";

export function GET() {
  return new Response(buildRssFeed(posts), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
