/** Cached so pages stay static; the cache refreshes on its default lifetime, well within a year. */
export async function currentYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}
