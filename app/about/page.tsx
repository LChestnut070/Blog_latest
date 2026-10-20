import type { Metadata } from "next";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于",
  description: `关于 ${site.name}，以及作者 ${site.author}`,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight">关于</h1>

      <div className="prose mt-8">
        <p>
          你好，我是{site.author}。这里是我的个人博客，用来存放那些值得写下来、但又不适合发在
          社交媒体上的东西——多半和技术有关，偶尔也写点别的。
        </p>

        <p>
          我更喜欢「慢」一点的表达：一篇文章写完再发，一个想法想清楚再讲。所以这里的更新不会很频繁，
          但每一篇都会尽量写完整。
        </p>

        <h2>关于这个站</h2>
        <p>
          站点用 Next.js 静态生成，文章是纯 Markdown 文件，托管在静态平台上。没有数据库、没有后台，
          写作就是把一个 <code>.md</code> 文件提交上去。
        </p>

        <h2>联系</h2>
        <p>
          有任何想法，欢迎通过{" "}
          <a href={site.social.github} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>{" "}
          找到我，或者订阅 <a href="/rss.xml">RSS</a> 第一时间读到新文章。
        </p>
      </div>
    </div>
  );
}
