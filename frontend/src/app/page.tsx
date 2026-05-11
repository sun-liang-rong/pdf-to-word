"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FileText, FileUp, Image, FileImage, Merge, Minimize2,
  Scissors, SplitSquareHorizontal, ArrowUpDown, Upload,
  Shield, Zap, CheckCircle2, Users, Lock, Clock, Droplets
} from "lucide-react";

const pdfTools = [
  { href: "/pdf-to-word", icon: <FileText className="w-7 h-7" />, title: "PDF转Word", desc: "转可编辑文档", color: "from-blue-500 to-cyan-500", size: "normal" },
  { href: "/word-to-pdf", icon: <FileUp className="w-7 h-7" />, title: "Word转PDF", desc: "一键转换", color: "from-purple-500 to-pink-500", size: "normal" },
  { href: "/pdf-to-jpg", icon: <FileImage className="w-7 h-7" />, title: "PDF转JPG", desc: "高清图片", color: "from-orange-500 to-red-500", size: "normal" },
  { href: "/jpg-to-pdf", icon: <Image className="w-7 h-7" />, title: "JPG转PDF", desc: "图片合并", color: "from-green-500 to-teal-500", size: "normal" },
  { href: "/merge-pdf", icon: <Merge className="w-7 h-7" />, title: "PDF合并", desc: "多文件合一", color: "from-indigo-500 to-purple-500", size: "wide" },
  { href: "/compress-pdf", icon: <Minimize2 className="w-7 h-7" />, title: "PDF压缩", desc: "减小体积", color: "from-pink-500 to-rose-500", size: "normal" },
  { href: "/remove-pages", icon: <Scissors className="w-7 h-7" />, title: "删除页面", desc: "页面裁剪", color: "from-amber-500 to-orange-500", size: "normal" },
  { href: "/split-pdf", icon: <SplitSquareHorizontal className="w-7 h-7" />, title: "拆分PDF", desc: "文件拆分", color: "from-cyan-500 to-blue-500", size: "normal" },
  { href: "/rearrange-pdf", icon: <ArrowUpDown className="w-7 h-7" />, title: "重新排列", desc: "调整顺序", color: "from-violet-500 to-purple-500", size: "normal" },
];

const imageTools = [
  { href: "/image-compress", icon: <Image className="w-7 h-7" />, title: "图片压缩", desc: "压缩图片", color: "from-emerald-500 to-teal-500" },
  { href: "/image-watermark", icon: <Droplets className="w-7 h-7" />, title: "图片水印", desc: "添加水印", color: "from-sky-500 to-indigo-500" },
];

const stats = [
  { number: "12,500+", label: "累计用户", icon: <Users className="w-6 h-6" /> },
  { number: "50,000+", label: "转换文件", icon: <FileText className="w-6 h-6" /> },
  { number: "0元", label: "完全免费", icon: <CheckCircle2 className="w-6 h-6" /> },
  { number: "SSL", label: "安全保障", icon: <Shield className="w-6 h-6" /> },
];

const advantages = [
  { icon: <CheckCircle2 className="w-8 h-8" />, title: "完全免费", desc: "所有功能免费使用，无需注册，无隐藏收费", color: "from-blue-500 to-cyan-500" },
  { icon: <Lock className="w-8 h-8" />, title: "安全可靠", desc: "SSL加密传输，文件处理后30分钟自动删除", color: "from-purple-500 to-pink-500" },
  { icon: <Zap className="w-8 h-8" />, title: "极速转换", desc: "高效转换引擎，秒级完成文档格式转换", color: "from-orange-500 to-red-500" },
  { icon: <Clock className="w-8 h-8" />, title: "精准还原", desc: "智能格式识别，最大程度保留原始排版", color: "from-green-500 to-teal-500" },
];

// Bento卡片组件
const BentoCard = ({ tool, className = "" }) => {
  const isWide = tool.size === "wide";
  return (
    <Link href={tool.href} className={`group relative overflow-hidden rounded-3xl border border-theme bg-theme-card p-6 theme-transition hover-lift ${isWide ? 'md:col-span-2' : ''} ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {tool.icon}
        </div>
        <h3 className="text-lg font-bold text-theme mb-1">{tool.title}</h3>
        <p className="text-sm text-theme-muted">{tool.desc}</p>
      </div>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default function HomePage() {
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    window.location.href = '/pdf-to-word';
  };

  return (
    <div className="min-h-screen bg-theme">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-3xl" />
      </div>

      {/* Hero区域 */}
      <section className="relative pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-card border border-theme mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm text-theme-muted">完全免费 · 无需注册</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-theme mb-6 leading-tight">
              <span className="gradient-text">PDF转换</span>从未如此简单
            </h1>
            <p className="text-lg sm:text-xl text-theme-muted mb-10">
              支持多种格式转换，极速、安全、完全免费
            </p>
          </div>

          {/* 上传区域 */}
          <div
            className={`relative mx-auto w-full max-w-2xl rounded-3xl border-2 border-dashed border-theme p-10 sm:p-14 cursor-pointer transition-all duration-300 group ${
              dragOver
                ? 'border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 scale-105'
                : 'hover:border-indigo-400 hover:bg-theme-secondary'
            } bg-theme-card/80 backdrop-blur-xl shadow-2xl`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => window.location.href = '/pdf-to-word'}
          >
            <div className="flex flex-col items-center gap-6">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-2xl ${dragOver ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300 animate-pulse-glow`}>
                <Upload className="w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-theme mb-2">
                  拖拽文件至此 或 点击选择
                </p>
                <p className="text-theme-muted">
                  支持 PDF, DOC, DOCX, JPG, PNG 等格式
                </p>
              </div>
            </div>
          </div>

          {/* 快捷按钮 */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {pdfTools.slice(0, 4).map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-theme-card border border-theme text-theme hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 hover-lift"
              >
                <span className={`text-lg bg-gradient-to-br ${tool.color} bg-clip-text text-transparent`}>{tool.icon}</span>
                <span className="font-medium">{tool.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{stat.number}</div>
                <div className="text-sm text-theme-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento工具网格 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold text-theme">全部工具</h2>
          </div>
          
          {/* PDF工具 - Bento网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {pdfTools.map((tool, i) => (
              <BentoCard key={tool.href} tool={tool} />
            ))}
          </div>

          {/* 图片工具 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {imageTools.map((tool) => (
              <BentoCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* 优势特色 */}
      <section className="py-16 bg-theme-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-theme mb-3">为什么选择我们</h2>
            <p className="text-theme-muted">值得信赖的在线文档处理平台</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, i) => (
              <div key={i} className="glass-card p-8 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${adv.color} flex items-center justify-center text-white shadow-lg mx-auto mb-6`}>
                  {adv.icon}
                </div>
                <h3 className="text-lg font-bold text-theme mb-2">{adv.title}</h3>
                <p className="text-sm text-theme-muted leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-12 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">准备好开始转换了吗？</h2>
              <p className="text-white/80 mb-8 text-lg">完全免费，无需注册，立即开始使用</p>
              <Link
                href="/pdf-to-word"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                立即转换
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
