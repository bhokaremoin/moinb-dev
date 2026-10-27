import { writeFile } from "node:fs/promises";

import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";

/** `projects/ledgerly` → `ledgerly`: slugs are public paths within their section. */
function slugFromPath(path: string): string {
  return path.split("/").slice(1).join("/");
}

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(60),
      tagline: s.string().max(80).optional(),
      summary: s.string().max(160),
      date: s.isodate(),
      type: s.string(),
      stack: s.array(s.string()).min(1),
      role: s.string(),
      timeline: s.string(),
      users: s.string(),
      liveUrl: s.string().url().optional(),
      repoUrl: s.string().url().optional(),
      featured: s.boolean().default(false),
      caseStudy: s.boolean().default(true),
      metrics: s
        .array(s.object({ value: s.string(), label: s.string() }))
        .default([]),
      architecture: s.array(s.string()).default([]),
      path: s.path(),
      content: s.mdx(),
    })
    .transform(({ path, ...project }) => ({
      ...project,
      slug: slugFromPath(path),
    })),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(100),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      til: s.boolean().default(false),
      summary: s.string().max(200),
      path: s.path(),
      toc: s.toc(),
      metadata: s.metadata(),
      content: s.mdx(),
    })
    .transform(({ path, metadata, ...post }) => ({
      ...post,
      slug: slugFromPath(path),
      readingMinutes: Math.max(1, Math.round(metadata.readingTime)),
    })),
});

const pages = defineCollection({
  name: "Page",
  pattern: "pages/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      description: s.string(),
      updated: s.isodate(),
      path: s.path(),
      content: s.mdx(),
    })
    .transform(({ path, ...page }) => ({
      ...page,
      slug: slugFromPath(path),
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { projects, posts, pages },
  // A tiny slug list for the proxy, so it can 404 unknown slugs without bundling all content.
  complete: async ({ projects, posts }) => {
    const publishedSlugs = {
      projects: projects
        .filter((project) => project.caseStudy)
        .map((project) => project.slug),
      blog: posts.map((post) => post.slug),
    };
    await writeFile(
      ".velite/published-slugs.json",
      JSON.stringify(publishedSlugs, null, 2),
    );
  },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // Both themes are emitted as CSS variables; globals.css picks one per data-theme.
          theme: { light: "github-light-default", dark: "github-dark-default" },
          keepBackground: false,
        },
      ],
    ],
  },
});
