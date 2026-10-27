/** The neighbours of `slug` in an already ordered list, for previous/next links. */
export function adjacentItems<T extends { slug: string }>(
  items: T[],
  slug: string,
): { previous?: T; next?: T } {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) {
    return { previous: undefined, next: undefined };
  }
  return { previous: items[index - 1], next: items[index + 1] };
}
