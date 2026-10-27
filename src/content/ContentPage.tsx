import type { Metadata } from "next";

import { pages } from "#site/content";
import { pageMetadata } from "@/seo/page-metadata";

import { MdxContent } from "./MdxContent";

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function findPage(slug: string) {
  const page = pages.find((candidate) => candidate.slug === slug);
  if (!page) {
    throw new Error(`Missing content/pages/${slug}.mdx`);
  }
  return page;
}

export function contentPageMetadata(slug: string): Metadata {
  const page = findPage(slug);
  return pageMetadata({
    section: "home",
    path: `/${slug}`,
    title: page.title,
    description: page.description,
  });
}

/** A standalone MDX page from content/pages, such as /now or /uses. */
export function ContentPage({ slug }: { slug: string }) {
  const page = findPage(slug);

  return (
    <article>
      <p className="eyebrow">
        /{slug} · updated {MONTH_YEAR.format(new Date(page.updated))}
      </p>
      <h1 className="text-[clamp(1.9rem,5vw,2.6rem)] tracking-[-0.015em]">
        {page.title}
      </h1>
      <div className="article-prose">
        <MdxContent code={page.content} />
      </div>
    </article>
  );
}
