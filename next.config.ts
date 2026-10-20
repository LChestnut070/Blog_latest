import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 纯静态导出：产物是 out/ 下的 HTML/CSS/JS，可以放到任何静态托管
  output: "export",
  // 生成 /posts/hello/index.html 这种结构，静态服务器和对象存储都能正确处理
  trailingSlash: true,
  // 静态导出下没有图片优化服务，图片由 OSS / CDN 处理
  images: { unoptimized: true },
  // next-mdx-remote 在 Turbopack 下需要显式转译
  transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
