"use client";

import { OPEN_COMMAND_MENU_EVENT } from "./command-menu-events";

export function CommandMenuButton() {
  return (
    <button
      type="button"
      className="icon-button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT))}
    >
      {/* The glyph isn't readable text, so the accessible name comes from the hidden label. */}
      <span aria-hidden="true">⌘K</span>
      <span className="sr-only">Open command menu</span>
    </button>
  );
}
