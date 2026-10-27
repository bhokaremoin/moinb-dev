import type { MetadataRoute } from "next";

import { sectionUrl } from "@/routing/site-urls";

export function homeSitemap(): MetadataRoute.Sitemap {
  return ["/", "/now", "/uses"].map((path) => ({
    url: sectionUrl("home", path),
  }));
}

export function projectsSitemap(
  projects: { slug: string; date: string; caseStudy: boolean }[],
): MetadataRoute.Sitemap {
  const caseStudies = projects.filter((project) => project.caseStudy);
  return [
    { url: sectionUrl("projects") },
    ...caseStudies.map((project) => ({
      url: sectionUrl("projects", `/${project.slug}`),
    })),
  ];
}

export function blogSitemap(
  posts: { slug: string; date: string }[],
): MetadataRoute.Sitemap {
  return [
    { url: sectionUrl("blog") },
    ...posts.map((post) => ({
      url: sectionUrl("blog", `/${post.slug}`),
      lastModified: post.date,
    })),
  ];
}
