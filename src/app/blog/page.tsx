import type { Metadata } from "next";

import { posts } from "#site/content";
import { PostFilters } from "@/blog/PostFilters";
import { sortPostsByDate } from "@/blog/post-queries";
import { sectionPath } from "@/routing/site-urls";
import { PageIntro } from "@/ui/PageIntro";

import { pageMetadata } from "@/seo/page-metadata";
import { sectionUrl } from "@/routing/site-urls";

const INTRO =
  "Notes on building for the web: debugging stories, architecture decisions and short TILs.";

const blogMetadata = pageMetadata({
  section: "blog",
  path: "/",
  title: "Writing",
  description: INTRO,
});

export const metadata: Metadata = {
  ...blogMetadata,
  alternates: {
    ...blogMetadata.alternates,
    types: { "application/rss+xml": sectionUrl("blog", "/rss.xml") },
  },
};

export default function BlogPage() {
  const listedPosts = sortPostsByDate(posts).map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    til: post.til,
    readingMinutes: post.readingMinutes,
    href: sectionPath("blog", `/${post.slug}`),
  }));

  return (
    <>
      <PageIntro eyebrow="Blog" title="Writing" intro={INTRO} />
      <PostFilters posts={listedPosts} />
    </>
  );
}
