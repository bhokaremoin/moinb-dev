import { ViewTransition } from "react";

import { posts, projects } from "#site/content";
import { buildCommandItems } from "@/command-palette/command-items";
import { CommandPalette } from "@/command-palette/CommandPalette";
import type { Section } from "@/routing/site-urls";

import { currentYear } from "./current-year";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";

export async function SiteShell({
  section,
  children,
}: {
  section: Section | undefined;
  children: React.ReactNode;
}) {
  const year = await currentYear();

  return (
    <>
      <a
        href="#main-content"
        className="bg-surface sr-only z-20 rounded-md px-3 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <SiteNav section={section} />
      <main id="main-content" className="page-column flex-1 pt-12 pb-20">
        {/* Animates client-side navigations within a section; see globals.css. */}
        <ViewTransition default="page-fade">{children}</ViewTransition>
      </main>
      <SiteFooter section={section} year={year} />
      <CommandPalette
        items={buildCommandItems({ projects, posts })}
        section={section}
      />
    </>
  );
}
