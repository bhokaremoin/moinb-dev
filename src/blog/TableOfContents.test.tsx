import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TableOfContents } from "./TableOfContents";

describe("TableOfContents", () => {
  it("links to each section, nesting sub-sections", () => {
    render(
      <TableOfContents
        entries={[
          {
            title: "Problem",
            url: "#problem",
            items: [{ title: "Detail", url: "#detail", items: [] }],
          },
          { title: "Fix", url: "#fix", items: [] },
        ]}
      />,
    );

    const toc = screen.getByRole("navigation", { name: "On this page" });
    expect(within(toc).getByRole("link", { name: "Problem" })).toHaveAttribute(
      "href",
      "#problem",
    );
    expect(
      within(toc).getByRole("link", { name: "Detail" }).closest("ol"),
    ).not.toBe(
      within(toc).getByRole("link", { name: "Problem" }).closest("ol"),
    );
  });

  it("renders nothing for a post without headings", () => {
    const { container } = render(<TableOfContents entries={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
