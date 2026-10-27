import { posts } from "#site/content";
import { blogSitemap } from "@/seo/sitemap-entries";

export default function sitemap() {
  return blogSitemap(posts);
}
