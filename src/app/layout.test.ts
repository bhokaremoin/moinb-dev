import { describe, expect, it, vi } from "vitest";

import { metadata } from "./layout";

// next/font/google only works inside Next's compiler, so stub the font loaders.
vi.mock("next/font/google", () => ({
  Bricolage_Grotesque: () => ({ variable: "" }),
  IBM_Plex_Sans: () => ({ variable: "" }),
  JetBrains_Mono: () => ({ variable: "" }),
}));

describe("site metadata", () => {
  it("uses the domain as the page title", () => {
    expect(metadata.title).toBe("moinb.dev");
  });

  it("describes the site as a portfolio", () => {
    expect(metadata.description).toMatch(/portfolio/i);
  });
});
