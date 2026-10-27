import { notFound } from "next/navigation";

import { posts } from "#site/content";
import { CodeBlock } from "@/blog/CodeBlock";
import { GiscusComments } from "@/blog/GiscusComments";
import { sortPostsByDate } from "@/blog/post-queries";
import { TableOfContents } from "@/blog/TableOfContents";
import { adjacentItems } from "@/content/adjacent-items";
import { formatLongDate } from "@/content/format-date";
import { MdxContent } from "@/content/MdxContent";
import { sectionPath } from "@/routing/site-urls";
import { BackLink } from "@/ui/BackLink";
import { PrevNextLinks } from "@/ui/PrevNextLinks";

function isCodeFigure(props: React.ComponentProps<"figure">): boolean {
  return "data-rehype-pretty-code-figure" in props;
}

function Figure(props: React.ComponentProps<"figure">) {
  return isCodeFigure(props) ? <CodeBlock {...props} /> : <figure {...props} />;
}

// Every real slug is prerendered by generateStaticParams; only unknown slugs reach the
// request-time fallback, which renders a 404, so blocking on params there is fine.
export const instant = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const sortedPosts = sortPostsByDate(posts);
  const post = sortedPosts.find((candidate) => candidate.slug === slug);
  if (!post) {
    notFound();
  }

  // Posts are sorted newest first, so the "previous" neighbour is the newer post.
  const { previous: newer, next: older } = adjacentItems(sortedPosts, slug);
  const postLink = (
    label: string,
    neighbour: { slug: string; title: string },
  ) => ({
    label,
    title: neighbour.title,
    href: sectionPath("blog", `/${neighbour.slug}`),
  });

  return (
    <article>
      <BackLink href={sectionPath("blog")}>← All posts</BackLink>
      <h1 className="mt-4 text-[clamp(1.9rem,5vw,2.6rem)] tracking-[-0.015em]">
        {post.title}
      </h1>
      <div className="text-muted mt-3.5 flex flex-wrap gap-x-[18px] gap-y-2 font-mono text-[0.8rem]">
        <time dateTime={post.date}>{formatLongDate(post.date)}</time>
        <span>{post.readingMinutes} min read</span>
        {post.tags.length > 0 && (
          <span>{post.tags.map((tag) => `#${tag}`).join(" ")}</span>
        )}
      </div>
      <TableOfContents entries={post.toc} />
      <div className="article-prose">
        <MdxContent code={post.content} components={{ figure: Figure }} />
      </div>
      <PrevNextLinks
        previous={older && postLink("Older", older)}
        next={newer && postLink("Newer", newer)}
      />
      <GiscusComments />
    </article>
  );
}
