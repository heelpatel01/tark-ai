import React from "react";
import type { BlogPostMeta } from "@/types/blog";
import { formatPostDate } from "@/lib/blog/format";

export function PostHeader({ meta }: { meta: BlogPostMeta }) {
  const Icon = meta.icon;
  return (
    <header className="text-center mb-10">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#6D5DF6]/20 bg-[#6D5DF6]/5 text-[#6D5DF6] text-[10px] font-bold uppercase tracking-widest mb-6">
        <Icon size={11} strokeWidth={2.5} />
        {meta.category}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold tracking-tight text-[#111111] dark:text-[#F8FAFC] leading-[1.1]">
        {meta.title}
      </h1>
      <p className="mt-5 text-sm sm:text-base text-[#667085] dark:text-[#94A3B8] font-medium max-w-xl mx-auto">
        {meta.description}
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#667085] dark:text-[#94A3B8]">
        <span>Tark AI Blog</span>
        <span className="w-1 h-1 rounded-full bg-current opacity-40" />
        <span>{formatPostDate(meta.publishedAt)}</span>
        <span className="w-1 h-1 rounded-full bg-current opacity-40" />
        <span>{meta.readTimeMinutes} min read</span>
      </div>
    </header>
  );
}
