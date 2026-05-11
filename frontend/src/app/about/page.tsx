import type { Metadata } from "next";

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

export const dynamic = "force-dynamic";


import Link from "next/link";
import { ArrowRight, Shield, Zap, CheckCircle, Heart, FileText, Cpu } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "简单易用",
      description: "无需复杂的学习过程，拖拽上传即可完成转换。支持所有主流浏览器，随时随地使用。",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "安全可靠",
      description: "所有上传的文件会在 30 分钟后自动删除，采用 SSL 加密传输，我们不会存储或分享您的任何文件。",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "完全免费",
      description: "所有转换功能完全免费使用，无需注册账号，无隐藏费用，无水印。",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "极速转换",
      description: "采用高性能转换引擎，10MB 文件 15 秒内完成转换。支持多种格式互转。",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const techStack = [
    { name: "Next.js", icon: "▲", desc: "React 框架" },
    { name: "TailwindCSS", icon: "🎨", desc: "CSS 框架" },
    { name: "NestJS", icon: "🦁", desc: "后端框架" },
    { name: "LibreOffice", icon: "📄", desc: "转换引擎" }
  ];

  const openSourceProjects = [
    { name: "Stirling-PDF", url: "https://github.com/Stirling-Tools/Stirling-PDF" },
    { name: "Next.js", url: "https://nextjs.org" },
    { name: "TailwindCSS", url: "https://tailwindcss.com" }
  ];

  return (
    <div className="min-h-screen bg-theme">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <span className="mr-2">📄</span>
              <span className="text-theme-muted">关于我们</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-theme mb-6">
              让 PDF 处理更简单
            </h1>
            <p className="text-lg md:text-xl text-theme-muted max-w-2xl mx-auto leading-relaxed">
              我们致力于为用户提供最优质的在线 PDF 转换服务，完全免费、无需注册、安全可靠。
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-theme text-center mb-12">我们的使命</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-3xl p-8 hover-lift">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-theme mb-4">{feature.title}</h3>
                <p className="text-theme-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-theme-secondary">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <Cpu className="w-4 h-4 mr-2" />
              <span className="text-theme-muted">技术栈</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-theme">强大的技术支持</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="glass-card rounded-3xl p-8 text-center hover-lift">
                <div className="text-4xl mb-4">{tech.icon}</div>
                <h3 className="font-bold text-theme mb-2">{tech.name}</h3>
                <p className="text-sm text-theme-muted">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4 mr-2" />
              <span className="text-theme-muted">开源项目</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-theme mb-4">感谢开源社区</h2>
            <p className="text-theme-muted max-w-2xl mx-auto">
              我们感谢以下开源项目，它们是我们服务的重要组成部分
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {openSourceProjects.map((project, index) => (
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-4 glass-card rounded-2xl text-theme hover:text-indigo-500 transition-all hover:scale-105"
              >
                {project.name}
                <svg className="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-theme-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-10 md:p-16 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">准备好开始了吗？</h2>
              <p className="text-white/80 mb-8 text-lg">立即体验免费、快速、安全的 PDF 转换服务</p>
              <Link
                href="/pdf-to-word"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                开始使用
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}