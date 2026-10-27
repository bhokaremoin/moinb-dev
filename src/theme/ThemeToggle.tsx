"use client";

import { toggleTheme } from "./toggle-theme";

export function ThemeToggle() {
  return (
    <button
      type="button"
      className="icon-button"
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
    >
      ◐
    </button>
  );
}
