import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectArchive } from "./ProjectArchive";

function archiveProject(
  overrides: Partial<Parameters<typeof ProjectArchive>[0]["projects"][number]>,
) {
  return {
    slug: "x",
    title: "X",
    date: "2025-01-01T00:00:00.000Z",
    type: "Full-stack",
    stack: ["Next.js", "tRPC"],
    featured: false,
    caseStudy: true,
    ...overrides,
  };
}

describe("ProjectArchive", () => {
  it("lists year, project, stack and a link for each project, newest first", () => {
    render(
      <ProjectArchive
        projects={[
          archiveProject({
            slug: "old",
            title: "Old",
            date: "2023-03-01T00:00:00.000Z",
            caseStudy: false,
            repoUrl: "https://github.com/x/old",
          }),
          archiveProject({ slug: "ledgerly", title: "Ledgerly" }),
        ]}
      />,
    );

    const [, firstRow, secondRow] = screen.getAllByRole("row");
    expect(
      within(firstRow)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    ).toEqual(["2025", "Ledgerly", "Next.js, tRPC", "Case study"]);
    expect(within(firstRow).getByRole("link")).toHaveAttribute(
      "href",
      "/ledgerly",
    );
    expect(
      within(secondRow).getByRole("link", { name: "GitHub" }),
    ).toHaveAttribute("href", "https://github.com/x/old");
  });

  it("shows no link for a project with nowhere to go", () => {
    render(
      <ProjectArchive projects={[archiveProject({ caseStudy: false })]} />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
