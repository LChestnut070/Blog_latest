"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

function normalize(path: string): string {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "");
}

export function Nav() {
  const pathname = normalize(usePathname() ?? "/");

  return (
    <nav className="flex items-center gap-3 text-[13px] sm:gap-6 sm:text-sm">
      {site.nav.map((item) => {
        const target = normalize(item.href);
        const active = target === "/" ? pathname === "/" : pathname.startsWith(target);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative transition-colors hover:text-ink ${
              active ? "text-ink" : "text-muted"
            }`}
          >
            {item.label}
            {active && (
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-px w-full bg-accent"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
