import Link from 'next/link';
import { Metadata } from 'next';
import { AccordionGroup } from '@/components/ui/Accordion';

export const metadata: Metadata = {
  title: "PDF转换器 - 免费在线PDF转Word、Word转PDF工具",
  description: "免费在线PDF转换工具，支持PDF转Word、Word转PDF、PDF转JPG、JPG转PDF等多种格式转换，快速、安全、无需注册。",
};

// PDF 工具
const pdfTools = [
  {
    title: "PDF转Word",
    description: "将PDF文件转换为可编辑的Word文档，保留原有格式和排版",
    href: "/pdf-to-word",
    icon: "📄",
    gradient: "from-primary-500 to-primary-600",
  },
  {
    title: "Word转PDF",
    description: "将Word文档转换为PDF格式，确保文档格式不被篡改",
    href: "/word-to-pdf",
    icon: "📝",
    gradient: "from-accent-emerald to-teal-500",
  },
  {
    title: "PDF转JPG",
    description: "将PDF文件的每一页转换为高清JPG图片",
    href: "/pdf-to-jpg",
    icon: "🖼️",
    gradient: "from-accent-pink to-accent-cyan",
  },
  {
    title: "JPG转PDF",
    description: "将多张JPG/PNG图片合并转换为单个PDF文件",
    href: "/jpg-to-pdf",
    icon: "📷",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    title: "PDF合并",
    description: "将多个PDF文件合并为一个，支持拖拽排序",
    href: "/merge-pdf",
    icon: "📑",
    gradient: "from-red-500 to-pink-500",
  },
  {
    title: "PDF压缩",
    description: "智能压缩PDF文件大小，保持清晰度便于分享",
    href: "/compress-pdf",
    icon: "📦",
    gradient: "from-teal-500 to-accent-cyan",
  },
  {
    title: "PDF删除页面",
    description: "可视化删除PDF中的指定页面，操作简单直观",
    href: "/remove-pages",
    icon: "✂️",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "PDF排序",
    description: "拖拽调整PDF页面顺序，实时预览调整结果",
    href: "/rearrange-pdf",
    icon: "🔀",
    gradient: "from-indigo-500 to-primary-500",
  },
];

// 图片工具
const imageTools = [
  {
    title: "图片压缩",
    description: "智能压缩图片大小，支持JPG、PNG、WebP格式",
    href: "/image-compress",
    icon: "🖼️",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "图片加水印",
    description: "为图片添加文字水印，支持自定义样式和位置",
    href: "/image-watermark",
    icon: "💧",
    gradient: "from-blue-500 to-indigo-600",
  },
];

// 热门工具
const popularTools = [
  {
    title: "PDF转Word",
    description: "最热门的PDF转换工具",
    href: "/pdf-to-word",
    icon: "📄",
    gradient: "from-primary-500 to-primary-600",
    rank: 1,
  },
  {
    title: "PDF压缩",
    description: "减小PDF文件大小",
    href: "/compress-pdf",
    icon: "📦",
    gradient: "from-teal-500 to-accent-emerald",
    rank: 2,
  },
  {
    title: "PDF合并",
    description: "合并多个PDF文件",
    href: "/merge-pdf",
    icon: "📑",
    gradient: "from-red-500 to-pink-500",
    rank: 3,
  },
  {
    title: "图片压缩",
    description: "压缩图片文件",
    href: "/image-compress",
    icon: "🖼️",
    gradient: "from-emerald-500 to-teal-600",
    rank: 4,
  },
];

const features = [
  {
    title: "完全免费",
    description: "所有转换功能完全免费使用，无需注册账号，无隐藏费用",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "极速转换",
    description: "采用高性能转换引擎，10MB文件15秒内完成转换",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "安全可靠",
    description: "文件30分钟后自动删除，采用SSL加密传输，不存储任何数据",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "简单易用",
    description: "无需下载安装软件，拖拽上传即可转换，支持所有主流浏览器",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "PDF转换器支持哪些格式转换？",
    answer: "目前支持PDF转Word、Word转PDF、PDF转JPG、JPG转PDF等常用格式转换，以及PDF合并、压缩、删除页面等编辑功能。",
  },
  {
    question: "转换后的文件质量如何？",
    answer: "我们使用专业的转换引擎，最大程度保留原文档的格式、图片和排版。对于扫描版PDF，还支持OCR文字识别。",
  },
  {
    question: "上传的文件安全吗？",
    answer: "您的文件安全是我们的首要任务。所有上传的文件会在30分钟后自动删除，采用SSL加密传输，我们不会存储或分享您的任何文件。",
  },
  {
    question: "文件大小有限制吗？",
    answer: "单个文件大小限制为20MB，足以满足大多数日常文档转换需求。如需处理更大文件，建议先进行PDF压缩。",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 tech-grid opacity-30" />
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-8 animate-fade-in backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-accent-emerald mr-2 animate-pulse"></span>
              <span className="text-sm text-foreground-muted">免费使用，无需注册</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              免费在线
              <span className="gradient-text-hero"> PDF转换工具 </span>
            </h1>

            <p className="text-lg md:text-xl text-foreground-muted mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              快速、安全、免费的PDF转换服务。支持PDF与Word、图片等多种格式互转，
              以及合并、压缩、编辑等多种功能。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-2">
              <Link
                href="/pdf-to-word"
                className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-primary hover:shadow-primary-lg hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>立即开始转换</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#tools"
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 border border-white/10 hover:border-primary/30 flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <span>查看所有工具</span>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up stagger-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-foreground-muted mt-1">免费使用</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">20MB</div>
                <div className="text-sm text-foreground-muted mt-1">单文件上限</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">8+</div>
                <div className="text-sm text-foreground-muted mt-1">转换工具</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 热门工具 */}
      <section className="py-16 section-gradient">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-pink rounded-full mr-4"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              🔥 热门工具
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTools.map((tool, index) => (
              <div key={tool.href} className="relative" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="absolute -top-2 -left-2 z-20">
                  <span className="bg-gradient-to-r from-primary-500 to-accent-pink text-white text-xs font-bold w-7 h-7 rounded-full shadow-glow flex items-center justify-center">
                    {tool.rank}
                  </span>
                </div>
                <Link
                  href={tool.href}
                  className="tool-card group h-full block"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="mt-4 flex items-center text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>开始使用</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PDF 工具 */}
      <section id="tools" className="py-16 section-gradient">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-cyan rounded-full mr-4"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              📄 PDF 工具
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pdfTools.map((tool, index) => (
              <div key={tool.href} style={{ animationDelay: `${index * 0.05}s` }}>
                <Link
                  href={tool.href}
                  className="tool-card group h-full block"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="mt-4 flex items-center text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>开始使用</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 图片工具 */}
      <section className="py-16 section-gradient">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-4"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              🖼️ 图片工具
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {imageTools.map((tool, index) => (
              <div key={tool.href} style={{ animationDelay: `${index * 0.05}s` }}>
                <Link
                  href={tool.href}
                  className="tool-card group h-full block"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="mt-4 flex items-center text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>开始使用</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              为什么选择我们
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              我们致力于提供最优质的PDF转换体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-2xl flex items-center justify-center text-primary-400 mx-auto mb-5 border border-primary/20">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              简单三步，快速转换
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              无需复杂操作，轻松完成PDF转换
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

              {[
                { step: 1, title: "上传文件", desc: "拖拽或点击上传您的PDF文件，支持最大20MB" },
                { step: 2, title: "自动转换", desc: "系统自动识别并开始转换，无需额外操作" },
                { step: 3, title: "下载文件", desc: "转换完成后，点击下载按钮获取转换后的文件" },
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-glow relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-foreground-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">常见问题</h2>
            <p className="text-lg text-foreground-muted">找不到答案？欢迎联系我们</p>
          </div>

          <AccordionGroup
            items={faqs.map((faq) => ({
              title: faq.question,
              content: faq.answer,
            }))}
            size="md"
          />
        </div>
      </section>

      <section className="py-20 cta-section relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              准备好开始转换了吗？
            </h2>
            <p className="text-xl text-foreground-muted mb-10">
              立即体验免费、快速、安全的PDF转换服务
            </p>
            <Link
              href="/pdf-to-word"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:bg-primary-50"
            >
              <span>免费开始使用</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
