"use client";

import Link from "next/link";

const toolCategories = [
  {
    title: "转换为 PDF",
    links: [
      { label: "Word 转 PDF", href: "/word-to-pdf" },
      { label: "JPG 转 PDF", href: "/jpg-to-pdf" },
    ],
  },
  {
    title: "从 PDF 转换",
    links: [
      { label: "PDF 转 Word", href: "/pdf-to-word" },
      { label: "PDF 转 JPG", href: "/pdf-to-jpg" },
    ],
  },
  {
    title: "PDF 工具",
    links: [
      { label: "PDF 合并", href: "/merge-pdf" },
      { label: "PDF 压缩", href: "/compress-pdf" },
      { label: "PDF 排序", href: "/rearrange-pdf" },
      { label: "删除页面", href: "/remove-pages" },
      { label: "PDF 拆分", href: "/split-pdf" },
    ],
  },
];

const companyLinks = [
  { label: "关于我们", href: "/about" },
  { label: "联系我们", href: "/contact" },
  { label: "隐私政策", href: "/privacy" },
  { label: "服务条款", href: "/terms" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground-muted border-t border-primary/20">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
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
              免费在线 PDF 转换工具，支持 PDF 与 Word、图片等多种格式互转。
              快速、安全、无需注册，让文档处理更简单。
            </p>
            
            <div className="flex space-x-3 sm:space-x-4">
              {["twitter", "github", "mail"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="social-icon"
                >
                  {social === "twitter" && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  )}
                  {social === "github" && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  )}
                  {social === "mail" && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {toolCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{category.title}</h3>
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
                <li key={link.label}>
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
      </div>

      <div className="border-t border-primary/20">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 sm:space-y-4 md:space-y-0">
            <p className="text-foreground-muted text-xs sm:text-sm text-center md:text-left">
              © {currentYear} PDF 转换器。保留所有权利.
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
