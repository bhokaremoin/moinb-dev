import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NotFoundContent } from "./not-found";

describe("not-found page", () => {
  it("says the page is missing and offers a way back to each section", () => {
    render(<NotFoundContent />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "https://moinb.dev/",
    );
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "https://projects.moinb.dev/",
    );
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "https://blogs.moinb.dev/",
    );
  });
});
