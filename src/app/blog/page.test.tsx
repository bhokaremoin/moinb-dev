import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BlogPage from "./page";

describe("BlogPage", () => {
  it("introduces the writing and groups posts by year", () => {
    render(<BlogPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Writing" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["2026", "2025"]);
  });

  it("links posts within the blog host and marks TIL notes", () => {
    render(<BlogPage />);

    expect(
      screen.getByRole("link", { name: /Why I moved my side projects/ }),
    ).toHaveAttribute("href", "/rest-to-trpc");
    expect(
      screen.getByRole("link", { name: /Postgres partial indexes/ }),
    ).toHaveTextContent("TIL");
  });
});
