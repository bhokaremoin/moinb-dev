import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { OPEN_COMMAND_MENU_EVENT } from "./command-menu-events";
import { CommandPalette } from "./CommandPalette";
import type { CommandItem } from "./command-items";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const items: CommandItem[] = [
  {
    id: "home",
    label: "Home",
    hint: "moinb.dev",
    group: "Pages",
    action: { kind: "navigate", section: "home", path: "/" },
  },
  {
    id: "ledgerly",
    label: "Ledgerly",
    hint: "case study",
    group: "Projects",
    action: { kind: "navigate", section: "projects", path: "/ledgerly" },
  },
  {
    id: "projects",
    label: "Projects",
    hint: "projects.moinb.dev",
    group: "Pages",
    action: { kind: "navigate", section: "projects", path: "/" },
  },
  {
    id: "post",
    label: "Why I moved to tRPC",
    hint: "post",
    group: "Posts",
    action: { kind: "navigate", section: "blog", path: "/rest-to-trpc" },
  },
  {
    id: "email",
    label: "Copy email",
    hint: "action",
    group: "Actions",
    action: { kind: "copy-email" },
  },
  {
    id: "theme",
    label: "Toggle theme",
    hint: "action",
    group: "Actions",
    action: { kind: "toggle-theme" },
  },
];

beforeAll(() => {
  // cmdk measures and scrolls its list; jsdom implements neither.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ??= () => {};
});

describe("CommandPalette", () => {
  const assign = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("location", { ...window.location, assign });
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    push.mockReset();
    assign.mockReset();
  });

  it("opens with Ctrl+K", async () => {
    render(<CommandPalette items={items} section="home" />);

    await userEvent.keyboard("{Control>}k{/Control}");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens from the nav button's event", () => {
    render(<CommandPalette items={items} section="home" />);

    act(() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT)));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("filters items by what is typed", async () => {
    render(<CommandPalette items={items} section="home" />);
    await userEvent.keyboard("{Meta>}k{/Meta}");

    await userEvent.type(screen.getByRole("combobox"), "ledg");

    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["Ledgerly" + "case study"]);
  });

  it("matches what was typed as a substring, not a loose fuzzy match", async () => {
    render(<CommandPalette items={items} section="home" />);
    await userEvent.keyboard("{Control>}k{/Control}");

    await userEvent.type(screen.getByRole("combobox"), "trpc");

    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["Why I moved to tRPC" + "post"]);
  });

  it("moves to another section with a full page load", async () => {
    render(<CommandPalette items={items} section="home" />);
    await userEvent.keyboard("{Control>}k{/Control}");

    await userEvent.click(screen.getByRole("option", { name: /Ledgerly/ }));

    expect(assign).toHaveBeenCalledWith("https://projects.moinb.dev/ledgerly");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps cross-section moves on the current host in path mode", async () => {
    // Without a root domain (Vercel previews) every section lives under one host. routingConfig
    // is read at import, so the palette is re-imported with the variable unset.
    vi.stubEnv("NEXT_PUBLIC_ROOT_DOMAIN", "");
    vi.resetModules();
    const { CommandPalette: PathModePalette } =
      await import("./CommandPalette");
    render(<PathModePalette items={items} section="home" />);
    await userEvent.keyboard("{Control>}k{/Control}");

    await userEvent.click(screen.getByRole("option", { name: /Ledgerly/ }));

    expect(assign).toHaveBeenCalledWith("/projects/ledgerly");
  });

  it("navigates within the current section client-side", async () => {
    render(<CommandPalette items={items} section="projects" />);
    await userEvent.keyboard("{Control>}k{/Control}");

    await userEvent.click(screen.getByRole("option", { name: /Ledgerly/ }));

    expect(push).toHaveBeenCalledWith("/ledgerly");
  });

  it("runs actions such as toggling the theme", async () => {
    render(<CommandPalette items={items} section="home" />);
    await userEvent.keyboard("{Control>}k{/Control}");

    await userEvent.click(screen.getByRole("option", { name: /Toggle theme/ }));

    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("confirms when the email was copied", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    render(<CommandPalette items={items} section="home" />);
    await userEvent.keyboard("{Control>}k{/Control}");

    await userEvent.click(screen.getByRole("option", { name: /Copy email/ }));

    expect(writeText).toHaveBeenCalledWith("hello@moinb.dev");
    expect(await screen.findByRole("status")).toHaveTextContent("Email copied");
  });

  it("shows the address when copying is not possible", async () => {
    vi.stubGlobal("navigator", { ...navigator, clipboard: undefined });
    render(<CommandPalette items={items} section="home" />);
    await userEvent.keyboard("{Control>}k{/Control}");

    await userEvent.click(screen.getByRole("option", { name: /Copy email/ }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Couldn't copy. Email me at hello@moinb.dev",
    );
  });

  it("closes with Escape", async () => {
    render(<CommandPalette items={items} section="home" />);
    await userEvent.keyboard("{Control>}k{/Control}");

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
