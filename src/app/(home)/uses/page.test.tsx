import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import UsesPage from "./page";

describe("UsesPage", () => {
  it("lists my setup", () => {
    render(<UsesPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "My setup" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ghostty/)).toBeInTheDocument();
  });
});
