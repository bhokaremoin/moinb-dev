import { posts } from "#site/content";
import { PostFilters } from "@/blog/PostFilters";
import { sortPostsByDate } from "@/blog/post-queries";
import { sectionPath } from "@/routing/site-urls";
import { PageIntro } from "@/ui/PageIntro";

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
      <PageIntro
        eyebrow="Blog"
        title="Writing"
        intro="Notes on building for the web: debugging stories, architecture decisions and short TILs."
      />
      <PostFilters posts={listedPosts} />
    </>
  );
}
