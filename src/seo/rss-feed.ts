import { site } from "@content/site";
import { sortPostsByDate } from "@/blog/post-queries";
import { sectionUrl } from "@/routing/site-urls";

type FeedPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
};

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => XML_ESCAPES[character]);
}

function feedItem(post: FeedPost): string {
  const url = sectionUrl("blog", `/${post.slug}`);
  const categories = post.tags
    .map((tag) => `      <category>${escapeXml(tag)}</category>`)
    .join("\n");
  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    `      <description>${escapeXml(post.summary)}</description>`,
    `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
    categories,
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

/** RSS 2.0 feed of every post. Hand-written: the format is small and needs no dependency. */
export function buildRssFeed(posts: FeedPost[]): string {
  const items = sortPostsByDate(posts).map(feedItem).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} · Writing`)}</title>
    <link>${sectionUrl("blog")}</link>
    <description>Notes on building for the web: debugging stories, architecture decisions and short TILs.</description>
    <language>en</language>
    <atom:link href="${sectionUrl("blog", "/rss.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
