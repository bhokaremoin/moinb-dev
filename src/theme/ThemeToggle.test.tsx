import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "./ThemeToggle";

function prefersDark(isDark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: isDark } as MediaQueryList),
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => prefersDark(false));

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute("data-theme");
    document.cookie = "theme=; Max-Age=0; Path=/";
  });

  it("switches a light system theme to dark and remembers it", async () => {
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: /dark mode/i }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.cookie).toContain("theme=dark");
  });

  it("switches a dark system theme to light", async () => {
    prefersDark(true);
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: /dark mode/i }));

    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("switches from the manually chosen theme rather than the system one", async () => {
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: /dark mode/i }));

    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
