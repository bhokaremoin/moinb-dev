import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

function renderHome() {
  render(<HomePage />);
}

describe("HomePage", () => {
  it("leads with the availability status and the headline", () => {
    renderHome();

    expect(
      screen.getByText(/Open to full-stack roles · Pune/),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "I build web products end to end, from database to pixel.",
    );
  });

  it("offers work, résumé and contact calls to action", () => {
    renderHome();

    expect(screen.getByRole("link", { name: /See my work/ })).toHaveAttribute(
      "href",
      "https://projects.moinb.dev/",
    );
    expect(screen.getByRole("link", { name: "Résumé (PDF)" })).toHaveAttribute(
      "href",
      "/resume.pdf",
    );
    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("shows sections in the agreed order", () => {
    renderHome();

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(headings).toEqual([
      "Experience",
      "Featured projects",
      "Latest writing",
      "Let's work together",
    ]);
  });

  it("lists experience with impact and tech tags", () => {
    renderHome();

    const experience = screen.getByRole("region", { name: "Experience" });
    expect(
      within(experience).getByText("Software Engineer · Acme Fintech"),
    ).toBeInTheDocument();
    expect(
      within(experience)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toContain("PostgreSQL");
  });

  it("features three projects linking to their case studies", () => {
    renderHome();

    const featured = screen.getByRole("region", { name: "Featured projects" });
    const cards = within(featured).getAllByRole("article");
    expect(cards).toHaveLength(3);
    expect(
      within(featured).getByRole("link", { name: /Ledgerly/ }),
    ).toHaveAttribute("href", "https://projects.moinb.dev/ledgerly");
    expect(
      within(featured).getByRole("link", {
        name: /All projects on projects.moinb.dev/,
      }),
    ).toHaveAttribute("href", "https://projects.moinb.dev/");
  });

  it("shows the three latest posts linking to the blog", () => {
    renderHome();

    const writing = screen.getByRole("region", { name: "Latest writing" });
    const postLinks = within(writing)
      .getAllByRole("link")
      .filter(
        (link) =>
          link.getAttribute("href")?.startsWith("https://blogs.moinb.dev/") &&
          link.textContent !== "All posts on blogs.moinb.dev →",
      );
    expect(postLinks).toHaveLength(3);
    expect(postLinks[0]).toHaveAttribute(
      "href",
      "https://blogs.moinb.dev/rest-to-trpc",
    );
  });

  it("ends with a contact box that can copy the email", () => {
    renderHome();

    const contact = screen.getByRole("region", { name: "Let's work together" });
    expect(within(contact).getByText("hello@moinb.dev")).toBeInTheDocument();
    expect(
      within(contact).getByRole("button", { name: "Copy email" }),
    ).toBeInTheDocument();
  });
});
