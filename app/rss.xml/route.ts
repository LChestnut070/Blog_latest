import { Feed } from "feed";

import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const year = new Date().getFullYear();

  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.url,
    link: site.url,
    language: site.locale.toLowerCase(),
    favicon: `${site.url}/favicon.svg`,
    copyright: `© ${year} ${site.author}`,
    updated: posts[0] ? new Date(`${posts[0].date}T00:00:00Z`) : new Date(),
    feedLinks: {
      rss2: `${site.url}/rss.xml`,
    },
    author: {
      name: site.author,
      link: site.url,
    },
  });

  for (const post of posts) {
    const url = `${site.url}/posts/${post.slug}/`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.summary,
      date: new Date(`${post.date}T00:00:00Z`),
      category: post.tags.map((tag) => ({ name: tag })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
