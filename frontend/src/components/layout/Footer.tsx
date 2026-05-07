"use client";

import Link from "next/link";

interface ToolCategory {
  title: string;
  links: { label: string; href: string }[];
}

const friendLinks = [
  { label: "个人博客", href: "https://sunsunblog.top", description: "技术博客" },
  { label: "Stirling-PDF", href: "https://github.com/Stirling-Tools/Stirling-PDF", description: "开源PDF工具" },
  { label: "Next.js", href: "https://nextjs.org", description: "React框架" },
  { label: "TailwindCSS", href: "https://tailwindcss.com", description: "CSS框架" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const toolCategories: ToolCategory[] = [
    {
      title: "转为PDF",
      links: [
        { label: "Word转PDF", href: "/word-to-pdf" },
        { label: "JPG转PDF", href: "/jpg-to-pdf" },
      ],
    },
    {
      title: "PDF转换",
      links: [
        { label: "PDF转Word", href: "/pdf-to-word" },
        { label: "PDF转JPG", href: "/pdf-to-jpg" },
      ],
    },
    {
      title: "PDF工具",
      links: [
        { label: "PDF合并", href: "/merge-pdf" },
        { label: "PDF压缩", href: "/compress-pdf" },
        { label: "重新排列", href: "/rearrange-pdf" },
        { label: "删除页面", href: "/remove-pages" },
        { label: "拆分PDF", href: "/split-pdf" },
      ],
    },
  ];

  const companyLinks = [
    { label: "关于我们", href: "/about" },
    { label: "联系我们", href: "/contact" },
    { label: "隐私政策", href: "/privacy" },
    { label: "使用条款", href: "/terms" },
  ];

  return (
    <footer className="bg-background text-foreground-muted border-t border-primary/20">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                📄
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold text-white">PDF 转换器</span>
                <p className="text-xs text-foreground-muted">免费在线工具</p>
              </div>
            </Link>
            <p className="text-foreground-muted mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base max-w-md">
              免费在线 PDF 转换工具，支持 PDF 与 Word、图片等多种格式互转。快速、安全、无需注册，让文档处理更简单。
            </p>

            <div className="flex space-x-3 sm:space-x-4">
              {/* GitHub */}
              <a
                href="https://github.com/sun-liang-rong"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="GitHub"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Email */}
              <a
                href="mailto:2531636478@qq.com"
                className="social-icon"
                title="邮箱"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {toolCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                {category.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-foreground-muted hover:text-primary-300 transition-colors text-xs sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">关于</h3>
            <ul className="space-y-2 sm:space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-muted hover:text-primary-300 transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 友情链接 */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-primary/10">
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">友情链接</h3>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {friendLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-lg text-xs sm:text-sm text-foreground-muted hover:text-primary-300 transition-all duration-300"
                title={link.description}
              >
                {link.label}
                <svg className="w-3 h-3 ml-1.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary/20">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 sm:space-y-4 md:space-y-0">
            <p className="text-foreground-muted text-xs sm:text-sm text-center md:text-left">
              © {currentYear} PDF 转换器. 保留所有权利。
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end space-x-3 sm:space-x-4 sm:space-x-6 text-xs sm:text-sm text-foreground-muted">
              <span className="flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-accent-emerald" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SSL 安全加密
              </span>
              <span className="flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                30 分钟自动删除
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
