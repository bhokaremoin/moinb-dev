export function sortByDateDescending<T extends { date: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}
