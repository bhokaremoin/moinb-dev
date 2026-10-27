import { projects } from "#site/content";
import { projectsSitemap } from "@/seo/sitemap-entries";

export default function sitemap() {
  return projectsSitemap(projects);
}
