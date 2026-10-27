import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyButton } from "./CopyButton";

describe("CopyButton", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("confirms the copy, then returns to its label", async () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<CopyButton text="hello@moinb.dev" label="Copy email" />);

    await act(async () => screen.getByRole("button").click());
    expect(screen.getByRole("button")).toHaveTextContent("Copied");

    await act(async () => vi.advanceTimersByTime(1500));
    expect(screen.getByRole("button")).toHaveTextContent("Copy email");
  });

  it("says so when copying is not possible", async () => {
    vi.stubGlobal("navigator", { ...navigator, clipboard: undefined });
    render(<CopyButton text="x" label="Copy" />);

    await act(async () => screen.getByRole("button").click());

    expect(screen.getByRole("button")).toHaveTextContent("Copy failed");
  });
});
