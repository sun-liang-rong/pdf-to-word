'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ToolItem {
  href: string;
  icon: string;
  gradient: string;
  title: string;
  description: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  color: string;
}

// 浮动装饰元素
function FloatingIcon({ icon, className, delay }: { icon: string; className: string; delay: number }) {
  return (
    <div
      className={`absolute ${className} floating-icon opacity-60 hover:opacity-100 transition-opacity duration-300`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center text-3xl md:text-4xl hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : true;

  const pdfTools: ToolItem[] = [
    { href: "/pdf-to-word", icon: "📄", gradient: "from-purple-500 to-indigo-600", title: "PDF转Word", description: "将PDF文件转换为可编辑的Word文档" },
    { href: "/word-to-pdf", icon: "📝", gradient: "from-emerald-500 to-teal-500", title: "Word转PDF", description: "将Word文档转换为PDF格式" },
    { href: "/pdf-to-jpg", icon: "🖼️", gradient: "from-pink-500 to-rose-500", title: "PDF转JPG", description: "将PDF页面转换为图片" },
    { href: "/jpg-to-pdf", icon: "📷", gradient: "from-orange-500 to-amber-500", title: "JPG转PDF", description: "将图片合并为PDF文件" },
    { href: "/merge-pdf", icon: "📑", gradient: "from-red-500 to-pink-500", title: "PDF合并", description: "将多个PDF文件合并为一个" },
    { href: "/compress-pdf", icon: "📦", gradient: "from-teal-500 to-cyan-500", title: "PDF压缩", description: "减小PDF文件大小" },
    { href: "/remove-pages", icon: "✂️", gradient: "from-pink-500 to-rose-500", title: "删除页面", description: "从PDF中删除指定页面" },
    { href: "/rearrange-pdf", icon: "🔀", gradient: "from-indigo-500 to-purple-500", title: "重新排列", description: "调整PDF页面顺序" },
  ];

  const imageTools: ToolItem[] = [
    { href: "/image-compress", icon: "🖼️", gradient: "from-emerald-500 to-teal-600", title: "图片压缩", description: "减小图片文件大小" },
    { href: "/image-watermark", icon: "💧", gradient: "from-blue-500 to-indigo-600", title: "图片水印", description: "为图片添加水印" },
  ];

  const features: FeatureItem[] = [
    { icon: "🆓", title: "完全免费", description: "所有功能均可免费使用，无需注册", color: "emerald" },
    { icon: "🔒", title: "安全可靠", description: "文件处理后在服务器上删除", color: "blue" },
    { icon: "⚡", title: "极速转换", description: "高效的转换引擎，快速完成", color: "purple" },
    { icon: "👆", title: "简单易用", description: "拖拽上传，一键转换", color: "orange" },
  ];

  const stats = [
    { number: "10万+", label: "累计用户" },
    { number: "50万+", label: "文件转换" },
    { number: "99.9%", label: "可用性" },
    { number: "0", label: "广告干扰" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - 全新视觉设计 */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 多层背景 */}
        <div className={`absolute inset-0 ${isDark ? 'bg-[#0a0f1c]' : 'bg-gradient-to-br from-slate-50 via-white to-purple-50'}`} />
        
        {/* 网格背景 */}
        <div className={`absolute inset-0 bg-[url('/grid.svg')] opacity-[0.15] ${isDark ? 'invert' : ''}`} />

        {/* 动态光晕 */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* 浮动装饰图标 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingIcon icon="📄" className="top-[12%] left-[6%] w-14 h-14 md:w-18 md:h-18" delay={0} />
          <FloatingIcon icon="📝" className="top-[22%] right-[8%] w-12 h-12 md:w-16 md:h-16" delay={0.5} />
          <FloatingIcon icon="🖼️" className="top-[65%] left-[5%] w-11 h-11 md:w-14 md:h-14" delay={1} />
          <FloatingIcon icon="📷" className="top-[70%] right-[6%] w-12 h-12 md:w-16 md:h-16" delay={1.5} />
          <FloatingIcon icon="📑" className="top-[42%] left-[3%] w-10 h-10 md:w-12 md:h-12" delay={2} />
          <FloatingIcon icon="📦" className="top-[52%] right-[4%] w-11 h-11 md:w-14 md:h-14" delay={2.5} />
        </div>

        {/* 主内容区 */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            {/* 顶部徽章 */}
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border mb-10 animate-fade-in-up bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                100% 免费 · 无需注册 · 安全可靠
              </span>
            </div>

            {/* 主标题 - 超大字体 + 渐变 */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                PDF转换
              </span>
              <span className="block mt-2 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                如此简单
              </span>
            </h1>

            {/* 副标题 */}
            <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ animationDelay: '0.2s' }}>
              支持 <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>PDF</span>、
              <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Word</span>、
              <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>JPG</span> 等格式互转
              <br className="hidden md:block" />
              完全免费，无需注册，即开即用
            </p>

            {/* CTA 按钮组 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {/* 主按钮 */}
              <Link
                href="/pdf-to-word"
                className="group relative w-full sm:w-auto px-12 py-6 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02] flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span>立即开始转换</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* 次要按钮 */}
              <Link
                href="#tools"
                className={`w-full sm:w-auto px-10 py-6 rounded-2xl text-lg font-semibold border-2 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] ${
                  isDark
                    ? 'border-gray-600 text-gray-300 hover:text-white hover:border-purple-500 hover:bg-purple-500/10'
                    : 'border-gray-300 text-gray-700 hover:text-purple-600 hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                <span>浏览全部工具</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* 数据统计 - 新增 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {stats.map((stat, index) => (
                <div key={index} className={`flex flex-col items-center p-6 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/60 border-gray-200'}`}>
                  <span className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.color === 'emerald' ? 'from-emerald-400 to-emerald-600' : stat.color === 'blue' ? 'from-blue-400 to-blue-600' : stat.color === 'purple' ? 'from-purple-400 to-purple-600' : 'from-orange-400 to-orange-600'} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </span>
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部渐变过渡 */}
        <div className={`absolute bottom-0 left-0 right-0 h-40 ${isDark ? 'bg-gradient-to-t from-[#0a0f1c] to-transparent' : 'bg-gradient-to-t from-white to-transparent'}`} />
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              工具箱
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              我们提供的所有工具
            </p>
          </div>

          {/* PDF Tools */}
          <div className="mb-16">
            <h3 className={`text-xl font-semibold mb-6 flex items-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <span className="mr-2">PDF工具</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pdfTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                    isDark
                      ? 'bg-[#121826] border-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10'
                      : 'bg-white border-gray-200 hover:border-purple-400 hover:shadow-xl'
                  }`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {tool.title}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Image Tools */}
          <div>
            <h3 className={`text-xl font-semibold mb-6 flex items-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <span className="mr-2">图片工具</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {imageTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                    isDark
                      ? 'bg-[#121826] border-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10'
                      : 'bg-white border-gray-200 hover:border-purple-400 hover:shadow-xl'
                  }`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {tool.title}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              为什么选择我们
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.key} className="text-center p-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              常见问题
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: '使用PDF转换工具需要付费吗？', a: '完全免费！我们的所有PDF转换工具都可以免费使用，无需注册或订阅。' },
              { q: '我的文件安全吗？', a: '绝对安全。所有文件处理都在加密连接下进行，转换完成后会立即从服务器删除，我们不会保留您的任何文件。' },
              { q: '支持哪些文件格式？', a: '我们支持PDF、Word（DOC/DOCX）、JPG/PNG图片等多种格式之间的相互转换。' },
              { q: '转换后的文件质量如何？', a: '我们使用先进的转换技术，确保转换后的文件保持原始格式和布局，尽可能减少失真。' },
            ].map((faq, index) => (
              <div key={index} className={`rounded-xl border p-6 transition-all duration-300 ${isDark ? 'bg-[#121826] border-gray-800 hover:border-purple-500/50' : 'bg-white border-gray-200 hover:border-purple-400 hover:shadow-md'}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {faq.q}
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
