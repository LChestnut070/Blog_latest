import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="mb-12 border-b border-line pb-10">
        <h1 className="font-serif text-[2.6rem] leading-none tracking-tight sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-muted">
          {site.description}
        </p>
      </section>

      <section aria-label="文章列表">
        <h2 className="mb-2 text-[11px] tracking-[0.2em] text-muted">最新文章</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-muted">还没有文章，去 content/posts 里新建一个 .md 文件吧。</p>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </section>
    </>
  );
}
