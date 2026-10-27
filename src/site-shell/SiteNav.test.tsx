import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteNav } from "./SiteNav";

describe("SiteNav", () => {
  it("marks the current section's link as the current page", () => {
    render(<SiteNav section="projects" />);

    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Blog" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("links to other sections on their own subdomain", () => {
    render(<SiteNav section="projects" />);

    expect(
      screen.getByRole("link", { name: "moinb.dev home" }),
    ).toHaveAttribute("href", "https://moinb.dev/");
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "https://blogs.moinb.dev/",
    );
  });

  it("links every section absolutely when there is no current section", () => {
    render(<SiteNav section={undefined} />);

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "https://moinb.dev/#about",
    );
    expect(screen.getByRole("link", { name: "Projects" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("links within the current section by path", () => {
    render(<SiteNav section="projects" />);

    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("names the command menu button without relying on its shortcut glyph", () => {
    render(<SiteNav section="home" />);

    expect(
      screen.getByRole("button", { name: "Open command menu" }),
    ).not.toHaveAttribute("aria-label");
  });

  it("offers the command menu and the theme toggle", () => {
    render(<SiteNav section="home" />);

    expect(
      screen.getByRole("button", { name: "Open command menu" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Toggle dark mode" }),
    ).toBeInTheDocument();
  });
});
