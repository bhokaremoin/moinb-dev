"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { site } from "@content/site";
import { type Section, sectionHref, sectionPath } from "@/routing/site-urls";
import { toggleTheme } from "@/theme/toggle-theme";
import { copyToClipboard } from "@/ui/copy-to-clipboard";

import { OPEN_COMMAND_MENU_EVENT } from "./command-menu-events";
import type { CommandItem } from "./command-items";

/**
 * Plain substring matching on an item's label and hint. cmdk's default fuzzy scoring matches
 * letters in order anywhere, so "trpc" would rank "projects.moinb.dev" above the tRPC post.
 */
function matchesSearch(_value: string, search: string, keywords?: string[]) {
  const searchable = (keywords ?? []).join(" ").toLowerCase();
  return searchable.includes(search.trim().toLowerCase()) ? 1 : 0;
}

function isCommandMenuShortcut(event: KeyboardEvent): boolean {
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
}

export function CommandPalette({
  items,
  section,
}: {
  items: CommandItem[];
  section: Section | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function toggleOnShortcut(event: KeyboardEvent) {
      if (!isCommandMenuShortcut(event)) {
        return;
      }
      event.preventDefault();
      setIsOpen((wasOpen) => !wasOpen);
    }
    function open() {
      setIsOpen(true);
    }

    window.addEventListener("keydown", toggleOnShortcut);
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, open);
    return () => {
      window.removeEventListener("keydown", toggleOnShortcut);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, open);
    };
  }, []);

  function runCommand(item: CommandItem) {
    setIsOpen(false);
    const { action } = item;
    if (action.kind === "toggle-theme") {
      toggleTheme();
      return;
    }
    if (action.kind === "copy-email") {
      void copyToClipboard(site.email);
      return;
    }
    // Other sections are other origins, so only same-section moves can be client-side.
    if (action.section === section) {
      router.push(sectionPath(action.section, action.path));
      return;
    }
    window.location.assign(sectionHref(action.section, section, action.path));
  }

  const groups = [...new Set(items.map((item) => item.group))];

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      label="Command menu"
      filter={matchesSearch}
      overlayClassName="fixed inset-0 z-40 bg-foreground/30"
      contentClassName="fixed top-[15vh] left-1/2 z-50 w-[min(520px,calc(100%-32px))] -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
    >
      <Command.Input
        placeholder="Search pages, posts, actions…"
        className="border-line text-foreground w-full border-0 border-b bg-transparent px-4 py-3.5 text-base outline-none"
      />
      <Command.List className="max-h-80 overflow-auto p-1.5">
        <Command.Empty className="text-muted px-3 py-2">
          No matches
        </Command.Empty>
        {groups.map((group) => (
          <Command.Group
            key={group}
            heading={group}
            className="[&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.7rem] [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:uppercase"
          >
            {items
              .filter((item) => item.group === group)
              .map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  keywords={[item.label, item.hint]}
                  onSelect={() => runCommand(item)}
                  className="data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent flex cursor-pointer justify-between gap-3 rounded-md px-3 py-2"
                >
                  {item.label}
                  <small className="text-muted font-mono">{item.hint}</small>
                </Command.Item>
              ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
