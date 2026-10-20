import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-mono text-xs tracking-[0.3em] text-muted">404</p>
      <h1 className="mt-4 font-serif text-3xl tracking-tight">这里什么都没有</h1>
      <p className="mt-3 text-sm text-muted">页面可能被移动、改名，或者从来没有存在过。</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full border border-line px-5 py-2 text-sm transition-colors hover:border-accent/40 hover:text-accent"
      >
        回到首页
      </Link>
    </div>
  );
}
