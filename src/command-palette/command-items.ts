import type { Section } from "@/routing/site-urls";

export type CommandAction =
  | { kind: "navigate"; section: Section; path: string }
  | { kind: "toggle-theme" }
  | { kind: "copy-email" };

export type CommandItem = {
  id: string;
  label: string;
  hint: string;
  group: "Pages" | "Projects" | "Posts" | "Actions";
  action: CommandAction;
};

const PAGES: CommandItem[] = [
  {
    id: "page-home",
    label: "Home",
    hint: "moinb.dev",
    group: "Pages",
    action: { kind: "navigate", section: "home", path: "/" },
  },
  {
    id: "page-projects",
    label: "Projects",
    hint: "projects.moinb.dev",
    group: "Pages",
    action: { kind: "navigate", section: "projects", path: "/" },
  },
  {
    id: "page-blog",
    label: "Blog",
    hint: "blogs.moinb.dev",
    group: "Pages",
    action: { kind: "navigate", section: "blog", path: "/" },
  },
  {
    id: "page-now",
    label: "What I'm doing now",
    hint: "/now",
    group: "Pages",
    action: { kind: "navigate", section: "home", path: "/now" },
  },
  {
    id: "page-uses",
    label: "My setup",
    hint: "/uses",
    group: "Pages",
    action: { kind: "navigate", section: "home", path: "/uses" },
  },
];

const ACTIONS: CommandItem[] = [
  {
    id: "action-theme",
    label: "Toggle theme",
    hint: "action",
    group: "Actions",
    action: { kind: "toggle-theme" },
  },
  {
    id: "action-email",
    label: "Copy email",
    hint: "action",
    group: "Actions",
    action: { kind: "copy-email" },
  },
];

/** Plain, serialisable items so the server can build them and pass them to the client palette. */
export function buildCommandItems(content: {
  projects: { slug: string; title: string; caseStudy: boolean }[];
  posts: { slug: string; title: string }[];
}): CommandItem[] {
  const projectItems: CommandItem[] = content.projects
    .filter((project) => project.caseStudy)
    .map((project) => ({
      id: `project-${project.slug}`,
      label: project.title,
      hint: "case study",
      group: "Projects",
      action: {
        kind: "navigate",
        section: "projects",
        path: `/${project.slug}`,
      },
    }));

  const postItems: CommandItem[] = content.posts.map((post) => ({
    id: `post-${post.slug}`,
    label: post.title,
    hint: "post",
    group: "Posts",
    action: { kind: "navigate", section: "blog", path: `/${post.slug}` },
  }));

  return [...PAGES, ...projectItems, ...postItems, ...ACTIONS];
}
