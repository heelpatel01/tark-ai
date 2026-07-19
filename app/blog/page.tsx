import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import Navbar from "@/component/navbar";
import { PostCard } from "@/components/blog/PostCard";
import { BLOG_POSTS } from "@/lib/blog/registry";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering deep-dives on RAG, agents, tool calling, and the messy realities of shipping production AI applications — from the team behind Tark AI.",
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      <div className="saas-grid" />
      <div className="hero-glow pointer-events-none" />
      <Navbar />

      <main className="relative z-10 pt-32 sm:pt-36 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#6D5DF6]/20 bg-[#6D5DF6]/5 text-[#6D5DF6] text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles size={11} strokeWidth={2.5} />
              Tark AI Blog
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#F8FAFC]">
              Notes on building production AI
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#667085] dark:text-[#94A3B8] font-medium max-w-lg mx-auto">
              Engineering deep-dives on RAG, agents, tool calling, and the
              messy realities of shipping LLM applications.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 gap-5">
            {BLOG_POSTS.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
