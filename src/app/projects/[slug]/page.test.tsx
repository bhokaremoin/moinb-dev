import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CaseStudyPage, { generateStaticParams } from "./page";

async function renderCaseStudy(slug: string) {
  render(
    await CaseStudyPage({
      params: Promise.resolve({ slug }),
      searchParams: Promise.resolve({}),
    }),
  );
}

describe("CaseStudyPage", () => {
  it("prerenders every case study but not archive-only projects", async () => {
    const slugs = (await generateStaticParams()).map((params) => params.slug);

    expect(slugs).toEqual(
      expect.arrayContaining(["ledgerly", "shipnote", "queueless"]),
    );
    expect(slugs).not.toContain("dotfiles");
  });

  it("opens with a back link, the title and the summary", async () => {
    await renderCaseStudy("ledgerly");

    expect(
      screen.getByRole("link", { name: "← All projects" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Ledgerly: splitting rent without the spreadsheet",
    );
  });

  it("offers live and source links only when they exist", async () => {
    await renderCaseStudy("ledgerly");
    expect(
      screen.getByRole("link", { name: "Live site ↗" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Source code ↗" }),
    ).toBeInTheDocument();
  });

  it("hides the live link for a project without a live site", async () => {
    await renderCaseStudy("shipnote");

    expect(
      screen.queryByRole("link", { name: "Live site ↗" }),
    ).not.toBeInTheDocument();
  });

  it("lists role, timeline, stack and users as facts", async () => {
    await renderCaseStudy("ledgerly");

    const facts = screen.getByText("Role").closest("dl")!;
    expect(
      within(facts)
        .getAllByRole("term")
        .map((term) => term.textContent),
    ).toEqual(["Role", "Timeline", "Stack", "Users"]);
    expect(facts).toHaveTextContent("Next.js, tRPC, Postgres");
  });

  it("follows the case-study template", async () => {
    await renderCaseStudy("ledgerly");

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual([
      "The problem",
      "Constraints",
      "Architecture",
      "Key decisions",
      "Results",
      "What I'd do differently",
    ]);
  });

  it("draws the architecture and the result metrics", async () => {
    await renderCaseStudy("ledgerly");

    expect(
      screen.getByRole("list", { name: "Architecture" }),
    ).toHaveTextContent("tRPC API");
    expect(screen.getByText("0.9s")).toBeInTheDocument();
    expect(screen.getByText("load on 3G")).toBeInTheDocument();
  });

  it("links to the neighbouring case studies", async () => {
    await renderCaseStudy("shipnote");

    expect(
      screen.getByRole("link", { name: "Previous Ledgerly" }),
    ).toHaveAttribute("href", "/ledgerly");
    expect(
      screen.getByRole("link", { name: "Next Queueless" }),
    ).toHaveAttribute("href", "/queueless");
  });

  it("is not found for an unknown slug", async () => {
    await expect(renderCaseStudy("missing")).rejects.toThrow();
  });
});
