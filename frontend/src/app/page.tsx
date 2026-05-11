'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import {
  FileText, FileUp, Image, FileImage, Merge, Minimize2,
  Scissors, SplitSquareHorizontal, ArrowUpDown,
  ImageIcon, Droplets,
  Upload, ChevronDown, ChevronRight,
  Shield, Zap, CheckCircle2, Users, Lock, Clock,
  Award, Star, BadgeCheck
} from 'lucide-react';

// ─── Data ───────────────────────────────────────────────

interface ToolItem {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const pdfTools: ToolItem[] = [
  { href: "/pdf-to-word", icon: <FileText className="w-5 h-5" />, title: "PDF转Word", description: "将PDF文件转换为可编辑的Word文档" },
  { href: "/word-to-pdf", icon: <FileUp className="w-5 h-5" />, title: "Word转PDF", description: "将Word文档转换为PDF格式" },
  { href: "/pdf-to-jpg", icon: <FileImage className="w-5 h-5" />, title: "PDF转JPG", description: "将PDF页面转换为图片" },
  { href: "/jpg-to-pdf", icon: <Image className="w-5 h-5" />, title: "JPG转PDF", description: "将图片合并为PDF文件" },
  { href: "/merge-pdf", icon: <Merge className="w-5 h-5" />, title: "PDF合并", description: "将多个PDF文件合并为一个" },
  { href: "/compress-pdf", icon: <Minimize2 className="w-5 h-5" />, title: "PDF压缩", description: "减小PDF文件大小" },
  { href: "/remove-pages", icon: <Scissors className="w-5 h-5" />, title: "删除页面", description: "从PDF中删除指定页面" },
  { href: "/split-pdf", icon: <SplitSquareHorizontal className="w-5 h-5" />, title: "拆分PDF", description: "将PDF拆分为多个文件" },
  { href: "/rearrange-pdf", icon: <ArrowUpDown className="w-5 h-5" />, title: "重新排列", description: "调整PDF页面顺序" },
];

const imageTools: ToolItem[] = [
  { href: "/image-compress", icon: <ImageIcon className="w-5 h-5" />, title: "图片压缩", description: "减小图片文件大小" },
  { href: "/image-watermark", icon: <Droplets className="w-5 h-5" />, title: "图片水印", description: "为图片添加水印" },
];

const quickTools = [
  { href: "/pdf-to-word", label: "PDF→Word", icon: "📄" },
  { href: "/word-to-pdf", label: "Word→PDF", icon: "📝" },
  { href: "/pdf-to-jpg", label: "PDF→JPG", icon: "🖼️" },
  { href: "/jpg-to-pdf", label: "JPG→PDF", icon: "📷" },
  { href: "/merge-pdf", label: "合并PDF", icon: "📑" },
  { href: "/compress-pdf", label: "压缩PDF", icon: "📦" },
];

const stats = [
  { number: "12,500+", label: "累计用户", icon: <Users className="w-5 h-5" /> },
  { number: "50,000+", label: "转换文件", icon: <FileText className="w-5 h-5" /> },
  { number: "0元", label: "完全免费", icon: <Award className="w-5 h-5" /> },
  { number: "SSL", label: "安全保障", icon: <Shield className="w-5 h-5" /> },
];

const advantages = [
  { icon: <CheckCircle2 className="w-6 h-6" />, title: "完全免费", desc: "所有功能免费使用，无需注册，无隐藏收费" },
  { icon: <Lock className="w-6 h-6" />, title: "安全可靠", desc: "SSL加密传输，文件处理后30分钟自动删除" },
  { icon: <Zap className="w-6 h-6" />, title: "极速转换", desc: "高效转换引擎，秒级完成文档格式转换" },
  { icon: <Star className="w-6 h-6" />, title: "精准还原", desc: "智能格式识别，最大程度保留原始排版" },
];

const faqItems = [
  { q: "使用PDF转换工具需要付费吗？", a: "完全免费！我们的所有PDF转换工具都可以免费使用，无需注册或订阅，没有任何隐藏费用。" },
  { q: "我的文件安全吗？", a: "绝对安全。所有文件处理都在SSL加密连接下进行，转换完成后30分钟内自动从服务器删除，我们不会保留您的任何文件。" },
  { q: "支持哪些文件格式？", a: "我们支持PDF、Word（DOC/DOCX）、JPG/PNG图片等多种格式之间的相互转换，后续会持续增加更多格式支持。" },
  { q: "转换后的文件质量如何？", a: "我们使用先进的转换技术，确保转换后的文件保持原始格式和布局，尽可能减少失真，还原度高达99%。" },
  { q: "有文件大小限制吗？", a: "目前单个文件最大支持50MB，基本满足日常文档处理需求。如需处理更大文件，可尝试先压缩PDF。" },
  { q: "移动端可以使用吗？", a: "可以！我们的工具完美适配手机和平板设备，随时随地轻松转换文档。" },
];

// ─── FAQ Accordion Item ──────────────────────────────────

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-200 hover:border-primary-200 bg-white"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <span className="text-sm font-medium text-gray-800 group-hover:text-primary-600 transition-colors pr-4">{question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-primary-500' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40' : 'max-h-0'}`}>
        <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ─── Tool Card ───────────────────────────────────────────

function ToolCard({ tool }: { tool: ToolItem }) {
  return (
    <Link
      href={tool.href}
      className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-250"
    >
      <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors duration-200">
        {tool.icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-800 mb-0.5 group-hover:text-primary-600 transition-colors">{tool.title}</h4>
        <p className="text-xs text-gray-400 leading-relaxed">{tool.description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
    </Link>
  );
}

// ─── Main Page ───────────────────────────────────────────

export default function HomePage() {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Navigate to pdf-to-word on drop (actual processing handled there)
    window.location.href = '/pdf-to-word';
  };

  const handleClick = () => {
    window.location.href = '/pdf-to-word';
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/60 via-white to-white pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-gray-900 leading-tight mb-4">
              文档格式转换，从未如此简单
            </h1>
            <p className="text-base sm:text-lg text-gray-500 mb-10 leading-relaxed">
              支持 PDF ↔ Word / 图片，极速、免费、安全
            </p>

            {/* Drag & Drop Upload Area */}
            <div
              className={`relative mx-auto w-full max-w-2xl border-2 border-dashed rounded-2xl p-10 sm:p-14 cursor-pointer transition-all duration-250 group ${
                dragOver
                  ? 'border-primary-400 bg-primary-50/50 scale-[1.01]'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                  dragOver ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500'
                }`}>
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-gray-700 mb-1">
                    拖拽文件至此 / 点击选择
                  </p>
                  <p className="text-sm text-gray-400">
                    → 自动识别格式转换
                  </p>
                </div>
              </div>
              <input ref={fileInputRef} type="file" className="hidden" />
            </div>

            {/* Quick Tool Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
              {quickTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <span className="text-base">{tool.icon}</span>
                  <span className="font-medium">{tool.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools Section ────────────────────────────────── */}
      <section id="tools" className="py-16 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-4">
          {/* PDF Tools */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary-500 rounded-full inline-block" />
              PDF工具
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfTools.map((tool) => (
                <ToolCard key={tool.href} tool={tool} />
              ))}
            </div>
          </div>

          {/* Image Tools */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full inline-block" />
              图片工具
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageTools.map((tool) => (
                <ToolCard key={tool.href} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust / Stats Section ────────────────────────── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.number}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Advantages */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">为什么选择我们</h2>
            <p className="text-sm text-gray-400">值得信赖的在线文档处理平台</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {advantages.map((adv, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 group">
                <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors duration-200">
                  {adv.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1.5">{adv.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────── */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">常见问题</h2>
            <p className="text-sm text-gray-400">关于我们的服务，您可能想知道的</p>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
