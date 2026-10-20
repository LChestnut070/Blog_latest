import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { TableOfContents } from "@/components/TableOfContents";
import { mdxComponents } from "@/components/mdx-components";
import { formatDate } from "@/lib/date";
import { getAllPosts, getAdjacentPosts, getPostBySlug } from "@/lib/posts";
import { decodeParam } from "@/lib/url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
  },
  keepBackground: false,
  defaultLang: "plaintext",
  // 行内代码交给 .prose 的样式处理，不参与高亮、也不生成 figure 容器
  bypassInlineCode: true,
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const post = getPostBySlug(decodeParam(rawSlug));

  if (!post) return { title: "文章不存在" };

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: { canonical: `/posts/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/posts/${post.slug}/`,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const post = getPostBySlug(decodeParam(rawSlug));

  if (!post) notFound();

  const { older, newer } = getAdjacentPosts(post.slug);

  return (
    <article>
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true" className="text-line">
            ·
          </span>
          <span>约 {post.readingTime} 分钟</span>
        </div>

        <h1 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-[2.4rem]">
          {post.title}
        </h1>

        {post.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}/`}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <TableOfContents items={post.toc} />

      <div className="prose">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
            },
          }}
        />
      </div>

      <nav
        aria-label="文章导航"
        className="mt-16 grid gap-6 border-t border-line pt-8 sm:grid-cols-2"
      >
        {older ? (
          <Link href={`/posts/${older.slug}/`} className="group">
            <span className="text-xs text-muted">← 上一篇</span>
            <p className="mt-1.5 font-serif text-base leading-snug transition-colors group-hover:text-accent">
              {older.title}
            </p>
          </Link>
        ) : (
          <span />
        )}

        {newer ? (
          <Link href={`/posts/${newer.slug}/`} className="group sm:text-right">
            <span className="text-xs text-muted">下一篇 →</span>
            <p className="mt-1.5 font-serif text-base leading-snug transition-colors group-hover:text-accent">
              {newer.title}
            </p>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
