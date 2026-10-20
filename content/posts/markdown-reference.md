---
title: Markdown 排版参考
date: "2026-09-28"
tags: [写作, 参考]
summary: 这个博客支持的所有 Markdown 写法，顺便当作排版效果的对照表。
draft: false
---

这篇文章用来检查排版细节。写新文章时，可以回来看看各种元素长什么样。

## 标题层级

正文里的 `##` 和 `###` 会出现在目录中，`####` 及以下不会。

### 这是一个三级标题

#### 这是一个四级标题

## 文本

普通段落。支持 **加粗**、*斜体*、~~删除线~~、`行内代码`，以及[链接](https://example.com)。

需要换行时，在行尾留两个空格，或者直接分段。中文排版里，段落之间留白比强行缩进更好看。

> 引用块用来看起来像在引经据典。
>
> 也可以写多段。

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌套一层
  - 再嵌套一层
- 第三项

有序列表：

1. 先做这个
2. 再做那个
3. 最后收尾

任务列表：

- [x] 搭好骨架
- [x] 写好样式
- [ ] 补充内容

## 表格

| 元素 | 语法 | 备注 |
| --- | --- | --- |
| 加粗 | `**文字**` | 强调用 |
| 行内代码 | `` `code` `` | 技术名词 |
| 链接 | `[文字](url)` | 外部链接自动新窗口 |

## 代码

行内代码：`const answer = 42`。

代码块带语言标注，会有语法高亮：

```ts
type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
};

export function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}
```

```python
def reading_time(text: str, cpm: int = 400) -> int:
    cjk = sum(1 for ch in text if "\u4e00" <= ch <= "\u9fff")
    return max(1, -(-cjk // cpm))
```

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build   # 产物在 out/
```

## 分隔线

---

## 脚注

Markdown 还支持脚注，适合放补充说明。[^1]

[^1]: 这是脚注的内容，会显示在页面底部。

## 图片

图片用标准写法，会自动懒加载并加圆角边框：

```md
![图片说明](/uploads/example.jpg)
```

把图片放进 `public/uploads` 目录，就能用 `/uploads/文件名` 引用。

## 小结

以上覆盖了日常写作会用到的全部语法。如果发现某处排版不对，多半是样式表里漏了一条规则——改 `app/globals.css` 里的 `.prose` 部分即可。
