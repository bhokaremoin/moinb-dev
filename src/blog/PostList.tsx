import Link from "next/link";

import { formatShortDate } from "@/content/format-date";

import { TilChip } from "./TilChip";

type ListedPost = {
  slug: string;
  title: string;
  date: string;
  til: boolean;
  readingMinutes: number;
  href: string;
};

export function PostList({ posts }: { posts: ListedPost[] }) {
  return (
    <ul className="m-0 list-none p-0">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={post.href}
            className="group border-line flex items-baseline gap-4 border-b py-3 no-underline"
          >
            <time
              dateTime={post.date}
              className="text-muted flex-[0_0_72px] font-mono text-[0.8rem]"
            >
              {formatShortDate(post.date)}
            </time>
            <span className="group-hover:text-accent min-w-0 flex-1">
              {post.title}
              {post.til && <TilChip />}
            </span>
            <span className="text-muted font-mono text-[0.8rem]">
              {post.readingMinutes} min
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
