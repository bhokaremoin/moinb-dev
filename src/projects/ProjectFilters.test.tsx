import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProjectFilters } from "./ProjectFilters";

function card(title: string, type: string) {
  return {
    slug: title.toLowerCase(),
    title,
    type,
    summary: `${title} summary`,
    stack: ["TS"],
    href: `/${title.toLowerCase()}`,
  };
}

const cards = [
  card("Ledgerly", "Full-stack"),
  card("Shipnote", "Open source"),
  card("Queueless", "Client"),
];

function cardTitles() {
  return screen
    .getAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent);
}

describe("ProjectFilters", () => {
  it("shows every project with All selected by default", () => {
    render(<ProjectFilters projects={cards} />);

    expect(cardTitles()).toEqual(["Ledgerly", "Shipnote", "Queueless"]);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("offers one chip per project type", () => {
    render(<ProjectFilters projects={cards} />);

    expect(
      screen.getAllByRole("button").map((chip) => chip.textContent),
    ).toEqual(["All", "Full-stack", "Open source", "Client"]);
  });

  it("narrows the cards to the chosen type", async () => {
    render(<ProjectFilters projects={cards} />);

    await userEvent.click(screen.getByRole("button", { name: "Client" }));

    expect(cardTitles()).toEqual(["Queueless"]);
    expect(screen.getByRole("button", { name: "Client" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
