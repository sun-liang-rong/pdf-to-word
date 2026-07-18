"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight,
  ArrowUpDown,
  Check,
  Clock3,
  Droplets,
  FileImage,
  FileText,
  FileUp,
  Files,
  Image,
  LockKeyhole,
  Merge,
  Minimize2,
  RotateCw,
  Scissors,
  ShieldCheck,
  Sparkles,
  SplitSquareHorizontal,
  Stamp,
  Upload,
  Zap,
} from "lucide-react";

const toolAccents = [
  "tool-accent-cyan",
  "tool-accent-violet",
  "tool-accent-coral",
  "tool-accent-lime",
] as const;

export default function HomePage() {
  const [dragOver, setDragOver] = useState(false);
  const { t } = useI18n();

  const pdfTools = [
    { href: "/pdf-to-word", icon: FileText, title: t("home.tools.pdfToWord.title"), desc: t("home.tools.pdfToWord.desc"), featured: true },
    { href: "/word-to-pdf", icon: FileUp, title: t("home.tools.wordToPdf.title"), desc: t("home.tools.wordToPdf.desc") },
    { href: "/pdf-to-jpg", icon: FileImage, title: t("home.tools.pdfToJpg.title"), desc: t("home.tools.pdfToJpg.desc") },
    { href: "/jpg-to-pdf", icon: Image, title: t("home.tools.jpgToPdf.title"), desc: t("home.tools.jpgToPdf.desc") },
    { href: "/merge-pdf", icon: Merge, title: t("home.tools.mergePdf.title"), desc: t("home.tools.mergePdf.desc"), featured: true },
    { href: "/compress-pdf", icon: Minimize2, title: t("home.tools.compressPdf.title"), desc: t("home.tools.compressPdf.desc") },
    { href: "/remove-pages", icon: Scissors, title: t("home.tools.removePages.title"), desc: t("home.tools.removePages.desc") },
    { href: "/split-pdf", icon: SplitSquareHorizontal, title: t("home.tools.splitPdf.title"), desc: t("home.tools.splitPdf.desc") },
    { href: "/rearrange-pdf", icon: ArrowUpDown, title: t("home.tools.rearrangePdf.title"), desc: t("home.tools.rearrangePdf.desc") },
    { href: "/rotate-pdf", icon: RotateCw, title: t("home.tools.rotatePdf.title"), desc: t("home.tools.rotatePdf.desc") },
    { href: "/extract-pages", icon: Files, title: t("home.tools.extractPages.title"), desc: t("home.tools.extractPages.desc") },
    { href: "/pdf-watermark", icon: Stamp, title: t("home.tools.pdfWatermark.title"), desc: t("home.tools.pdfWatermark.desc"), featured: true },
  ];

  const imageTools = [
    { href: "/image-compress", icon: Image, title: t("home.tools.imageCompress.title"), desc: t("home.tools.imageCompress.desc") },
    { href: "/image-watermark", icon: Droplets, title: t("home.tools.imageWatermark.title"), desc: t("home.tools.imageWatermark.desc") },
  ];

  const advantages = [
    { icon: Check, index: "01", title: t("home.advantages.free.title"), desc: t("home.advantages.free.desc") },
    { icon: LockKeyhole, index: "02", title: t("home.advantages.security.title"), desc: t("home.advantages.security.desc") },
    { icon: Zap, index: "03", title: t("home.advantages.fast.title"), desc: t("home.advantages.fast.desc") },
    { icon: Clock3, index: "04", title: t("home.advantages.accurate.title"), desc: t("home.advantages.accurate.desc") },
  ];

  const goToConverter = () => {
    window.location.href = "/pdf-to-word";
  };

  return (
    <div className="studio-page min-h-screen overflow-hidden">
      <section className="relative mx-auto max-w-[1440px] px-4 pb-20 pt-8 sm:px-6 lg:px-10 lg:pb-28 lg:pt-14">
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-16">
          <div className="relative z-10">
            <div className="mb-7 flex items-center gap-3">
              <span className="studio-kicker"><Sparkles className="h-3.5 w-3.5" /> PDF LAB / 2026</span>
              <span className="hidden h-px w-20 bg-current opacity-20 sm:block" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-muted">{t("home.badge")}</span>
            </div>

            <h1 className="studio-title max-w-4xl text-[clamp(3.6rem,8vw,7.6rem)] font-black leading-[0.82] tracking-[-0.075em] text-theme">
              <span className="block">MAKE</span>
              <span className="studio-outline-text block">FILES</span>
              <span className="block pl-[0.55em]">FLOW.</span>
            </h1>

            <div className="mt-9 grid max-w-2xl gap-7 border-l-2 border-[var(--studio-accent)] pl-5 sm:grid-cols-[1fr_auto] sm:items-end sm:pl-7">
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[var(--studio-accent)]">
                  {t("home.title1")}{t("home.title2")}
                </p>
                <p className="max-w-xl text-base leading-7 text-theme-muted sm:text-lg">{t("home.subtitle")}</p>
              </div>
              <Link href="#tools" className="studio-round-link" aria-label={t("home.allTools")}>
                <ArrowRight className="h-6 w-6 rotate-45" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold uppercase tracking-[0.12em] text-theme-muted">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> SSL</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--studio-accent)]" /> {t("home.stats.free")}</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-amber-500" /> {t("footer.autoDelete")}</span>
            </div>
          </div>

          <div className="relative z-10 lg:pl-4">
            <div className="upload-stage">
              <div className="upload-stage-topline">
                <span>DROP ZONE_01</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> ONLINE</span>
              </div>
              <button
                type="button"
                onClick={goToConverter}
                onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => { event.preventDefault(); setDragOver(false); goToConverter(); }}
                className={`upload-stage-inner group ${dragOver ? "is-dragging" : ""}`}
              >
                <span className="upload-cross upload-cross-one" />
                <span className="upload-cross upload-cross-two" />
                <span className="upload-icon-shell">
                  <Upload className="h-9 w-9 transition-transform duration-500 group-hover:-translate-y-1" />
                </span>
                <span className="mt-7 text-xl font-black tracking-[-0.03em] text-theme sm:text-2xl">{t("home.dragDrop")}</span>
                <span className="mt-2 max-w-sm text-sm leading-6 text-theme-muted">{t("home.supportedFormats")}</span>
                <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--studio-ink)] px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--studio-paper)] transition-transform duration-300 group-hover:scale-105">
                  {t("home.convertNow")} <ArrowRight className="h-4 w-4" />
                </span>
              </button>
              <div className="upload-stage-footer">
                <span>PDF / DOCX / JPG</span>
                <span>NO REGISTRATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="studio-marquee" aria-hidden="true">
        <div className="studio-marquee-track">
          <span>CONVERT</span><i /> <span>COMPRESS</span><i /> <span>MERGE</span><i /> <span>CREATE</span><i />
          <span>CONVERT</span><i /> <span>COMPRESS</span><i /> <span>MERGE</span><i /> <span>CREATE</span><i />
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="studio-section-number">01 / TOOL INDEX</span>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-theme sm:text-6xl">{t("home.allTools")}</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-theme-muted lg:text-right">{t("home.whyChooseUsDesc")}</p>
        </div>

        <div className="tool-index-grid">
          {pdfTools.map((tool, index) => (
            <ToolCard key={tool.href} tool={tool} index={index} />
          ))}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {imageTools.map((tool, index) => (
            <Link key={tool.href} href={tool.href} className={`image-tool-card group ${toolAccents[index + 2]}`}>
              <span className="image-tool-icon"><tool.icon className="h-7 w-7" /></span>
              <span className="min-w-0">
                <strong className="block text-xl font-black tracking-[-0.035em] text-theme">{tool.title}</strong>
                <span className="mt-1 block text-sm text-theme-muted">{tool.desc}</span>
              </span>
              <ArrowRight className="ml-auto h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="studio-dark-section">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <span className="studio-section-number text-white/50">02 / WHY US</span>
              <h2 className="mt-5 max-w-md text-4xl font-black leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl">
                {t("home.whyChooseUs")}
              </h2>
              <div className="mt-10 h-1 w-24 bg-[var(--studio-accent)]" />
            </div>
            <div className="grid border-l border-t border-white/15 sm:grid-cols-2">
              {advantages.map((item) => (
                <article key={item.index} className="advantage-cell">
                  <span className="flex items-center justify-between text-xs font-black tracking-[0.18em] text-white/40">
                    {item.index}<item.icon className="h-5 w-5 text-[var(--studio-accent)]" />
                  </span>
                  <h3 className="mt-12 text-2xl font-black tracking-[-0.04em] text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="studio-cta">
          <div className="studio-cta-sun" />
          <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em] text-[var(--studio-ink)]/60">READY WHEN YOU ARE</span>
          <h2 className="relative z-10 mt-6 max-w-4xl text-5xl font-black leading-[0.88] tracking-[-0.07em] text-[var(--studio-ink)] sm:text-7xl lg:text-8xl">
            {t("home.readyTitle")}
          </h2>
          <div className="relative z-10 mt-9 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-base leading-7 text-[var(--studio-ink)]/65">{t("home.readyDesc")}</p>
            <Link href="/pdf-to-word" className="studio-cta-button">
              {t("home.convertNow")} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

type Tool = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  featured?: boolean;
};

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const accent = toolAccents[index % toolAccents.length];
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link href={tool.href} className={`tool-index-card group ${accent} ${tool.featured ? "tool-index-card-featured" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <span className="tool-card-number">{number}</span>
        <span className="tool-card-icon"><tool.icon className="h-6 w-6" /></span>
      </div>
      <div className="mt-auto pt-10">
        <h3 className="text-xl font-black tracking-[-0.04em] text-theme sm:text-2xl">{tool.title}</h3>
        <p className="mt-2 max-w-xs text-sm leading-6 text-theme-muted">{tool.desc}</p>
      </div>
      <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
    </Link>
  );
}
