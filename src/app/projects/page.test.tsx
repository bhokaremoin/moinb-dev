import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectsPage, { metadata } from "./page";

describe("ProjectsPage", () => {
  it("introduces the projects", () => {
    render(<ProjectsPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Things I've built" }),
    ).toBeInTheDocument();
  });

  it("shows a card for every case study, linking within the projects host", () => {
    render(<ProjectsPage />);

    expect(screen.getByRole("link", { name: /Ledgerly/ })).toHaveAttribute(
      "href",
      "/ledgerly",
    );
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("keeps headings in order for screen readers, with case studies under their own heading", () => {
    render(<ProjectsPage />);

    expect(
      screen.getAllByRole("heading").map((heading) => heading.tagName),
    ).toEqual(["H1", "H2", "H3", "H3", "H3", "H2"]);
  });

  it("has an archive covering every project", () => {
    render(<ProjectsPage />);

    expect(screen.getByRole("table")).toHaveTextContent("dotfiles");
  });
});

describe("projects index metadata", () => {
  it("is canonical on the projects host", () => {
    expect(metadata.alternates?.canonical).toBe("https://projects.moinb.dev/");
  });
});
