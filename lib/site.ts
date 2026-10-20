/**
 * 站点配置：改这里就够了，不需要动其它文件。
 */
export const site = {
  /** 站点短名，显示在页头和浏览器标签 */
  name: "纸上",
  /** 完整标题，用于 SEO */
  title: "纸上 — 一个写字的地方",
  /** 一句话简介，显示在首页和 SEO description */
  description: "关于代码、阅读与日常的长期记录。慢一点写，也慢一点读。",
  /** 作者名 */
  author: "林默",
  /**
   * 线上地址，结尾不要带斜杠。
   * TODO: 换成你的域名，例如 "https://blog.yourname.com"
   */
  url: "https://blog.example.com",
  locale: "zh-CN",
  nav: [
    { href: "/", label: "文章" },
    { href: "/archive/", label: "归档" },
    { href: "/tags/", label: "标签" },
    { href: "/about/", label: "关于" },
  ],
  social: {
    github: "https://github.com/yourname",
    rss: "/rss.xml",
  },
  /** 备案号，例如 "浙ICP备00000000号-1"。留空则不显示 */
  icp: "",
} as const;

export type Site = typeof site;
