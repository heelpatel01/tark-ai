import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/component/navbar";
import { PostHeader } from "@/components/blog/PostHeader";
import { getAllSlugs, getPostBySlug } from "@/lib/blog/registry";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { Content } = post;

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      <div className="saas-grid" />
      <div className="hero-glow pointer-events-none" />
      <Navbar />

      <article className="relative z-10 pt-32 sm:pt-36 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#667085] dark:text-[#94A3B8] hover:text-[#6D5DF6] transition-colors mb-8"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Back to Blog
          </Link>

          <PostHeader meta={post} />
          <Content />
        </div>
      </article>
    </div>
  );
}
