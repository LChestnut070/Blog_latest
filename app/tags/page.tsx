import type { Metadata } from "next";
import Link from "next/link";

import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览全部文章",
  alternates: { canonical: "/tags/" },
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight">标签</h1>
      <p className="mt-3 text-sm text-muted">共 {tags.length} 个标签</p>

      {tags.length === 0 ? (
        <p className="mt-10 text-sm text-muted">还没有标签。</p>
      ) : (
        <ul className="mt-10 flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link
                href={`/tags/${encodeURIComponent(tag)}/`}
                className="inline-flex items-baseline gap-2 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-accent/40 hover:text-accent"
              >
                <span>{tag}</span>
                <span className="text-xs text-muted">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
