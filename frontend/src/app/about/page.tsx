"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, CheckCircle, Heart, FileText, Cpu } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();

  const features = [
    { icon: <Zap className="w-8 h-8" />, title: t("about.features.easy.title"), description: t("about.features.easy.desc"), gradient: "from-blue-500 to-cyan-500" },
    { icon: <Shield className="w-8 h-8" />, title: t("about.features.secure.title"), description: t("about.features.secure.desc"), gradient: "from-purple-500 to-pink-500" },
    { icon: <CheckCircle className="w-8 h-8" />, title: t("about.features.free.title"), description: t("about.features.free.desc"), gradient: "from-emerald-500 to-teal-500" },
    { icon: <Heart className="w-8 h-8" />, title: t("about.features.fast.title"), description: t("about.features.fast.desc"), gradient: "from-orange-500 to-red-500" },
  ];

  const techStack = [
    { name: "Next.js", icon: "▲", desc: "React 框架" },
    { name: "TailwindCSS", icon: "🎨", desc: "CSS 框架" },
    { name: "NestJS", icon: "🦁", desc: "后端框架" },
    { name: "LibreOffice", icon: "📄", desc: "转换引擎" },
  ];

  const openSourceProjects = [
    { name: "Stirling-PDF", url: "https://github.com/Stirling-Tools/Stirling-PDF" },
    { name: "Next.js", url: "https://nextjs.org" },
    { name: "TailwindCSS", url: "https://tailwindcss.com" },
  ];

  return (
    <div className="min-h-screen bg-theme">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl" />
      </div>

      <section className="relative pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <span className="mr-2">📄</span>
              <span className="text-theme-muted">{t("about.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-theme mb-6">{t("about.title")}</h1>
            <p className="text-lg md:text-xl text-theme-muted max-w-2xl mx-auto leading-relaxed">{t("about.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-theme text-center mb-12">{t("about.mission")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-3xl p-8 hover-lift">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-theme mb-4">{feature.title}</h3>
                <p className="text-theme-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-theme-secondary">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <Cpu className="w-4 h-4 mr-2" />
              <span className="text-theme-muted">{t("about.techStack")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-theme">{t("about.techStackTitle")}</h2>
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

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4 mr-2" />
              <span className="text-theme-muted">{t("about.openSource")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-theme mb-4">{t("about.openSourceTitle")}</h2>
            <p className="text-theme-muted max-w-2xl mx-auto">{t("about.openSourceDesc")}</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {openSourceProjects.map((project, index) => (
              <a key={index} href={project.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-4 glass-card rounded-2xl text-theme hover:text-indigo-500 transition-all hover:scale-105">
                {project.name}
                <svg className="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-theme-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-10 md:p-16 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{t("about.readyTitle")}</h2>
              <p className="text-white/80 mb-8 text-lg">{t("about.readyDesc")}</p>
              <Link href="/pdf-to-word" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                {t("about.startUsing")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
