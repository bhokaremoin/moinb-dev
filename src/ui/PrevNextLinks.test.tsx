import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PrevNextLinks } from "./PrevNextLinks";

describe("PrevNextLinks", () => {
  it("links to both neighbours with their labels", () => {
    render(
      <PrevNextLinks
        previous={{ label: "Previous", title: "Queueless", href: "/queueless" }}
        next={{ label: "Next", title: "Shipnote", href: "/shipnote" }}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Previous Queueless" }),
    ).toHaveAttribute("href", "/queueless");
    expect(screen.getByRole("link", { name: "Next Shipnote" })).toHaveAttribute(
      "href",
      "/shipnote",
    );
  });

  it("leaves out a missing side", () => {
    render(
      <PrevNextLinks
        next={{ label: "Next", title: "Shipnote", href: "/shipnote" }}
      />,
    );

    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders nothing without neighbours", () => {
    const { container } = render(<PrevNextLinks />);

    expect(container).toBeEmptyDOMElement();
  });
});
