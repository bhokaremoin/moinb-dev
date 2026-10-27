"use client";

import { useState } from "react";

import { FilterChips } from "@/ui/FilterChips";

import { PostList } from "./PostList";
import { groupPostsByYear, postTags } from "./post-queries";

const ALL = "All";
const LONG_POSTS = "Posts";
const TIL = "TIL";

type FilterablePost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  til: boolean;
  readingMinutes: number;
  href: string;
};

function matchesFilter(post: FilterablePost, filter: string): boolean {
  if (filter === ALL) {
    return true;
  }
  if (filter === LONG_POSTS) {
    return !post.til;
  }
  if (filter === TIL) {
    return post.til;
  }
  return post.tags.includes(filter);
}

/** Every post is server-rendered, so the list is complete before (or without) JavaScript. */
export function PostFilters({ posts }: { posts: FilterablePost[] }) {
  const [selectedFilter, setSelectedFilter] = useState(ALL);
  const visiblePosts = posts.filter((post) =>
    matchesFilter(post, selectedFilter),
  );

  return (
    <>
      <FilterChips
        label="Filter posts"
        options={[ALL, LONG_POSTS, TIL, ...postTags(posts)]}
        selected={selectedFilter}
        onSelect={setSelectedFilter}
      />
      {groupPostsByYear(visiblePosts).map((group) => (
        <section key={group.year} aria-labelledby={`year-${group.year}`}>
          <h2 id={`year-${group.year}`} className="mt-9 mb-1 text-[1.2rem]">
            {group.year}
          </h2>
          <PostList posts={group.posts} />
        </section>
      ))}
    </>
  );
}
