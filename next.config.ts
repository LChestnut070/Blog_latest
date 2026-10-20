import type { NextConfig } from "next";

// 静态导出只在 production build 时启用。
// 原因：Next 在 dev + output:export 下会用「URL 编码后的路径」去匹配
// generateStaticParams() 里的原始值，中文标签（/tags/随笔/）会被误判为
// 缺少参数并抛 500。开发模式用普通渲染即可，构建产物仍然是纯静态。
const isStaticExport = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  // 生成 /posts/hello/index.html 这种结构，静态服务器和对象存储都能正确处理
  trailingSlash: true,
  // 静态导出下没有图片优化服务，图片由 OSS / CDN 处理
  images: { unoptimized: true },
  // next-mdx-remote 在 Turbopack 下需要显式转译
  transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
