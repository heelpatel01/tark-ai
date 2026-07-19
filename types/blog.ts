import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Blog domain types.
//
// A post is metadata (used by the index page + SEO) plus a `Content`
// component (the article body). Keeping the two separate lets the index page
// render cards from metadata alone, without importing every post's content.
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogPostMeta {
  slug: string;
  title: string;
  /** One or two sentences — used as the on-page subtitle AND the SEO description. */
  description: string;
  category: string;
  /** ISO 8601 date, e.g. "2026-07-19" */
  publishedAt: string;
  readTimeMinutes: number;
  icon: LucideIcon;
}

export interface BlogPost extends BlogPostMeta {
  Content: ComponentType;
}
