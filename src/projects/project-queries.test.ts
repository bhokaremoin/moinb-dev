import { describe, expect, it } from "vitest";

import {
  caseStudies,
  featuredProjects,
  projectLink,
  projectTypes,
  sortProjectsByDate,
} from "./project-queries";

function project(
  overrides: Partial<Parameters<typeof projectLink>[0]> & { slug: string },
) {
  return {
    date: "2025-01-01T00:00:00.000Z",
    type: "Full-stack",
    featured: false,
    caseStudy: true,
    liveUrl: undefined,
    repoUrl: undefined,
    ...overrides,
  };
}

describe("sortProjectsByDate", () => {
  it("puts the newest project first", () => {
    const sorted = sortProjectsByDate([
      project({ slug: "old", date: "2023-05-01T00:00:00.000Z" }),
      project({ slug: "new", date: "2025-05-01T00:00:00.000Z" }),
    ]);

    expect(sorted.map((p) => p.slug)).toEqual(["new", "old"]);
  });
});

describe("featuredProjects", () => {
  it("returns at most three featured projects, newest first", () => {
    const projects = [1, 2, 3, 4].map((n) =>
      project({
        slug: `p${n}`,
        featured: true,
        date: `202${n}-01-01T00:00:00.000Z`,
      }),
    );

    expect(featuredProjects(projects).map((p) => p.slug)).toEqual([
      "p4",
      "p3",
      "p2",
    ]);
  });

  it("skips projects that are not featured", () => {
    expect(featuredProjects([project({ slug: "plain" })])).toEqual([]);
  });
});

describe("projectTypes", () => {
  it("lists each type once in the order first seen", () => {
    const types = projectTypes([
      project({ slug: "a", type: "Client" }),
      project({ slug: "b", type: "Open source" }),
      project({ slug: "c", type: "Client" }),
    ]);

    expect(types).toEqual(["Client", "Open source"]);
  });
});

describe("caseStudies", () => {
  it("keeps only projects with a written case study", () => {
    const studies = caseStudies([
      project({ slug: "study" }),
      project({ slug: "archive-only", caseStudy: false }),
    ]);

    expect(studies.map((p) => p.slug)).toEqual(["study"]);
  });
});

describe("projectLink", () => {
  it("links to the case study when there is one", () => {
    expect(
      projectLink(
        project({ slug: "ledgerly", repoUrl: "https://github.com/x" }),
      ),
    ).toEqual({
      kind: "case-study",
      path: "/ledgerly",
      label: "Case study",
    });
  });

  it("falls back to the live site, then the source code", () => {
    expect(
      projectLink(
        project({
          slug: "a",
          caseStudy: false,
          liveUrl: "https://a.dev",
          repoUrl: "https://github.com/a",
        }),
      ),
    ).toEqual({ kind: "external", href: "https://a.dev", label: "Live site" });
    expect(
      projectLink(
        project({
          slug: "b",
          caseStudy: false,
          repoUrl: "https://github.com/b",
        }),
      ),
    ).toEqual({
      kind: "external",
      href: "https://github.com/b",
      label: "GitHub",
    });
  });

  it("has no link for an archive-only project without urls", () => {
    expect(
      projectLink(project({ slug: "c", caseStudy: false })),
    ).toBeUndefined();
  });
});
