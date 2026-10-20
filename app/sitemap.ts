import type { MetadataRoute } from "next";

import { getAllPosts, getAllTags } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site.url}/posts/${post.slug}/`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tags: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${site.url}/tags/${encodeURIComponent(tag)}/`,
    changeFrequency: "weekly",
    priority: 0.3,
  }));

  const pages: MetadataRoute.Sitemap = [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${site.url}/archive/`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${site.url}/tags/`,
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${site.url}/about/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...pages, ...posts, ...tags];
}
