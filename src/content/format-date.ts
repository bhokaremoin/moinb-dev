// Content dates are calendar dates stored as UTC midnight; formatting in UTC keeps the day
// the same on the server and in every visitor's time zone.

const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatShortDate(isoDate: string): string {
  return SHORT_DATE.format(new Date(isoDate));
}

export function formatLongDate(isoDate: string): string {
  return LONG_DATE.format(new Date(isoDate));
}

export function yearOf(isoDate: string): number {
  return new Date(isoDate).getUTCFullYear();
}
