import { describe, expect, it } from "vitest";

import {
  groupPostsByYear,
  latestPosts,
  postTags,
  sortPostsByDate,
} from "./post-queries";

function post(slug: string, date: string, tags: string[] = []) {
  return { slug, date: `${date}T00:00:00.000Z`, tags };
}

const posts = [
  post("dec-2025", "2025-12-19", ["career"]),
  post("oct-2026", "2026-10-12", ["nextjs", "typescript"]),
  post("sep-2026", "2026-09-28", ["nextjs"]),
];

describe("sortPostsByDate", () => {
  it("puts the newest post first", () => {
    expect(sortPostsByDate(posts).map((p) => p.slug)).toEqual([
      "oct-2026",
      "sep-2026",
      "dec-2025",
    ]);
  });
});

describe("groupPostsByYear", () => {
  it("groups posts under their year, newest year and post first", () => {
    const groups = groupPostsByYear(posts);

    expect(groups.map((group) => group.year)).toEqual([2026, 2025]);
    expect(groups[0].posts.map((p) => p.slug)).toEqual([
      "oct-2026",
      "sep-2026",
    ]);
  });
});

describe("postTags", () => {
  it("lists each tag once, most used first", () => {
    expect(postTags(posts)).toEqual(["nextjs", "career", "typescript"]);
  });
});

describe("latestPosts", () => {
  it("returns the newest posts up to the limit", () => {
    expect(latestPosts(posts, 2).map((p) => p.slug)).toEqual([
      "oct-2026",
      "sep-2026",
    ]);
  });
});
