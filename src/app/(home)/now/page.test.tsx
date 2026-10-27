import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NowPage from "./page";

describe("NowPage", () => {
  it("says what I'm doing now and when it was updated", () => {
    render(<NowPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "What I'm doing now" }),
    ).toBeInTheDocument();
    expect(screen.getByText("/now · updated Oct 2026")).toBeInTheDocument();
    expect(
      screen.getByText("Interviewing for full-stack roles."),
    ).toBeInTheDocument();
  });
});
