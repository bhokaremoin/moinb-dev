import { describe, expect, it } from "vitest";

import { buildCommandItems } from "./command-items";

const items = buildCommandItems({
  projects: [
    { slug: "ledgerly", title: "Ledgerly", caseStudy: true },
    { slug: "dotfiles", title: "dotfiles", caseStudy: false },
  ],
  posts: [{ slug: "rest-to-trpc", title: "Why I moved to tRPC" }],
});

describe("buildCommandItems", () => {
  it("offers every page, case study and post as a destination", () => {
    const destinations = items
      .filter((item) => item.action.kind === "navigate")
      .map((item) => item.label);

    expect(destinations).toEqual([
      "Home",
      "Projects",
      "Blog",
      "What I'm doing now",
      "My setup",
      "Ledgerly",
      "Why I moved to tRPC",
    ]);
  });

  it("does not link archive-only projects, which have no page", () => {
    expect(items.map((item) => item.label)).not.toContain("dotfiles");
  });

  it("points each destination at its section and path", () => {
    expect(items.find((item) => item.label === "Ledgerly")?.action).toEqual({
      kind: "navigate",
      section: "projects",
      path: "/ledgerly",
    });
  });

  it("includes the theme toggle and copy email actions", () => {
    expect(
      items
        .filter((item) => item.group === "Actions")
        .map((item) => item.action.kind),
    ).toEqual(["toggle-theme", "copy-email"]);
  });
});
