import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const POST_EXTENSIONS = [".md", ".mdx"];

export type TocItem = {
  id: string;
  text: string;
  depth: number;
};

export type PostMeta = {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  tags: string[];
  summary: string;
  draft: boolean;
  readingTime: number;
};

export type Post = PostMeta & {
  content: string;
  toc: TocItem[];
};

function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => POST_EXTENSIONS.includes(path.extname(file).toLowerCase()));
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value ?? "").trim();
  const match = /^\d{4}-\d{1,2}-\d{1,2}/.exec(text);
  if (!match) {
    throw new Error(`文章日期格式不合法："${text}"，请使用 YYYY-MM-DD`);
  }
  const [year, month, day] = match[0].split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

/** 中文按字、英文按词估算，取整到分钟 */
function calcReadingTime(content: string): number {
  const text = content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
  const cjk = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const words = (text.replace(/[\u3400-\u9fff]/g, " ").match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 220));
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .trim();
}

/**
 * 从 Markdown 中提取 h2 / h3 作为目录。
 * 用 github-slugger 生成 id，与 rehype-slug 的输出保持一致。
 */
function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.+)$/.exec(line);
    if (!match) continue;

    const depth = match[1].length;
    const text = stripInlineMarkdown(match[2].replace(/\s+#+\s*$/, ""));
    if (!text) continue;

    // 所有层级都参与编号，保证与 rehype-slug 的去重结果一致
    const id = slugger.slug(text);
    if (depth >= 2 && depth <= 3) {
      items.push({ id, text, depth });
    }
  }

  return items;
}

function parsePostFile(fileName: string): Post {
  const source = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(source);

  const slug = fileName.replace(/\.(md|mdx)$/i, "");
  const title = String(data.title ?? slug).trim();

  return {
    slug,
    title,
    date: normalizeDate(data.date),
    tags: normalizeTags(data.tags),
    summary: String(data.summary ?? "").trim(),
    draft: Boolean(data.draft ?? false),
    readingTime: calcReadingTime(content),
    content,
    toc: extractToc(content),
  };
}

/** 全部已发布文章，按时间倒序 */
export function getAllPosts(): PostMeta[] {
  return listPostFiles()
    .map(parsePostFile)
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : a.date < b.date ? 1 : -1))
    .map(({ content: _content, toc: _toc, ...meta }) => meta);
}

export function getPostBySlug(slug: string): Post | null {
  const fileName = listPostFiles().find(
    (file) => file.replace(/\.(md|mdx)$/i, "") === slug,
  );
  if (!fileName) return null;
  const post = parsePostFile(fileName);
  return post.draft ? null : post;
}

export function getAllTags(): { tag: string; count: number }[] {
  const counter = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counter.set(tag, (counter.get(tag) ?? 0) + 1);
    }
  }
  return [...counter.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getAdjacentPosts(slug: string): {
  older: PostMeta | null;
  newer: PostMeta | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { older: null, newer: null };
  return {
    older: posts[index + 1] ?? null,
    newer: posts[index - 1] ?? null,
  };
}

export function getArchiveGroups(): { year: string; posts: PostMeta[] }[] {
  const groups = new Map<string, PostMeta[]>();
  for (const post of getAllPosts()) {
    const year = post.date.slice(0, 4);
    const list = groups.get(year) ?? [];
    list.push(post);
    groups.set(year, list);
  }
  return [...groups.entries()]
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => (a.year < b.year ? 1 : -1));
}
