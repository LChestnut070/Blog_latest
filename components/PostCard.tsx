import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDateDot } from "@/lib/date";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group border-b border-line py-7 first:pt-0 last:border-b-0 last:pb-0">
      <Link href={`/posts/${post.slug}/`} className="block">
        <div className="flex items-center gap-2.5 text-xs text-muted">
          <time dateTime={post.date} className="tabular-nums">
            {formatDateDot(post.date)}
          </time>
          <span aria-hidden="true" className="text-line">
            /
          </span>
          <span>{post.readingTime} 分钟</span>
        </div>
        <h2 className="mt-2.5 font-serif text-[1.35rem] leading-snug tracking-tight transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        {post.summary ? (
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{post.summary}</p>
        ) : null}
      </Link>
      {post.tags.length > 0 ? (
        <div className="mt-3.5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}/`}
              className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              {tag}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
