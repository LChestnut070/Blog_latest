import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-6 py-9 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.author}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href={site.social.rss} className="transition-colors hover:text-ink">
            RSS
          </Link>
          {site.social.github ? (
            <a
              href={site.social.github}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-ink"
            >
              GitHub
            </a>
          ) : null}
          {site.icp ? (
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-ink"
            >
              {site.icp}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
