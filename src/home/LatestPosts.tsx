import { posts } from "#site/content";
import { PostList } from "@/blog/PostList";
import { latestPosts } from "@/blog/post-queries";
import { sectionUrl } from "@/routing/site-urls";
import { MoreLink } from "@/ui/MoreLink";
import { PageSection } from "@/ui/PageSection";

export function LatestPosts() {
  return (
    <PageSection id="latest-writing" title="Latest writing">
      <PostList
        posts={latestPosts(posts)}
        hrefFor={(slug) => sectionUrl("blog", `/${slug}`)}
      />
      <MoreLink href={sectionUrl("blog")}>
        All posts on blogs.moinb.dev →
      </MoreLink>
    </PageSection>
  );
}
