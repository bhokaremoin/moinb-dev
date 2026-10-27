import { describe, expect, it } from "vitest";

import { formatLongDate, formatShortDate, yearOf } from "./format-date";

describe("date formatting", () => {
  it("formats a short month and day", () => {
    expect(formatShortDate("2026-10-12T00:00:00.000Z")).toBe("Oct 12");
  });

  it("formats a long date with the year", () => {
    expect(formatLongDate("2026-10-12T00:00:00.000Z")).toBe("Oct 12, 2026");
  });

  it("uses UTC so a midnight date never shifts to the previous day", () => {
    expect(formatShortDate("2026-01-01T00:00:00.000Z")).toBe("Jan 1");
    expect(yearOf("2026-01-01T00:00:00.000Z")).toBe(2026);
  });
});
