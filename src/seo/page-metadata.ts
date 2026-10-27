import type { Metadata } from "next";

import { type Section, sectionUrl } from "@/routing/site-urls";

export const SITE_NAME = "moinb.dev";
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
const DEFAULT_OG_IMAGE_URL = () => sectionUrl("home", "/og.png");

/**
 * Metadata for one page. Canonical and Open Graph URLs are absolute because each section lives
 * on its own host, and the root layout's metadataBase only covers moinb.dev.
 */
export function pageMetadata(page: {
  section: Section;
  path: string;
  title: string;
  description: string;
  ogImagePath?: string;
  publishedTime?: string;
}): Metadata {
  const url = sectionUrl(page.section, page.path);
  const imageUrl = page.ogImagePath
    ? sectionUrl(page.section, page.ogImagePath)
    : DEFAULT_OG_IMAGE_URL();

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, ...OG_IMAGE_SIZE }],
      ...(page.publishedTime
        ? { type: "article", publishedTime: page.publishedTime }
        : { type: "website" }),
    },
    twitter: { card: "summary_large_image" },
  };
}
