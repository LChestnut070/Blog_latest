import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/PostCard";
import { getAllTags, getPostsByTag } from "@/lib/posts";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `标签：${tag}`,
    description: `标签「${tag}」下的所有文章`,
    alternates: { canonical: `/tags/${encodeURIComponent(tag)}/` },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <div>
      <div className="mb-10 border-b border-line pb-8">
        <p className="text-[11px] tracking-[0.2em] text-muted">标签</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">{tag}</h1>
        <p className="mt-2 text-sm text-muted">{posts.length} 篇文章</p>
      </div>

      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
