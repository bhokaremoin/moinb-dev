import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { posts, projects } from "#site/content";

import { MdxContent } from "./MdxContent";

const restToTrpc = posts.find((post) => post.slug === "rest-to-trpc")!;
const ledgerly = projects.find((project) => project.slug === "ledgerly")!;

describe("MdxContent", () => {
  it("renders compiled MDX with anchored headings", () => {
    render(<MdxContent code={restToTrpc.content} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The problem with my REST setup",
      }),
    ).toHaveAttribute("id", "the-problem-with-my-rest-setup");
  });

  it("renders the shared callout component", () => {
    render(<MdxContent code={restToTrpc.content} />);

    expect(screen.getByRole("note")).toHaveTextContent("Short version:");
  });

  it("renders components supplied by the page in place of MDX tags", () => {
    render(
      <MdxContent
        code={ledgerly.content}
        components={{
          ArchitectureDiagram: () => <p>diagram here</p>,
          MetricCards: () => <p>metrics here</p>,
        }}
      />,
    );

    expect(screen.getByText("diagram here")).toBeInTheDocument();
    expect(screen.getByText("metrics here")).toBeInTheDocument();
  });
});
