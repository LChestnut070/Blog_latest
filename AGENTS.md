# AGENTS.md

给 AI 编码工具（Cursor / Claude Code / Copilot 等）的说明。人类读者请直接看 [README.md](./README.md)。

## 一句话

纯静态 Next.js 博客（`output: "export"`），内容来自 `content/posts/*.md`，没有后端、没有数据库。

## 关键位置

| 想改什么 | 改哪里 |
| --- | --- |
| 站名 / 作者 / 域名 / 导航 | `lib/site.ts` |
| 文章列表、标签、相邻文章逻辑 | `lib/posts.ts` |
| 整体配色、正文排版 | `app/globals.css` |
| 页面结构 | `app/**/page.tsx` |
| 文章内容 | `content/posts/*.md` |

## 不要做

- 不要加需要服务端的 API、数据库、登录、ISR
- 不要在组件里硬编码站名或域名
- 不要用 `next/image`（静态导出下没有优化服务）
- 不要用 `next start` 预览（静态导出不支持），用 `pnpm preview`

## 提交前

```bash
pnpm build
```

必须通过。构建会同时完成 TypeScript 检查和静态页面生成。
