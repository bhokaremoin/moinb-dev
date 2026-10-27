import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SiteAnalytics } from "./SiteAnalytics";

vi.mock("@vercel/analytics/next", () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

describe("SiteAnalytics", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("loads analytics on Vercel", () => {
    vi.stubEnv("VERCEL", "1");

    const { getByTestId } = render(<SiteAnalytics />);

    expect(getByTestId("vercel-analytics")).toBeInTheDocument();
  });

  it("stays off elsewhere, where the script would 404", () => {
    vi.stubEnv("VERCEL", "");

    const { container } = render(<SiteAnalytics />);

    expect(container).toBeEmptyDOMElement();
  });
});
