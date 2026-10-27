import Link from "next/link";

import { CommandMenuButton } from "@/command-palette/CommandMenuButton";
import { type Section, sectionHref } from "@/routing/site-urls";
import { ThemeToggle } from "@/theme/ThemeToggle";

const NAV_LINK_CLASS =
  "text-[0.92rem] text-muted no-underline hover:text-foreground aria-[current=page]:text-foreground";

export function SiteNav({ section }: { section: Section }) {
  const currentPage = (target: Section) =>
    target === section ? ("page" as const) : undefined;

  return (
    <header className="border-line bg-background sticky top-0 z-10 border-b">
      <nav
        aria-label="Main"
        className="page-column flex items-center gap-[18px] py-3.5"
      >
        <Link
          href={sectionHref("home", section, "/")}
          aria-label="moinb.dev home"
          className="font-display mr-auto text-[1.1rem] font-bold no-underline"
        >
          moin<span className="text-accent">b</span>.dev
        </Link>
        <Link
          href={sectionHref("home", section, "/#about")}
          className={`${NAV_LINK_CLASS} max-sm:hidden`}
        >
          About
        </Link>
        <Link
          href={sectionHref("projects", section, "/")}
          aria-current={currentPage("projects")}
          className={NAV_LINK_CLASS}
        >
          Projects
        </Link>
        <Link
          href={sectionHref("blog", section, "/")}
          aria-current={currentPage("blog")}
          className={NAV_LINK_CLASS}
        >
          Blog
        </Link>
        <CommandMenuButton />
        <ThemeToggle />
      </nav>
    </header>
  );
}
