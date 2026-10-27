import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PostFilters } from "./PostFilters";

function post(slug: string, date: string, tags: string[], til = false) {
  return {
    slug,
    title: slug,
    date: `${date}T00:00:00.000Z`,
    tags,
    til,
    readingMinutes: 3,
    href: `/${slug}`,
  };
}

const posts = [
  post("trpc", "2026-10-12", ["nextjs"]),
  post("partial-indexes", "2026-09-03", ["postgres"], true),
  post("three-years", "2025-12-19", ["career"]),
];

function visibleTitles() {
  return screen.getAllByRole("listitem").map((item) => item.textContent);
}

describe("PostFilters", () => {
  it("groups every post under its year by default", () => {
    render(<PostFilters posts={posts} />);

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["2026", "2025"]);
    expect(visibleTitles()).toHaveLength(3);
  });

  it("offers All, Posts, TIL and one chip per tag", () => {
    render(<PostFilters posts={posts} />);

    expect(
      screen.getAllByRole("button").map((chip) => chip.textContent),
    ).toEqual(["All", "Posts", "TIL", "career", "nextjs", "postgres"]);
  });

  it("shows only short notes under TIL", async () => {
    render(<PostFilters posts={posts} />);

    await userEvent.click(screen.getByRole("button", { name: "TIL" }));

    expect(visibleTitles()).toEqual([
      expect.stringContaining("partial-indexes"),
    ]);
  });

  it("leaves short notes out under Posts", async () => {
    render(<PostFilters posts={posts} />);

    await userEvent.click(screen.getByRole("button", { name: "Posts" }));

    expect(visibleTitles()).toHaveLength(2);
    expect(screen.queryByText("partial-indexes")).not.toBeInTheDocument();
  });

  it("filters by tag and drops years with no matches", async () => {
    render(<PostFilters posts={posts} />);

    await userEvent.click(screen.getByRole("button", { name: "career" }));

    expect(visibleTitles()).toEqual([expect.stringContaining("three-years")]);
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["2025"]);
  });
});
