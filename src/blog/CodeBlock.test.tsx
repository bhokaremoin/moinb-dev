import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("copies the code, not the filename", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    render(
      <CodeBlock data-rehype-pretty-code-figure="">
        <figcaption>server/expense.ts</figcaption>
        <pre>
          <code>const total = 1;</code>
        </pre>
      </CodeBlock>,
    );

    await act(async () =>
      screen.getByRole("button", { name: "Copy code" }).click(),
    );

    expect(writeText).toHaveBeenCalledWith("const total = 1;");
  });
});
