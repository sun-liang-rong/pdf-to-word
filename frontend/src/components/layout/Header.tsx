"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface ToolItem {
  key: string;
  href: string;
  icon: string;
  title: string;
  desc: string;
  gradient: string;
}

interface ToolCategory {
  title: string;
  items: ToolItem[];
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAllToolsOpen, setIsAllToolsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const allToolsDropdown: ToolCategory[] = [
    {
      title: "热门工具",
      items: [
        { key: "pdfToWord", href: "/pdf-to-word", icon: "1", title: "PDF转Word", desc: "将PDF转换为可编辑Word", gradient: "from-primary-500 to-primary-600" },
        { key: "compressPdf", href: "/compress-pdf", icon: "2", title: "PDF压缩", desc: "减小PDF文件大小", gradient: "from-teal-500 to-accent-emerald" },
        { key: "mergePdf", href: "/merge-pdf", icon: "3", title: "PDF合并", desc: "合并多个PDF文件", gradient: "from-red-500 to-pink-500" },
        { key: "imageCompress", href: "/image-compress", icon: "4", title: "图片压缩", desc: "压缩图片文件", gradient: "from-emerald-500 to-teal-600" },
      ],
    },
    {
      title: "PDF工具",
      items: [
        { key: "pdfToWord", href: "/pdf-to-word", icon: "W", title: "PDF转Word", desc: "PDF转可编辑Word", gradient: "from-primary-500 to-primary-600" },
        { key: "wordToPdf", href: "/word-to-pdf", icon: "W", title: "Word转PDF", desc: "Word文档转PDF", gradient: "from-blue-500 to-cyan-500" },
        { key: "pdfToJpg", href: "/pdf-to-jpg", icon: "J", title: "PDF转JPG", desc: "PDF页面转图片", gradient: "from-accent-pink to-accent-cyan" },
        { key: "jpgToPdf", href: "/jpg-to-pdf", icon: "J", title: "JPG转PDF", desc: "图片合并为PDF", gradient: "from-orange-500 to-amber-500" },
        { key: "mergePdf", href: "/merge-pdf", icon: "📑", title: "PDF合并", desc: "合并PDF文件", gradient: "from-red-500 to-pink-500" },
        { key: "compressPdf", href: "/compress-pdf", icon: "📦", title: "PDF压缩", desc: "压缩PDF大小", gradient: "from-teal-500 to-accent-emerald" },
        { key: "rearrangePdf", href: "/rearrange-pdf", icon: "🔀", title: "重新排列", desc: "调整页面顺序", gradient: "from-indigo-500 to-primary-500" },
        { key: "removePages", href: "/remove-pages", icon: "✂️", title: "删除页面", desc: "删除PDF页面", gradient: "from-pink-500 to-rose-500" },
        { key: "splitPdf", href: "/split-pdf", icon: "📂", title: "拆分PDF", desc: "拆分PDF文件", gradient: "from-cyan-500 to-blue-500" },
      ],
    },
    {
      title: "图片工具",
      items: [
        { key: "imageCompress", href: "/image-compress", icon: "🖼️", title: "图片压缩", desc: "压缩图片", gradient: "from-emerald-500 to-teal-600" },
        { key: "imageWatermark", href: "/image-watermark", icon: "💧", title: "图片水印", desc: "添加水印", gradient: "from-blue-500 to-indigo-500" },
      ],
    },
  ];



  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-primary/20">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-xl shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-105">
              📄
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">PDF转换器</span>
              <span className="text-xs text-foreground-muted -mt-1">免费在线工具</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">

            <Link
              href="/blog"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/blog")
                  ? "text-primary-300 bg-primary/20"
                  : "text-foreground-muted hover:text-foreground hover:bg-primary/10"
              }`}
            >
              博客
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsAllToolsOpen(true)}
              onMouseLeave={() => setIsAllToolsOpen(false)}
            >
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  isAllToolsOpen
                    ? "text-primary-300 bg-primary/20"
                    : "text-foreground-muted hover:text-foreground hover:bg-primary/10"
                }`}
              >
                <span>全部工具</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isAllToolsOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isAllToolsOpen && (
                <>
                  <div className="absolute left-0 right-0 h-4 bg-transparent" />

                  <div className="fixed left-0 right-0 top-16 dropdown-menu animate-slide-down bg-surface/95 backdrop-blur-xl border-b border-primary/20 shadow-2xl">
                    <div
                      className="container mx-auto px-4 py-8"
                      onMouseEnter={() => setIsAllToolsOpen(true)}
                      onMouseLeave={() => setIsAllToolsOpen(false)}
                    >
                      <div className="flex justify-center gap-6">
                        {allToolsDropdown.map((category) => (
                          <div key={category.title} className="w-56">
                            <h3 className="text-sm font-bold text-primary-300 uppercase tracking-wider mb-4 pb-2 border-b border-primary/20">
                              {category.title}
                            </h3>

                            <ul className="space-y-2">
                              {category.items.map((tool) => (
                                <li key={tool.href}>
                                  <Link
                                    href={tool.href}
                                    onClick={() => setIsAllToolsOpen(false)}
                                    className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 group ${
                                      isActive(tool.href)
                                        ? "bg-primary/20 text-primary-300"
                                        : "hover:bg-white/5 text-foreground-muted hover:text-white"
                                    }`}
                                  >
                                    <div className={`w-8 h-8 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg`}>
                                      {tool.icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm truncate text-white group-hover:text-primary-300 transition-colors">
                                        {tool.title}
                                      </div>
                                      <div className="text-xs text-foreground-muted truncate">
                                        {tool.desc}
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />

            <Link
              href="/pdf-to-word"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-primary hover:shadow-primary-lg hover:scale-105"
            >
              立即转换
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-primary/20 mobile-menu animate-slide-down">
            <div className="max-h-[calc(100vh-64px)] overflow-y-auto py-4">
              <Link
                href="/blog"
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive("/blog")
                    ? "text-primary-300 bg-primary/20"
                    : "text-foreground-muted hover:text-foreground hover:bg-primary/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                博客
              </Link>

              {allToolsDropdown.map((category) => (
                <div key={category.title} className="mt-4">
                  <div className="px-4 py-2 text-xs font-bold text-primary-400 uppercase tracking-wider">
                    {category.title}
                  </div>
                  {category.items.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(tool.href)
                          ? "text-primary-300 bg-primary/20"
                          : "text-foreground-muted hover:text-foreground hover:bg-primary/10"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg`}>
                        {tool.icon}
                      </div>
                      <span className="font-medium">{tool.title}</span>
                    </Link>
                  ))}
                </div>
              ))}

              <div className="mt-4 px-4 pb-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 dark:bg-white/5 rounded-xl border border-primary/20">
                  <span className="text-sm text-foreground-muted">主题</span>
                  <ThemeToggle />
                </div>

                <Link
                  href="/pdf-to-word"
                  className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center px-5 py-3 rounded-xl font-medium shadow-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  立即转换
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
