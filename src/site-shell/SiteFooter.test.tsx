import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("shows the copyright year and the built-with note", () => {
    render(<SiteFooter section="home" year={2026} />);

    expect(screen.getByText(/© 2026 Moin B/)).toHaveTextContent(
      "Built with Next.js",
    );
  });

  it("links to now, uses, the rss feed and github", () => {
    render(<SiteFooter section="blog" year={2026} />);

    expect(screen.getByRole("link", { name: "/now" })).toHaveAttribute(
      "href",
      "https://moinb.dev/now",
    );
    expect(screen.getByRole("link", { name: "/uses" })).toHaveAttribute(
      "href",
      "https://moinb.dev/uses",
    );
    expect(screen.getByRole("link", { name: "RSS" })).toHaveAttribute(
      "href",
      "/rss.xml",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/bhokaremoin",
    );
  });
});
