import Link from "next/link";
import { site } from "@/lib/site";
import { Nav } from "./Nav";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-3 px-6">
        <Link href="/" className="shrink-0 font-serif text-lg tracking-tight">
          {site.name}
        </Link>
        <div className="flex items-center gap-2.5 sm:gap-5">
          <Nav />
          <span aria-hidden="true" className="h-4 w-px shrink-0 bg-line" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
