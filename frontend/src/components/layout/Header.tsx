"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import {
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  Droplets,
  FileImage,
  FileText,
  FileUp,
  Files,
  Image as ImageIcon,
  Menu,
  Merge,
  Minimize2,
  RotateCw,
  Scissors,
  SplitSquareHorizontal,
  Stamp,
  ScanText,
  ShieldCheck,
  UnlockKeyhole,
  PenTool,
  Crop,
  FileSpreadsheet,
  Presentation,
  FileCode2,
  ListOrdered,
  Scaling,
  X,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  const pdfTools = [
    { href: "/pdf-to-word", icon: FileText, title: t("header.tools.pdfToWord.title"), desc: t("header.tools.pdfToWord.desc") },
    { href: "/word-to-pdf", icon: FileUp, title: t("header.tools.wordToPdf.title"), desc: t("header.tools.wordToPdf.desc") },
    { href: "/pdf-to-jpg", icon: FileImage, title: t("header.tools.pdfToJpg.title"), desc: t("header.tools.pdfToJpg.desc") },
    { href: "/jpg-to-pdf", icon: ImageIcon, title: t("header.tools.jpgToPdf.title"), desc: t("header.tools.jpgToPdf.desc") },
    { href: "/merge-pdf", icon: Merge, title: t("header.tools.mergePdf.title"), desc: t("header.tools.mergePdf.desc") },
    { href: "/compress-pdf", icon: Minimize2, title: t("header.tools.compressPdf.title"), desc: t("header.tools.compressPdf.desc") },
    { href: "/remove-pages", icon: Scissors, title: t("header.tools.removePages.title"), desc: t("header.tools.removePages.desc") },
    { href: "/split-pdf", icon: SplitSquareHorizontal, title: t("header.tools.splitPdf.title"), desc: t("header.tools.splitPdf.desc") },
    { href: "/rearrange-pdf", icon: ArrowUpDown, title: t("header.tools.rearrangePdf.title"), desc: t("header.tools.rearrangePdf.desc") },
    { href: "/rotate-pdf", icon: RotateCw, title: t("header.tools.rotatePdf.title"), desc: t("header.tools.rotatePdf.desc") },
    { href: "/extract-pages", icon: Files, title: t("header.tools.extractPages.title"), desc: t("header.tools.extractPages.desc") },
    { href: "/pdf-watermark", icon: Stamp, title: t("header.tools.pdfWatermark.title"), desc: t("header.tools.pdfWatermark.desc") },
    { href: "/ocr-pdf", icon: ScanText, title: t("header.tools.ocrPdf.title"), desc: t("header.tools.ocrPdf.desc") },
    { href: "/protect-pdf", icon: ShieldCheck, title: t("header.tools.protectPdf.title"), desc: t("header.tools.protectPdf.desc") },
    { href: "/unlock-pdf", icon: UnlockKeyhole, title: t("header.tools.unlockPdf.title"), desc: t("header.tools.unlockPdf.desc") },
    { href: "/sign-pdf", icon: PenTool, title: t("header.tools.signPdf.title"), desc: t("header.tools.signPdf.desc") },
    { href: "/crop-pdf", icon: Crop, title: t("header.tools.cropPdf.title"), desc: t("header.tools.cropPdf.desc") },
    { href: "/pdf-to-excel", icon: FileSpreadsheet, title: t("header.tools.pdfToExcel.title"), desc: t("header.tools.pdfToExcel.desc") },
    { href: "/pdf-to-pptx", icon: Presentation, title: t("header.tools.pdfToPptx.title"), desc: t("header.tools.pdfToPptx.desc") },
    { href: "/pdf-to-html", icon: FileCode2, title: t("header.tools.pdfToHtml.title"), desc: t("header.tools.pdfToHtml.desc") },
    { href: "/add-page-numbers", icon: ListOrdered, title: t("header.tools.addPageNumbers.title"), desc: t("header.tools.addPageNumbers.desc") },
    { href: "/scale-pdf", icon: Scaling, title: t("header.tools.scalePdf.title"), desc: t("header.tools.scalePdf.desc") },
  ];

  const imageTools = [
    { href: "/image-compress", icon: ImageIcon, title: t("header.tools.imageCompress.title") },
    { href: "/image-watermark", icon: Droplets, title: t("header.tools.imageWatermark.title") },
  ];

  return (
    <header className="studio-header sticky top-0 z-50">
      <nav className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex h-[72px] items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <span className="studio-logo-mark"><FileText className="h-5 w-5" /></span>
            <span>
              <strong className="block text-base font-black leading-none tracking-[-0.04em] text-theme">PDF / LAB</strong>
              <small className="mt-1 block text-[9px] font-bold uppercase tracking-[0.22em] text-theme-muted">File workshop</small>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <Link href="/blog" className={`studio-nav-link ${pathname === "/blog" ? "is-active" : ""}`}>{t("header.blog")}</Link>
            <div className="relative">
              <button type="button" onClick={() => setIsToolsOpen((open) => !open)} className={`studio-nav-link flex items-center gap-2 ${isToolsOpen ? "is-active" : ""}`}>
                {t("header.allTools")}<ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
              </button>
              {isToolsOpen && (
                <div className="studio-mega-menu">
                  <div className="mb-5 flex items-center justify-between border-b border-theme pb-4">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-theme-muted">Tool directory / {pdfTools.length + imageTools.length}</span>
                    <button type="button" onClick={() => setIsToolsOpen(false)} className="text-theme-muted hover:text-theme" aria-label="关闭工具菜单"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {pdfTools.map((tool, index) => (
                      <Link key={tool.href} href={tool.href} onClick={() => setIsToolsOpen(false)} className="studio-menu-item group">
                        <span className="text-[10px] font-black text-theme-muted">{String(index + 1).padStart(2, "0")}</span>
                        <tool.icon className="h-5 w-5 text-[var(--studio-accent)]" />
                        <span className="min-w-0">
                          <strong className="block truncate text-sm text-theme">{tool.title}</strong>
                          <small className="mt-0.5 block truncate text-[11px] text-theme-muted">{tool.desc}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-theme pt-3">
                    {imageTools.map((tool) => (
                      <Link key={tool.href} href={tool.href} onClick={() => setIsToolsOpen(false)} className="studio-menu-item group">
                        <tool.icon className="h-5 w-5 text-emerald-500" />
                        <strong className="text-sm text-theme">{tool.title}</strong>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="mx-3 h-5 w-px bg-[var(--border)]" />
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/pdf-to-word" className="studio-header-cta">
              {t("header.useNow")}<ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button type="button" className="p-3 text-theme" onClick={() => setIsMenuOpen((open) => !open)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-theme py-4 lg:hidden">
            <div className="grid max-h-[70vh] grid-cols-2 gap-2 overflow-y-auto pb-4">
              <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="studio-mobile-link col-span-2">{t("header.blog")}</Link>
              {pdfTools.map((tool) => (
                <Link key={tool.href} href={tool.href} onClick={() => setIsMenuOpen(false)} className="studio-mobile-link">
                  <tool.icon className="h-4 w-4 text-[var(--studio-accent)]" />{tool.title}
                </Link>
              ))}
              <div className="col-span-2 mt-2 border-t border-theme pt-3 text-[10px] font-black uppercase tracking-[0.18em] text-theme-muted">Image tools</div>
              {imageTools.map((tool) => (
                <Link key={tool.href} href={tool.href} onClick={() => setIsMenuOpen(false)} className="studio-mobile-link">
                  <tool.icon className="h-4 w-4 text-emerald-500" />{tool.title}
                </Link>
              ))}
            </div>
            <Link href="/pdf-to-word" onClick={() => setIsMenuOpen(false)} className="studio-header-cta flex w-full justify-center py-3">
              {t("header.startUsing")}<ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
