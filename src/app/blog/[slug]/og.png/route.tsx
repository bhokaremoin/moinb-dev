import { notFound } from "next/navigation";

import { posts } from "#site/content";
import { formatLongDate } from "@/content/format-date";
import { renderOgCard } from "@/seo/og-card";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/blog/[slug]/og.png">,
) {
  const { slug } = await params;
  const post = posts.find((candidate) => candidate.slug === slug);
  if (!post) {
    notFound();
  }
  return renderOgCard({
    eyebrow: `${post.til ? "TIL" : "Blog"} · ${formatLongDate(post.date)}`,
    title: post.title,
    summary: post.summary,
  });
}
