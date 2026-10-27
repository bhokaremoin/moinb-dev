"use client";

import { OPEN_COMMAND_MENU_EVENT } from "./command-menu-events";

export function CommandMenuButton() {
  return (
    <button
      type="button"
      className="icon-button"
      aria-label="Open command menu"
      onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT))}
    >
      ⌘K
    </button>
  );
}
