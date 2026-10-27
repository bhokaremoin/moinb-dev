import { posts } from "#site/content";
import { PostList } from "@/blog/PostList";
import { latestPosts } from "@/blog/post-queries";
import { sectionHref } from "@/routing/site-urls";
import { MoreLink } from "@/ui/MoreLink";
import { PageSection } from "@/ui/PageSection";

export function LatestPosts() {
  return (
    <PageSection id="latest-writing" title="Latest writing">
      <PostList
        posts={latestPosts(posts).map((post) => ({
          ...post,
          href: sectionHref("blog", "home", `/${post.slug}`),
        }))}
      />
      <MoreLink href={sectionHref("blog", "home")}>
        All posts on blogs.moinb.dev →
      </MoreLink>
    </PageSection>
  );
}
