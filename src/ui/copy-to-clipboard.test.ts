import { afterEach, describe, expect, it, vi } from "vitest";

import { copyToClipboard } from "./copy-to-clipboard";

function stubClipboard(clipboard: Partial<Clipboard> | undefined) {
  vi.stubGlobal("navigator", { ...navigator, clipboard });
}

describe("copyToClipboard", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("writes the text and reports success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText });

    await expect(copyToClipboard("hello@moinb.dev")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello@moinb.dev");
  });

  it("reports failure when the clipboard api is unavailable", async () => {
    stubClipboard(undefined);

    await expect(copyToClipboard("x")).resolves.toBe(false);
  });

  it("reports failure instead of throwing when permission is denied", async () => {
    stubClipboard({
      writeText: vi.fn().mockRejectedValue(new Error("denied")),
    });

    await expect(copyToClipboard("x")).resolves.toBe(false);
  });
});
