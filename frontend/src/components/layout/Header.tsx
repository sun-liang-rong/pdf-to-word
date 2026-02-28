"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface ToolItem {
  label: string;
  href: string;
  icon: string;
  desc: string;
  color: string;
}

interface ToolCategory {
  title: string;
  items: ToolItem[];
}

const allToolsDropdown: ToolCategory[] = [
  {
    title: "转换为PDF",
    items: [
      { label: "Word转PDF", href: "/word-to-pdf", icon: "W", desc: "DOC/DOCX转PDF", color: "bg-blue-500" },
      { label: "JPG转PDF", href: "/jpg-to-pdf", icon: "J", desc: "图片合并为PDF", color: "bg-orange-500" },
    ],
  },
  {
    title: "从PDF转换",
    items: [
      { label: "PDF转Word", href: "/pdf-to-word", icon: "W", desc: "PDF转可编辑Word", color: "bg-blue-600" },
      { label: "PDF转JPG", href: "/pdf-to-jpg", icon: "J", desc: "PDF页面转图片", color: "bg-purple-500" },
    ],
  },
  {
    title: "PDF工具",
    items: [
      { label: "PDF合并", href: "/merge-pdf", icon: "📑", desc: "合并多个PDF", color: "bg-red-500" },
      { label: "PDF压缩", href: "/compress-pdf", icon: "📦", desc: "减小PDF大小", color: "bg-teal-500" },
      { label: "PDF排序", href: "/rearrange-pdf", icon: "🔀", desc: "调整页面顺序", color: "bg-indigo-500" },
      { label: "删除页面", href: "/remove-pages", icon: "✂️", desc: "删除指定页面", color: "bg-pink-500" },
      { label: "PDF拆分", href: "/split-pdf", icon: "📂", desc: "拆分为多个文件", color: "bg-cyan-500" },
    ],
  },
];

const navItems = [
  { label: "首页", href: "/" },
  { label: "PDF转Word", href: "/pdf-to-word" },
  { label: "Word转PDF", href: "/word-to-pdf" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAllToolsOpen, setIsAllToolsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
              📄
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                PDF转换器
              </span>
              <span className="text-xs text-gray-500 -mt-1">免费在线工具</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* All Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsAllToolsOpen(true)}
              onMouseLeave={() => setIsAllToolsOpen(false)}
            >
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  isAllToolsOpen
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                <span>所有PDF工具</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isAllToolsOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Large Dropdown Menu - Similar to Image 2 */}
              {isAllToolsOpen && (
                <>
                  {/* Invisible bridge to prevent mouseleave when moving to dropdown */}
                  <div className="absolute left-0 right-0 h-4 bg-transparent" />
                  
                  <div className="fixed left-0 right-0 top-16 bg-white border-b-2 border-gray-200 shadow-xl animate-slide-down">
                    <div 
                      className="container mx-auto px-4 py-8"
                      onMouseEnter={() => setIsAllToolsOpen(true)}
                      onMouseLeave={() => setIsAllToolsOpen(false)}
                    >
                      <div className="grid grid-cols-4 gap-8">
                        {allToolsDropdown.map((category) => (
                          <div key={category.title}>
                            {/* Category Title */}
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-100">
                              {category.title}
                            </h3>
                            
                            {/* Tools List */}
                            <ul className="space-y-3">
                              {category.items.map((tool) => (
                                <li key={tool.href}>
                                  <Link
                                    href={tool.href}
                                    onClick={() => setIsAllToolsOpen(false)}
                                    className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 group ${
                                      isActive(tool.href)
                                        ? "bg-primary-50 text-primary-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    {/* Icon */}
                                    <div className={`w-8 h-8 ${tool.color} rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                                      {tool.icon}
                                    </div>
                                    
                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm truncate">
                                        {tool.label}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {tool.desc}
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {/* Quick Links / Promo Column */}
                        <div className="border-l-2 border-gray-100 pl-8">
                          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-100">
                            热门工具
                          </h3>
                          <ul className="space-y-3">
                            <li>
                              <Link
                                href="/pdf-to-word"
                                onClick={() => setIsAllToolsOpen(false)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                  1
                                </div>
                                <div>
                                  <div className="font-medium text-sm text-gray-900">PDF转Word</div>
                                  <div className="text-xs text-gray-500">最常用转换</div>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/compress-pdf"
                                onClick={() => setIsAllToolsOpen(false)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                  2
                                </div>
                                <div>
                                  <div className="font-medium text-sm text-gray-900">PDF压缩</div>
                                  <div className="text-xs text-gray-500">减小文件大小</div>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/merge-pdf"
                                onClick={() => setIsAllToolsOpen(false)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                  3
                                </div>
                                <div>
                                  <div className="font-medium text-sm text-gray-900">PDF合并</div>
                                  <div className="text-xs text-gray-500">合并多个文件</div>
                                </div>
                              </Link>
                            </li>
                          </ul>

                          {/* CTA */}
                          <div className="mt-6 p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-100">
                            <p className="text-sm font-medium text-gray-900 mb-2">需要更多功能？</p>
                            <p className="text-xs text-gray-500 mb-3">所有工具完全免费使用</p>
                            <Link
                              href="/pdf-to-word"
                              onClick={() => setIsAllToolsOpen(false)}
                              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                              立即开始
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="/pdf-to-word"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-glow hover:scale-105"
            >
              开始转换
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-down">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive("/")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </Link>

            {allToolsDropdown.map((category) => (
              <div key={category.title} className="mt-4">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {category.title}
                </div>
                {category.items.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(tool.href)
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className={`w-8 h-8 ${tool.color} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                      {tool.icon}
                    </div>
                    <span className="font-medium">{tool.label}</span>
                  </Link>
                ))}
              </div>
            ))}

            <div className="mt-4 px-4">
              <Link
                href="/pdf-to-word"
                className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center px-5 py-3 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                开始转换
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
