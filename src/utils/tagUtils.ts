import type { CollectionEntry } from "astro:content";

export function getTagCounts(posts: CollectionEntry<"blog">[]) {
  const tags = posts.flatMap(({data}) => data.tags);
  const tagCounts = new Map<string, number>();

  for (const t of tags) {
    const count = tagCounts.get(t);
    if (count) tagCounts.set(t, count + 1);
    else tagCounts.set(t, 1);
  }

  return [...tagCounts].sort(([a], [b]) => a.localeCompare(b));
}

export function getTagPosts(tag: string, posts: CollectionEntry<"blog">[]) {
  return posts.filter(({data}) => data.tags.includes(tag))
}