import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPostMeta } from "@/types/blog";
import { formatPostDate } from "@/lib/blog/format";

export function PostCard({ post }: { post: BlogPostMeta }) {
  const Icon = post.icon;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm hover:shadow-md hover:border-[#6D5DF6]/30 transition-all p-6 sm:p-7"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#6D5DF6]/10 flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-[#6D5DF6]" strokeWidth={2.25} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6D5DF6]">
          {post.category}
        </span>
      </div>

      <h2 className="text-lg font-extrabold text-[#111111] dark:text-[#F8FAFC] tracking-tight group-hover:text-[#6D5DF6] transition-colors">
        {post.title}
      </h2>
      <p className="mt-2 text-sm text-[#667085] dark:text-[#94A3B8] font-medium leading-relaxed line-clamp-3">
        {post.description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#667085] dark:text-[#94A3B8]">
        <span>{formatPostDate(post.publishedAt)}</span>
        <span className="w-1 h-1 rounded-full bg-current opacity-40" />
        <span>{post.readTimeMinutes} min read</span>
        <ArrowRight
          size={12}
          strokeWidth={2.5}
          className="ml-auto text-[#6D5DF6] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </Link>
  );
}
