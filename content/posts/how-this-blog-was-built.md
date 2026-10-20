---
title: 这个博客是怎么搭起来的
date: "2026-10-12"
tags: [技术, Next.js]
summary: 从技术选型到部署，记录一个纯静态博客的完整搭建过程，以及几个刻意的取舍。
draft: false
---

这个站点的目标很简单：**写作要快，打开要快，维护成本接近零**。

下面是我做的几个决定，以及为什么这么选。

## 技术选型

| 需求 | 选择 | 原因 |
| --- | --- | --- |
| 渲染 | Next.js 静态导出 | 页面在构建时生成，运行时不需要服务器 |
| 样式 | Tailwind CSS | 不用维护一堆 CSS 文件，改样式就在组件里改 |
| 内容 | Markdown + frontmatter | 纯文本，永远读得懂，也永远不会被某个平台锁住 |
| 部署 | 任意静态托管 | 产物就是一堆 HTML，放哪都能跑 |

关键的一条是 `output: "export"`：

```ts title="next.config.ts"
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
```

这意味着构建产物是纯静态文件，没有 Node 进程常驻。好处是托管便宜、迁移自由；代价是不能用服务端渲染和图片优化服务——对一个博客来说，这个代价可以接受。

## 内容层

所有文章放在 `content/posts` 下，文件名就是 URL。读取逻辑不复杂：

```ts title="lib/posts.ts"
export function getAllPosts(): PostMeta[] {
  return readdirSync(POSTS_DIR)
    .map(parsePostFile)
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
```

写一篇新文章，就是新建一个文件：

```bash
touch content/posts/new-post.md
```

frontmatter 只有五个字段：标题、日期、标签、摘要、是否草稿。够用了。

## 几个刻意的取舍

### 不做暗色模式切换按钮？

做了。但它不是简单的 `prefers-color-scheme`——为了不让深色模式用户刷新时被闪一下白屏，需要在 `<head>` 里同步执行一小段脚本，在首屏渲染前就把 `class` 加上。

### 不用评论系统

评论需要后端、需要审核、需要防垃圾。个人博客的读者大多是通过 RSS 或搜索来的，想交流自然会找到邮箱或 GitHub。真的需要时再接 giscus，基于 GitHub Discussions，几分钟的事。

### 不上数据库

只要内容还是"一个人写、很多人读"，文件系统就是最好的数据库。备份是 `git clone`，迁移是 `git push`。

## 部署

构建之后把 `out` 目录上传即可：

```bash
pnpm build
# 产物在 out/
```

目前托管在静态平台上，推送到主分支就自动发布。等域名备案下来，会换到国内的 CDN——因为产物是纯静态的，迁移只是换个上传目标，代码一行都不用改。

这就是静态站最好的地方：**托管方是可以替换的，内容不是**。
