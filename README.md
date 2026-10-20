# 纸上 · 个人博客

一个纯静态的个人博客：**Markdown 写作、无数据库、无后端**，构建产物是一堆 HTML 文件，可以托管在任何静态平台上。

- 框架：Next.js（App Router，`output: "export"`）
- 样式：Tailwind CSS v4 + typography 插件
- 内容：`content/posts/*.md` + frontmatter
- 代码高亮：Shiki（构建时高亮，零运行时开销）

## 快速开始

```bash
pnpm install
pnpm dev        # 开发模式 http://localhost:3000
pnpm build      # 构建静态产物到 out/
pnpm preview    # 本地预览 out/（先 build）
```

## 写一篇新文章

在 `content/posts/` 下新建一个 `.md` 文件，**文件名就是 URL**（`hello-world.md` → `/posts/hello-world/`）：

```markdown
---
title: 文章标题
date: "2026-10-20"
tags: [随笔, 技术]
summary: 一句话摘要，会显示在列表、RSS 和 SEO 描述里
draft: false
---

正文用标准 Markdown 写。
```

- `draft: true` 的文章不会出现在列表、标签页、RSS 和站点地图里。
- 日期必须是 `YYYY-MM-DD`，建议加引号，避免时区问题。
- 图片放进 `public/uploads/`，正文里写 `![说明](/uploads/example.jpg)`。
- 图片建议先压缩成 WebP、宽度不超过 1200px——这是低带宽环境下最有效的一步。

## 改站点信息

所有站点级配置都在 **`lib/site.ts`**：站名、作者、简介、域名、导航、社交链接、备案号。

> 上线前务必把 `url` 改成真实域名，否则 canonical、RSS、sitemap 里的链接都是错的。

## 目录结构

```
app/
  layout.tsx              全局布局 + 主题脚本
  page.tsx                首页（文章列表）
  posts/[slug]/page.tsx   文章详情（Markdown 渲染 + 目录）
  tags/page.tsx           标签总览
  tags/[tag]/page.tsx     标签详情
  archive/page.tsx        归档
  about/page.tsx          关于
  rss.xml/route.ts        RSS（构建时生成）
  sitemap.ts / robots.ts  SEO
  globals.css             设计变量与正文排版
components/               Header / Footer / PostCard / 目录 / 主题切换
content/posts/            文章
lib/
  site.ts                 站点配置
  posts.ts                读取、解析、排序、标签、相邻文章
  date.ts                 日期格式化（统一按 UTC）
public/uploads/           文章图片
scripts/serve.mjs         零依赖的静态预览服务器
```

## 部署

### 方案 A：Cloudflare Pages（推荐，免备案）

1. 代码推到 GitHub。
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git。
3. 构建设置：
   - **Build command**：`pnpm build`
   - **Build output directory**：`out`
   - **环境变量**：`NODE_VERSION = 24`（或 22）
4. 保存后自动构建发布，之后每次 `git push` 都会重新部署。
5. 自定义域名：Pages → Custom domains 里绑定，HTTPS 自动签发。

也可以本地直传：

```bash
pnpm build
npx wrangler pages deploy out --project-name my-blog
```

### 方案 B：阿里云（需要 ICP 备案）

大陆服务器绑定域名前必须完成备案，否则 80/443 会被拦截。备案通过后有两种做法：

**B1. OSS + CDN**

1. 新建 Bucket，读写权限设为「公共读」。
2. 开启「静态页面」托管，默认首页 `index.html`、默认 404 页 `404.html`。
3. 上传 `out/` 里的全部文件（不要上传 `out` 目录本身）。
4. CDN 加速域名同样需要备案；回源到 OSS。

**B2. ECS + Nginx**

把 `out/` 同步到服务器，例如：

```bash
rsync -avz --delete out/ root@your-server:/var/www/blog/
```

Nginx 参考配置：

```nginx
server {
    listen 443 ssl http2;
    server_name blog.example.com;

    root /var/www/blog;
    index index.html;

    gzip on;
    gzip_comp_level 5;
    gzip_types text/css application/javascript application/json
               image/svg+xml application/xml text/plain;

    # 带 hash 的静态资源可以长期缓存
    location /_next/static/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # HTML 不缓存，保证发文章后立刻生效
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }
}
```

证书用 `certbot` 申请 Let's Encrypt，自动续期。

## 关于中文标签 URL

标签直接作为路径（`/tags/随笔/`），浏览器会编码成 `/tags/%E9%9A%8F%E7%AC%94/`。Cloudflare 和 Nginx 都能正确解析；个别对象存储对非 ASCII 路径支持不好，如果遇到 404，把标签改成英文即可。

## 已经做好的 SEO

- 每页独立的 `title` / `description` / canonical / Open Graph
- `/sitemap.xml`、`/robots.txt`、`/rss.xml` 均在构建时生成
- 语义化 `<time>`、文章页 `article` 结构、目录锚点

## 后续可以加

| 需求 | 方案 | 成本 |
| --- | --- | --- |
| 评论 | giscus（基于 GitHub Discussions） | 免费 |
| 搜索 | Pagefind（构建后生成静态索引） | 免费 |
| 访问统计 | Umami（可以跑在那台 ECS 上） | 免费 |
| 手机写作后台 | Decap CMS + GitHub OAuth | 免费 |
| 社交分享图 | 构建时用 `@vercel/og` 生成 | 免费 |

## 已知取舍

- 静态导出无法使用 Next.js 的图片优化服务，图片需要自己压缩或用 OSS 处理。
- 没有分页：文章多了以后首页会变长，到时再加 `/page/[n]`。
- 评论、搜索都刻意留到 v2，先把「写」和「读」跑顺。
