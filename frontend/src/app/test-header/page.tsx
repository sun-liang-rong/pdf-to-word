"use client";

import { useState } from "react";

export default function TestHeader() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 模拟 Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <nav className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">PDF转换器</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-2">
              {/* 博客 */}
              <button className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
                博客
              </button>

              {/* 工具下拉 */}
              <div
                className="relative"
                onMouseEnter={() => setIsToolsOpen(true)}
                onMouseLeave={() => setIsToolsOpen(false)}
              >
                <button className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 ${
                  isToolsOpen
                    ? "text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg scale-105"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                }`}>
                  全部工具
                  <svg className={`w-4 h-4 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isToolsOpen && (
                  <div className="fixed left-0 right-0 top-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                    <div className="max-w-7xl mx-auto px-6 py-12">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {/* PDF工具 - 大卡片 */}
                        <div className="lg:col-span-2">
                          <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">PDF工具</h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { icon: "📄", title: "PDF转Word", desc: "PDF转可编辑Word" },
                              { icon: "📝", title: "Word转PDF", desc: "Word文档转PDF" },
                              { icon: "🖼️", title: "PDF转JPG", desc: "PDF页面转图片" },
                              { icon: "📷", title: "JPG转PDF", desc: "图片合并为PDF" },
                              { icon: "📑", title: "PDF合并", desc: "合并多个PDF" },
                              { icon: "📦", title: "PDF压缩", desc: "压缩PDF大小" }
                            ].map((tool, index) => (
                              <div key={index} className="group p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tool.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">{tool.desc}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 图片工具 - 小卡片 */}
                        <div>
                          <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">图片工具</h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-teal-600 rounded-full"></div>
                          </div>
                          <div className="space-y-3">
                            {[
                              { icon: "🖼️", title: "图片压缩", desc: "压缩图片大小" },
                              { icon: "💧", title: "图片水印", desc: "添加文字水印" }
                            ].map((tool, index) => (
                              <div key={index} className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:from-green-50 hover:to-teal-50 dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700 transition-all duration-300 hover:shadow-lg hover:translate-x-1 cursor-pointer">
                                <span className="text-xl group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{tool.title}</div>
                                  <div className="text-xs text-gray-500">{tool.desc}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 快速访问 */}
                        <div className="md:col-span-2 lg:col-span-1">
                          <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">热门推荐</h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                          </div>
                          <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border border-orange-200 dark:border-orange-700">
                              <div className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-1">最受欢迎</div>
                              <div className="text-sm font-bold text-orange-900 dark:text-orange-100">PDF转Word</div>
                              <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">每日处理超过10万份文档</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-blue-700">
                              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">极速转换</div>
                              <div className="text-sm font-bold text-blue-900 dark:text-blue-100">在线压缩</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">3秒完成超大文件压缩</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 border border-emerald-200 dark:border-emerald-700">
                              <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">AI识别</div>
                              <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">OCR扫描件</div>
                              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">智能识别表格与图片</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 开始转换按钮 */}
              <button className="ml-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                立即使用
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* 内容区域 */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            测试新 Header 设计
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            将鼠标悬停在"全部工具"上查看效果
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              新设计特性
            </h2>
            <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
              <li>✨ Bento 网格布局</li>
              <li>🎨 玻璃拟态效果</li>
              <li>🌈 渐变色彩系统</li>
              <li>⚡ 流畅动画过渡</li>
              <li>🌙 完美的暗色模式支持</li>
              <li>📱 响应式设计</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}