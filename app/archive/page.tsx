import type { Metadata } from "next";
import Link from "next/link";

import { formatDateDot } from "@/lib/date";
import { getArchiveGroups } from "@/lib/posts";

export const metadata: Metadata = {
  title: "归档",
  description: "全部文章按年份归档",
  alternates: { canonical: "/archive/" },
};

export default function ArchivePage() {
  const groups = getArchiveGroups();
  const total = groups.reduce((sum, group) => sum + group.posts.length, 0);

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight">归档</h1>
      <p className="mt-3 text-sm text-muted">共 {total} 篇</p>

      <div className="mt-12 space-y-12">
        {groups.map((group) => (
          <section key={group.year}>
            <h2 className="font-serif text-xl tracking-tight text-muted">{group.year}</h2>
            <ul className="mt-4 border-t border-line">
              {group.posts.map((post) => (
                <li key={post.slug} className="border-b border-line">
                  <Link
                    href={`/posts/${post.slug}/`}
                    className="group flex items-baseline gap-4 py-3"
                  >
                    <time
                      dateTime={post.date}
                      className="w-16 shrink-0 text-xs tabular-nums text-muted"
                    >
                      {formatDateDot(post.date).slice(5)}
                    </time>
                    <span className="text-[0.98rem] transition-colors group-hover:text-accent">
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
