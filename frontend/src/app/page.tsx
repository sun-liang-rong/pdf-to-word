'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ToolItem {
  key: string;
  href: string;
  icon: string;
  gradient: string;
  title: string;
  description: string;
}

interface FeatureItem {
  key: string;
  icon: string;
  title: string;
  description: string;
}

// 浮动装饰元素 - 使用 CSS 变量适配主题
function FloatingIcon({ icon, className, delay }: { icon: string; className: string; delay: number }) {
  return (
    <div
      className={`absolute ${className} floating-icon`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 shadow-2xl flex items-center justify-center text-3xl md:text-4xl">
        {icon}
      </div>
    </div>
  );
}

// 粒子背景组件
function ParticleBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 渐变背景 */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-primary-900/20 via-background to-background' 
          : 'bg-gradient-to-br from-primary-50 via-white to-accent-cyan/5'
      }`} />

      {/* 网格背景 */}
      <div 
        className={`absolute inset-0 bg-[url('/grid.svg')] transition-opacity duration-500 ${
          isDark ? 'opacity-20' : 'opacity-30'
        }`} 
      />

      {/* 光晕效果 - 暗色模式更明显，亮色模式更柔和 */}
      <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] transition-all duration-500 ${
        isDark ? 'bg-primary-500/20' : 'bg-primary-400/10'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] transition-all duration-500 ${
        isDark ? 'bg-accent-cyan/10' : 'bg-accent-cyan/5'
      }`} />

      {/* 浮动图标 */}
      <FloatingIcon icon="📄" className="top-[15%] left-[8%] w-16 h-16 md:w-20 md:h-20" delay={0} />
      <FloatingIcon icon="📝" className="top-[20%] right-[12%] w-14 h-14 md:w-18 md:h-18" delay={0.5} />
      <FloatingIcon icon="🖼️" className="top-[60%] left-[5%] w-12 h-12 md:w-16 md:h-16" delay={1} />
      <FloatingIcon icon="📷" className="top-[65%] right-[8%] w-14 h-14 md:w-18 md:h-18" delay={1.5} />
      <FloatingIcon icon="📑" className="top-[40%] left-[3%] w-10 h-10 md:w-14 md:h-14" delay={2} />
      <FloatingIcon icon="📦" className="top-[50%] right-[5%] w-12 h-12 md:w-16 md:h-16" delay={2.5} />
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
    { key: "pdfToWord", href: "/pdf-to-word", icon: "📄", gradient: "from-primary-500 to-primary-600", title: "PDF转Word", description: "将PDF文件转换为可编辑的Word文档" },
    { key: "wordToPdf", href: "/word-to-pdf", icon: "📝", gradient: "from-emerald-500 to-teal-500", title: "Word转PDF", description: "将Word文档转换为PDF格式" },
    { key: "pdfToJpg", href: "/pdf-to-jpg", icon: "🖼️", gradient: "from-pink-500 to-cyan-500", title: "PDF转JPG", description: "将PDF页面转换为图片" },
    { key: "jpgToPdf", href: "/jpg-to-pdf", icon: "📷", gradient: "from-orange-500 to-amber-500", title: "JPG转PDF", description: "将图片合并为PDF文件" },
    { key: "mergePdf", href: "/merge-pdf", icon: "📑", gradient: "from-red-500 to-pink-500", title: "PDF合并", description: "将多个PDF文件合并为一个" },
    { key: "compressPdf", href: "/compress-pdf", icon: "📦", gradient: "from-teal-500 to-cyan-500", title: "PDF压缩", description: "减小PDF文件大小" },
    { key: "removePages", href: "/remove-pages", icon: "✂️", gradient: "from-pink-500 to-rose-500", title: "删除页面", description: "从PDF中删除指定页面" },
    { key: "rearrangePdf", href: "/rearrange-pdf", icon: "🔀", gradient: "from-indigo-500 to-primary-500", title: "重新排列", description: "调整PDF页面顺序" },
  ];

  const imageTools: ToolItem[] = [
    { key: "imageCompress", href: "/image-compress", icon: "🖼️", gradient: "from-emerald-500 to-teal-600", title: "图片压缩", description: "减小图片文件大小" },
    { key: "imageWatermark", href: "/image-watermark", icon: "💧", gradient: "from-blue-500 to-indigo-600", title: "图片水印", description: "为图片添加水印" },
  ];

  const features: FeatureItem[] = [
    { key: "free", icon: "🆓", title: "完全免费", description: "所有功能均可免费使用，无需注册" },
    { key: "security", icon: "🔒", title: "安全可靠", description: "文件处理后在服务器上删除" },
    { key: "fast", icon: "⚡", title: "极速转换", description: "高效的转换引擎，快速完成" },
    { key: "easy", icon: "👆", title: "简单易用", description: "拖拽上传，一键转换" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - 专业 UI/UX 设计 */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <ParticleBackground />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* 徽章 - 适配双主题 */}
            <div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 animate-fade-in-up border"
              style={{ 
                animationDelay: '0s',
                backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.05)',
                borderColor: isDark ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.2)'
              }}
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-sm font-medium ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
                100% 免费 · 无需注册 · 安全可靠
              </span>
            </div>

            {/* 主标题 - 双主题渐变 */}
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <span className={`bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-gradient-to-r from-white via-primary-200 to-primary-400'
                  : 'bg-gradient-to-r from-gray-900 via-primary-700 to-primary-500'
              }`}>
                PDF转换
              </span>
              <br />
              <span className={`bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-primary-400 via-accent-cyan to-primary-300'
                  : 'bg-gradient-to-r from-primary-500 via-cyan-600 to-primary-600'
              }`}>
                如此简单
              </span>
            </h1>

            {/* 副标题 - 双主题文字颜色 */}
            <p 
              className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
              style={{ animationDelay: '0.2s' }}
            >
              支持 <span className={`font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>PDF</span>、
              <span className={`font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Word</span>、
              <span className={`font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>JPG</span> 等格式互转
              <br className="hidden md:block" />
              完全免费，无需注册，即开即用
            </p>

            {/* CTA 按钮组 - 双主题样式 */}
            <div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              {/* 主按钮 */}
              <Link
                href="/pdf-to-word"
                className={`group relative w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white shadow-xl shadow-primary-500/20'
                } hover:scale-105 hover:shadow-2xl`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span>立即开始转换</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* 次要按钮 - 双主题 */}
              <Link
                href="#tools"
                className={`w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-semibold border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                  isDark
                    ? 'border-primary/30 hover:border-primary/60 text-gray-300 hover:text-white hover:bg-primary/10'
                    : 'border-primary/20 hover:border-primary/40 text-gray-700 hover:text-primary-700 hover:bg-primary/5'
                }`}
              >
                <span>浏览全部工具</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* 信任指标 - 双主题 */}
            <div 
              className={`mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10 animate-fade-in-up ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
              style={{ animationDelay: '0.4s' }}
            >
              {[
                { icon: '✓', text: '免费使用' },
                { icon: '✓', text: '无需注册' },
                { icon: '✓', text: '安全加密' },
                { icon: '✓', text: '极速转换' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部渐变过渡 - 双主题 */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 ${
          isDark 
            ? 'bg-gradient-to-t from-[#0B1120] to-transparent'
            : 'bg-gradient-to-t from-white to-transparent'
        }`} />
      </section>

      {/* Tools Section - 双主题卡片 */}
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
                      ? 'bg-[#1A1F35] border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10'
                      : 'bg-white border-gray-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5'
                  }`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h4 className={`text-lg font-semibold mb-2 group-hover:text-primary-500 transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
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
                      ? 'bg-[#1A1F35] border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10'
                      : 'bg-white border-gray-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5'
                  }`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h4 className={`text-lg font-semibold mb-2 group-hover:text-primary-500 transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
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

      {/* Features Section - 双主题 */}
      <section className={`py-20 ${isDark ? 'bg-primary/5' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              为什么选择我们
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.key} 
                className={`text-center p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#1A1F35] border-primary/10 hover:border-primary/30'
                    : 'bg-white border-gray-200 hover:border-primary/30 hover:shadow-lg'
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
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

      {/* FAQ Section - 双主题 */}
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
              <div 
                key={index}
                className={`rounded-xl border p-6 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#1A1F35] border-primary/10 hover:border-primary/30'
                    : 'bg-white border-gray-200 hover:border-primary/30 hover:shadow-md'
                }`}
              >
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
