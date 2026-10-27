import { describe, expect, it } from "vitest";

import { createGiscusConfig } from "./giscus-config";

const complete = {
  repo: "bhokaremoin/moinb-dev",
  repoId: "R_1",
  category: "Comments",
  categoryId: "DIC_1",
};

describe("createGiscusConfig", () => {
  it("enables comments when every setting is present", () => {
    expect(createGiscusConfig(complete)).toEqual(complete);
  });

  it("keeps comments off when any setting is missing", () => {
    expect(
      createGiscusConfig({ ...complete, categoryId: undefined }),
    ).toBeUndefined();
    expect(createGiscusConfig({ ...complete, repo: "" })).toBeUndefined();
  });

  it("rejects a repo that is not owner/name", () => {
    expect(
      createGiscusConfig({ ...complete, repo: "moinb-dev" }),
    ).toBeUndefined();
  });
});
