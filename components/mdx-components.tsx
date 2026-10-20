import type { ComponentPropsWithoutRef } from "react";

/**
 * 自定义 Markdown 元素渲染。
 * 正文样式主要由 globals.css 里的 .prose 控制，这里只处理需要额外行为的部分。
 */
export const mdxComponents = {
  a({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) {
    const isExternal = typeof href === "string" && /^https?:\/\//.test(href);

    return (
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  },

  img({ src, alt, ...rest }: ComponentPropsWithoutRef<"img">) {
    return (
      // 静态导出没有图片优化服务，统一用原生 img + 懒加载
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === "string" ? src : undefined}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        {...rest}
      />
    );
  },

  table({ children, ...rest }: ComponentPropsWithoutRef<"table">) {
    return (
      <div className="my-7 overflow-x-auto rounded-lg border border-line">
        {/* 小屏保底宽度 + 横向滚动，避免中文被压成一字一行 */}
        <table className="my-0! w-full min-w-[32rem] sm:min-w-0" {...rest}>
          {children}
        </table>
      </div>
    );
  },
};
