import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于我们 - PDF转换器",
  description: "PDF转换器致力于提供最优质的在线PDF转换服务。完全免费、无需注册、安全可靠，让文档处理更简单。",
  keywords: "关于PDF转换器,PDF工具,在线PDF服务,免费PDF转换",
  alternates: {
    canonical: "https://sunsunblog.top/about",
  },
  openGraph: {
    title: "关于我们 - PDF转换器",
    description: "PDF转换器致力于提供最优质的在线PDF转换服务",
    type: "website",
    url: "https://sunsunblog.top/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-20">
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">📄</span>
              <span className="text-primary-300">关于我们</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              让 PDF 处理更简单
            </h1>
            <p className="text-lg text-foreground-muted leading-relaxed">
              我们致力于为用户提供最优质的在线 PDF 转换服务，完全免费、无需注册、安全可靠。
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">我们的使命</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-dark rounded-2xl p-8 border border-primary/20">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-pink/20 to-accent-cyan/20 rounded-xl flex items-center justify-center mb-6 border border-accent-pink/20">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">简单易用</h3>
                <p className="text-foreground-muted leading-relaxed">
                  我们相信工具应该简单直观。无需复杂的学习过程，拖拽上传即可完成转换。支持所有主流浏览器，随时随地使用。
                </p>
              </div>
              
              <div className="card-dark rounded-2xl p-8 border border-primary/20">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-pink/20 to-accent-cyan/20 rounded-xl flex items-center justify-center mb-6 border border-accent-cyan/20">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">安全可靠</h3>
                <p className="text-foreground-muted leading-relaxed">
                  您的文件安全是我们的首要任务。所有上传的文件会在 30 分钟后自动删除，采用 SSL 加密传输，我们不会存储或分享您的任何文件。
                </p>
              </div>
              
              <div className="card-dark rounded-2xl p-8 border border-primary/20">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-pink/20 to-accent-cyan/20 rounded-xl flex items-center justify-center mb-6 border border-accent-emerald/20">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">完全免费</h3>
                <p className="text-foreground-muted leading-relaxed">
                  所有转换功能完全免费使用，无需注册账号，无隐藏费用，无水印。我们相信每个人都应该能够轻松处理文档。
                </p>
              </div>
              
              <div className="card-dark rounded-2xl p-8 border border-primary/20">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-pink/20 to-accent-cyan/20 rounded-xl flex items-center justify-center mb-6 border border-accent-yellow/20">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">极速转换</h3>
                <p className="text-foreground-muted leading-relaxed">
                  采用高性能转换引擎，10MB 文件 15 秒内完成转换。支持 PDF 与 Word、图片等多种格式互转，以及合并、压缩、编辑等功能。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">技术栈</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Next.js", icon: "▲", desc: "React 框架" },
                { name: "TailwindCSS", icon: "🎨", desc: "CSS 框架" },
                { name: "NestJS", icon: "🦁", desc: "后端框架" },
                { name: "LibreOffice", icon: "📄", desc: "转换引擎" },
              ].map((tech) => (
                <div key={tech.name} className="card-dark rounded-xl p-6 text-center border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="text-3xl mb-3">{tech.icon}</div>
                  <h3 className="font-bold text-white mb-2">{tech.name}</h3>
                  <p className="text-xs text-foreground-muted">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">开源项目</h2>
            <p className="text-foreground-muted mb-8">
              我们感谢以下开源项目，它们是我们服务的重要组成部分：
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://github.com/Stirling-Tools/Stirling-PDF"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm text-foreground-muted hover:bg-primary/10 hover:border-primary/40 transition-all"
              >
                Stirling-PDF
                <svg className="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm text-foreground-muted hover:bg-primary/10 hover:border-primary/40 transition-all"
              >
                Next.js
                <svg className="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm text-foreground-muted hover:bg-primary/10 hover:border-primary/40 transition-all"
              >
                TailwindCSS
                <svg className="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500/10 to-primary-700/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">准备好开始了吗？</h2>
          <p className="text-foreground-muted mb-6">立即体验免费、快速、安全的 PDF 转换服务</p>
          <Link
            href="/pdf-to-word"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
          >
            开始使用
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}