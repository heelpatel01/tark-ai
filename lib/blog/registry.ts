import type { BlogPost } from "@/types/blog";
import * as whereRagFails from "./posts/where-rag-fails";

// ─────────────────────────────────────────────────────────────────────────────
// Blog post registry.
//
// To publish a new post: create `lib/blog/posts/<slug>.tsx` exporting `meta`
// (BlogPostMeta) and `Content` (the article body, using components/blog/*
// primitives), then add one import + entry below. Both the index page and the
// `/blog/[slug]` route read from this list — nothing else needs to change.
// ─────────────────────────────────────────────────────────────────────────────

const MODULES = [whereRagFails];

export const BLOG_POSTS: BlogPost[] = MODULES.map((m) => ({
  ...m.meta,
  Content: m.Content,
})).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
