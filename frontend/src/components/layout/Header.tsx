"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import {
  FileText, FileUp, Image as ImageIcon, FileImage, Merge, Minimize2,
  Scissors, SplitSquareHorizontal, ArrowUpDown, Droplets, ChevronDown, Menu, X
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  const isActive = (href: string) => pathname === href;

  const pdfTools = [
    { href: "/pdf-to-word", icon: <FileText className="w-5 h-5" />, title: t("header.tools.pdfToWord.title"), desc: t("header.tools.pdfToWord.desc") },
    { href: "/word-to-pdf", icon: <FileUp className="w-5 h-5" />, title: t("header.tools.wordToPdf.title"), desc: t("header.tools.wordToPdf.desc") },
    { href: "/pdf-to-jpg", icon: <FileImage className="w-5 h-5" />, title: t("header.tools.pdfToJpg.title"), desc: t("header.tools.pdfToJpg.desc") },
    { href: "/jpg-to-pdf", icon: <ImageIcon className="w-5 h-5" />, title: t("header.tools.jpgToPdf.title"), desc: t("header.tools.jpgToPdf.desc") },
    { href: "/merge-pdf", icon: <Merge className="w-5 h-5" />, title: t("header.tools.mergePdf.title"), desc: t("header.tools.mergePdf.desc") },
    { href: "/compress-pdf", icon: <Minimize2 className="w-5 h-5" />, title: t("header.tools.compressPdf.title"), desc: t("header.tools.compressPdf.desc") },
    { href: "/remove-pages", icon: <Scissors className="w-5 h-5" />, title: t("header.tools.removePages.title"), desc: t("header.tools.removePages.desc") },
    { href: "/split-pdf", icon: <SplitSquareHorizontal className="w-5 h-5" />, title: t("header.tools.splitPdf.title"), desc: t("header.tools.splitPdf.desc") },
    { href: "/rearrange-pdf", icon: <ArrowUpDown className="w-5 h-5" />, title: t("header.tools.rearrangePdf.title"), desc: t("header.tools.rearrangePdf.desc") },
  ];

  const imageTools = [
    { href: "/image-compress", icon: <ImageIcon className="w-5 h-5" />, title: t("header.tools.imageCompress.title"), desc: t("header.tools.imageCompress.desc") },
    { href: "/image-watermark", icon: <Droplets className="w-5 h-5" />, title: t("header.tools.imageWatermark.title"), desc: t("header.tools.imageWatermark.desc") },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-theme theme-transition">
      <nav className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300 group-hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">PDF转换器</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/blog"
              className={`px-4 py-2 text-sm font-medium rounded-xl theme-transition ${
                isActive("/blog")
                  ? "text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
                  : "text-theme-muted hover:text-theme hover:bg-theme-secondary"
              }`}
            >
              {t("header.blog")}
            </Link>

            {/* Tools dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`px-4 py-2 text-sm font-semibold rounded-xl theme-transition flex items-center gap-2 ${
                  isToolsOpen
                    ? "text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
                    : "text-theme-muted hover:text-theme hover:bg-theme-secondary"
                }`}
              >
                {t("header.allTools")}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isToolsOpen ? "rotate-180" : ""}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute top-full right-0 mt-2 w-[700px] glass-card rounded-2xl overflow-hidden p-6">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-theme">{t("header.pdfTools")}</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {pdfTools.map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setIsToolsOpen(false)}
                            className="group p-3 rounded-xl hover:bg-theme-secondary theme-transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {tool.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-theme truncate">{tool.title}</div>
                                <div className="text-xs text-theme-muted truncate">{tool.desc}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="w-px bg-theme" />

                    <div className="w-56">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-theme">{t("header.imageTools")}</h3>
                      </div>
                      <div className="space-y-2">
                        {imageTools.map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setIsToolsOpen(false)}
                            className="group p-3 rounded-xl hover:bg-theme-secondary theme-transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {tool.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-theme">{tool.title}</div>
                                <div className="text-xs text-theme-muted">{tool.desc}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <LanguageSwitcher />
            <ThemeToggle />

            <Link href="/pdf-to-word" className="ml-2 btn-primary px-6 py-2 text-sm">
              {t("header.useNow")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="p-3 rounded-xl hover:bg-theme-secondary theme-transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-theme" /> : <Menu className="w-6 h-6 text-theme" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-theme bg-theme-card theme-transition">
            <div className="py-6 space-y-6">
              <Link
                href="/blog"
                className={`block px-4 py-3 text-base font-medium rounded-xl theme-transition ${
                  isActive("/blog")
                    ? "text-white bg-gradient-to-r from-indigo-500 to-purple-500"
                    : "text-theme-muted hover:text-theme hover:bg-theme-secondary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.blog")}
              </Link>

              <div>
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-theme-muted">{t("header.pdfTools")}</div>
                <div className="space-y-1">
                  {pdfTools.slice(0, 6).map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`flex items-center gap-3 px-4 py-3 text-base rounded-xl theme-transition ${
                        isActive(tool.href)
                          ? "text-white bg-gradient-to-r from-indigo-500 to-purple-500"
                          : "text-theme-muted hover:text-theme hover:bg-theme-secondary"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{tool.icon}</span>
                      <span>{tool.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="px-4 pt-4 border-t border-theme space-y-4">
                <Link
                  href="/pdf-to-word"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full btn-primary text-center py-3 text-base"
                >
                  {t("header.startUsing")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
