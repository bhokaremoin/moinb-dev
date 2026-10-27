import { yearOf } from "@/content/format-date";
import { sortByDateDescending } from "@/content/sort-by-date";

type PostSummary = { slug: string; date: string; tags: string[] };

const LATEST_LIMIT = 3;

export function sortPostsByDate<T extends PostSummary>(posts: T[]): T[] {
  return sortByDateDescending(posts);
}

export function groupPostsByYear<T extends PostSummary>(
  posts: T[],
): { year: number; posts: T[] }[] {
  const groups: { year: number; posts: T[] }[] = [];
  for (const post of sortPostsByDate(posts)) {
    const year = yearOf(post.date);
    const lastGroup = groups.at(-1);
    if (lastGroup?.year === year) {
      lastGroup.posts.push(post);
    } else {
      groups.push({ year, posts: [post] });
    }
  }
  return groups;
}

/** Every tag in use, most used first so the filter chips lead with the main topics. */
export function postTags(posts: PostSummary[]): string[] {
  const counts = new Map<string, number>();
  for (const tag of posts.flatMap((post) => post.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(
      ([tagA, countA], [tagB, countB]) =>
        countB - countA || tagA.localeCompare(tagB),
    )
    .map(([tag]) => tag);
}

export function latestPosts<T extends PostSummary>(
  posts: T[],
  limit = LATEST_LIMIT,
): T[] {
  return sortPostsByDate(posts).slice(0, limit);
}
