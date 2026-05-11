"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const navLinks = [
    { href: "/blog", label: "博客" },
  ];

  const pdfTools = [
    { href: "/pdf-to-word", icon: "📄", title: "PDF转Word", desc: "PDF转可编辑Word" },
    { href: "/word-to-pdf", icon: "📝", title: "Word转PDF", desc: "Word文档转PDF" },
    { href: "/pdf-to-jpg", icon: "🖼️", title: "PDF转JPG", desc: "PDF页面转图片" },
    { href: "/jpg-to-pdf", icon: "📷", title: "JPG转PDF", desc: "图片合并为PDF" },
    { href: "/merge-pdf", icon: "📑", title: "PDF合并", desc: "合并多个PDF" },
    { href: "/compress-pdf", icon: "📦", title: "PDF压缩", desc: "压缩PDF大小" },
    { href: "/remove-pages", icon: "✂️", title: "删除页面", desc: "删除指定页面" },
    { href: "/split-pdf", icon: "📂", title: "拆分PDF", desc: "拆分为多文件" },
    { href: "/rearrange-pdf", icon: "🔀", title: "重新排列", desc: "调整页面顺序" },
  ];

  const imageTools = [
    { href: "/image-compress", icon: "🖼️", title: "图片压缩", desc: "压缩图片大小" },
    { href: "/image-watermark", icon: "💧", title: "图片水印", desc: "添加文字水印" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900">PDF转换器</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* 博客 */}
            <Link
              href="/blog"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isActive("/blog")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              博客
            </Link>

            {/* 工具下拉 */}
            <div
              className="relative"
              onMouseEnter={() => setIsToolsOpen(true)}
              onMouseLeave={() => setIsToolsOpen(false)}
            >
              <button className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                isToolsOpen ? "text-primary-600 bg-primary-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}>
                全部工具
                <svg className={`w-3.5 h-3.5 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isToolsOpen && (
                <>
                  <div className="absolute left-0 right-0 h-2 bg-transparent" />
                  <div className="fixed left-0 right-0 top-14 bg-white border-b border-gray-100 shadow-lg">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                      <div className="grid grid-cols-4 gap-8">
                        {/* PDF工具 */}
                        <div>
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">PDF工具</h3>
                          <ul className="space-y-0.5">
                            {pdfTools.map((tool) => (
                              <li key={tool.href}>
                                <Link
                                  href={tool.href}
                                  onClick={() => setIsToolsOpen(false)}
                                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors group"
                                >
                                  <span className="text-sm">{tool.icon}</span>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 group-hover:text-primary-600">{tool.title}</div>
                                    <div className="text-xs text-gray-400">{tool.desc}</div>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 图片工具 */}
                        <div>
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">图片工具</h3>
                          <ul className="space-y-0.5">
                            {imageTools.map((tool) => (
                              <li key={tool.href}>
                                <Link
                                  href={tool.href}
                                  onClick={() => setIsToolsOpen(false)}
                                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors group"
                                >
                                  <span className="text-sm">{tool.icon}</span>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 group-hover:text-primary-600">{tool.title}</div>
                                    <div className="text-xs text-gray-400">{tool.desc}</div>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 热门推荐 */}
                        <div className="col-span-2">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">热门推荐</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {pdfTools.slice(0, 4).map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                onClick={() => setIsToolsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors group"
                              >
                                <span className="text-lg">{tool.icon}</span>
                                <div>
                                  <div className="text-sm font-medium text-gray-700 group-hover:text-primary-600">{tool.title}</div>
                                  <div className="text-xs text-gray-400">{tool.desc}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 主题切换 */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {/* 开始转换按钮 */}
            <Link
              href="/pdf-to-word"
              className="ml-2 px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              开始转换
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white py-3">
            <div className="space-y-1">
              {/* 博客 */}
              <Link
                href="/blog"
                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                  isActive("/blog") ? "text-primary-600 bg-primary-50" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                博客
              </Link>

              {/* PDF工具 */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">PDF工具</div>
                {pdfTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md ${
                      isActive(tool.href) ? "text-primary-600 bg-primary-50" : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.title}</span>
                  </Link>
                ))}
              </div>

              {/* 图片工具 */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">图片工具</div>
                {imageTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md ${
                      isActive(tool.href) ? "text-primary-600 bg-primary-50" : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.title}</span>
                  </Link>
                ))}
              </div>

              {/* 主题和按钮 */}
              <div className="pt-3 px-3 space-y-2 border-t border-gray-100 mt-2">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-500">主题</span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/pdf-to-word"
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  开始转换
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
