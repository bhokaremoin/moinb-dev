import { sortByDateDescending } from "@/content/sort-by-date";

type ProjectSummary = {
  slug: string;
  date: string;
  type: string;
  featured: boolean;
  caseStudy: boolean;
  liveUrl?: string;
  repoUrl?: string;
};

export type ProjectLink =
  | { kind: "case-study"; path: string; label: string }
  | { kind: "external"; href: string; label: string };

const FEATURED_LIMIT = 3;

export function sortProjectsByDate<T extends ProjectSummary>(
  projects: T[],
): T[] {
  return sortByDateDescending(projects);
}

export function featuredProjects<T extends ProjectSummary>(
  projects: T[],
  limit = FEATURED_LIMIT,
): T[] {
  return sortProjectsByDate(
    projects.filter((project) => project.featured),
  ).slice(0, limit);
}

export function projectTypes(projects: { type: string }[]): string[] {
  return [...new Set(projects.map((project) => project.type))];
}

export function caseStudies<T extends ProjectSummary>(projects: T[]): T[] {
  return sortProjectsByDate(projects.filter((project) => project.caseStudy));
}

/** Where a project in a list should link: its case study, else its live site, else its source. */
export function projectLink(project: ProjectSummary): ProjectLink | undefined {
  if (project.caseStudy) {
    return {
      kind: "case-study",
      path: `/${project.slug}`,
      label: "Case study",
    };
  }
  if (project.liveUrl) {
    return { kind: "external", href: project.liveUrl, label: "Live site" };
  }
  if (project.repoUrl) {
    return { kind: "external", href: project.repoUrl, label: "GitHub" };
  }
  return undefined;
}
