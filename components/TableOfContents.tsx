import type { TocItem } from "@/lib/posts";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <details className="group mb-10 rounded-lg border border-line bg-surface/50 px-4 py-3 text-sm">
      <summary className="flex cursor-pointer list-none select-none items-center gap-2 text-xs font-medium text-muted">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h10M4 18h7" />
        </svg>
        目录
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="ml-auto transition-transform duration-200 group-open:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.depth - 2) * 14}px` }}
            className="leading-snug"
          >
            <a
              href={`#${item.id}`}
              className="text-[13px] text-muted transition-colors hover:text-accent"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
