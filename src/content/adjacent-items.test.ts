import { describe, expect, it } from "vitest";

import { adjacentItems } from "./adjacent-items";

const items = [{ slug: "a" }, { slug: "b" }, { slug: "c" }];

describe("adjacentItems", () => {
  it("returns both neighbours for an item in the middle", () => {
    expect(adjacentItems(items, "b")).toEqual({
      previous: { slug: "a" },
      next: { slug: "c" },
    });
  });

  it("has no previous item at the start of the list", () => {
    expect(adjacentItems(items, "a")).toEqual({
      previous: undefined,
      next: { slug: "b" },
    });
  });

  it("has no next item at the end of the list", () => {
    expect(adjacentItems(items, "c")).toEqual({
      previous: { slug: "b" },
      next: undefined,
    });
  });

  it("returns no neighbours for an unknown slug", () => {
    expect(adjacentItems(items, "missing")).toEqual({
      previous: undefined,
      next: undefined,
    });
  });
});
