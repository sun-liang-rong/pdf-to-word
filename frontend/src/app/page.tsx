"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowUpDown,
  Check,
  Clock3,
  Command,
  Crop,
  Droplets,
  FileCode2,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileUp,
  Files,
  Fingerprint,
  Image,
  ListOrdered,
  LockKeyhole,
  Merge,
  Minimize2,
  PenTool,
  Presentation,
  Radio,
  RotateCw,
  Scaling,
  ScanText,
  Scissors,
  ShieldCheck,
  Sparkles,
  SplitSquareHorizontal,
  Stamp,
  UnlockKeyhole,
  Upload,
  Zap,
} from "lucide-react";

const toolTones = ["acid", "cyan", "violet", "orange"] as const;

export default function HomePage() {
  const [dragOver, setDragOver] = useState(false);
  const { t } = useI18n();

  const pdfTools = [
    { href: "/pdf-to-word", icon: FileText, title: t("home.tools.pdfToWord.title"), desc: t("home.tools.pdfToWord.desc"), code: "DOC.01" },
    { href: "/word-to-pdf", icon: FileUp, title: t("home.tools.wordToPdf.title"), desc: t("home.tools.wordToPdf.desc"), code: "DOC.02" },
    { href: "/pdf-to-jpg", icon: FileImage, title: t("home.tools.pdfToJpg.title"), desc: t("home.tools.pdfToJpg.desc"), code: "IMG.01" },
    { href: "/jpg-to-pdf", icon: Image, title: t("home.tools.jpgToPdf.title"), desc: t("home.tools.jpgToPdf.desc"), code: "IMG.02" },
    { href: "/merge-pdf", icon: Merge, title: t("home.tools.mergePdf.title"), desc: t("home.tools.mergePdf.desc"), code: "EDIT.01" },
    { href: "/compress-pdf", icon: Minimize2, title: t("home.tools.compressPdf.title"), desc: t("home.tools.compressPdf.desc"), code: "EDIT.02" },
    { href: "/remove-pages", icon: Scissors, title: t("home.tools.removePages.title"), desc: t("home.tools.removePages.desc"), code: "EDIT.03" },
    { href: "/split-pdf", icon: SplitSquareHorizontal, title: t("home.tools.splitPdf.title"), desc: t("home.tools.splitPdf.desc"), code: "EDIT.04" },
    { href: "/rearrange-pdf", icon: ArrowUpDown, title: t("home.tools.rearrangePdf.title"), desc: t("home.tools.rearrangePdf.desc"), code: "EDIT.05" },
    { href: "/rotate-pdf", icon: RotateCw, title: t("home.tools.rotatePdf.title"), desc: t("home.tools.rotatePdf.desc"), code: "EDIT.06" },
    { href: "/extract-pages", icon: Files, title: t("home.tools.extractPages.title"), desc: t("home.tools.extractPages.desc"), code: "EDIT.07" },
    { href: "/pdf-watermark", icon: Stamp, title: t("home.tools.pdfWatermark.title"), desc: t("home.tools.pdfWatermark.desc"), code: "MARK.01" },
    { href: "/ocr-pdf", icon: ScanText, title: t("home.tools.ocrPdf.title"), desc: t("home.tools.ocrPdf.desc"), code: "AI.01" },
    { href: "/protect-pdf", icon: ShieldCheck, title: t("home.tools.protectPdf.title"), desc: t("home.tools.protectPdf.desc"), code: "SAFE.01" },
    { href: "/unlock-pdf", icon: UnlockKeyhole, title: t("home.tools.unlockPdf.title"), desc: t("home.tools.unlockPdf.desc"), code: "SAFE.02" },
    { href: "/sign-pdf", icon: PenTool, title: t("home.tools.signPdf.title"), desc: t("home.tools.signPdf.desc"), code: "SIGN.01" },
    { href: "/crop-pdf", icon: Crop, title: t("home.tools.cropPdf.title"), desc: t("home.tools.cropPdf.desc"), code: "EDIT.08" },
    { href: "/pdf-to-excel", icon: FileSpreadsheet, title: t("home.tools.pdfToExcel.title"), desc: t("home.tools.pdfToExcel.desc"), code: "DATA.01" },
    { href: "/pdf-to-pptx", icon: Presentation, title: t("home.tools.pdfToPptx.title"), desc: t("home.tools.pdfToPptx.desc"), code: "DATA.02" },
    { href: "/pdf-to-html", icon: FileCode2, title: t("home.tools.pdfToHtml.title"), desc: t("home.tools.pdfToHtml.desc"), code: "WEB.01" },
    { href: "/add-page-numbers", icon: ListOrdered, title: t("home.tools.addPageNumbers.title"), desc: t("home.tools.addPageNumbers.desc"), code: "MARK.02" },
    { href: "/scale-pdf", icon: Scaling, title: t("home.tools.scalePdf.title"), desc: t("home.tools.scalePdf.desc"), code: "EDIT.09" },
  ];

  const imageTools = [
    { href: "/image-compress", icon: Image, title: t("home.tools.imageCompress.title"), desc: t("home.tools.imageCompress.desc"), code: "PIX.01" },
    { href: "/image-watermark", icon: Droplets, title: t("home.tools.imageWatermark.title"), desc: t("home.tools.imageWatermark.desc"), code: "PIX.02" },
  ];

  const stats = [
    { value: "24", label: "ACTIVE MODULES" },
    { value: "256", label: "BIT ENCRYPTION" },
    { value: "00", label: "ACCOUNT REQUIRED" },
  ];

  const goToConverter = () => {
    window.location.href = "/pdf-to-word";
  };

  return (
    <div className="void-page min-h-screen overflow-hidden">
      <section className="void-hero">
        <div className="void-noise" />
        <div className="void-grid" />
        <div className="void-glow void-glow-a" />
        <div className="void-glow void-glow-b" />

        <div className="void-hero-shell">
          <div className="void-hero-copy">
            <div className="void-system-line">
              <span><Radio className="h-3.5 w-3.5" /> SYSTEM ONLINE</span>
              <span>BUILD 26.07</span>
              <span className="hidden sm:inline">SHANGHAI / CN</span>
            </div>

            <div className="void-display-wrap">
              <span className="void-vertical-label">DOCUMENT OPERATING SYSTEM</span>
              <h1 className="void-display">
                <span>PDF</span>
                <span className="void-display-slash">/</span>
                <span className="void-display-ghost">VOID</span>
              </h1>
              <div className="void-crosshair" aria-hidden="true"><span /><span /></div>
            </div>

            <div className="void-hero-bottom">
              <div className="void-intro">
                <span className="void-index">[ 001 ]</span>
                <div>
                  <p className="void-intro-title">{t("home.title1")}{t("home.title2")}</p>
                  <p>{t("home.subtitle")}</p>
                </div>
              </div>
              <div className="void-stat-row">
                {stats.map((stat) => (
                  <div key={stat.label} className="void-stat">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="void-console-wrap">
            <div className="void-orbit void-orbit-one" />
            <div className="void-orbit void-orbit-two" />
            <div className="void-console">
              <div className="void-console-bar">
                <span>INGEST_TERMINAL</span>
                <div><i /><i /><i /></div>
              </div>
              <button
                type="button"
                onClick={goToConverter}
                onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => { event.preventDefault(); setDragOver(false); goToConverter(); }}
                className={`void-drop group ${dragOver ? "is-dragging" : ""}`}
              >
                <span className="void-scanline" />
                <span className="void-corner void-corner-tl" />
                <span className="void-corner void-corner-tr" />
                <span className="void-corner void-corner-bl" />
                <span className="void-corner void-corner-br" />
                <span className="void-file-stack" aria-hidden="true">
                  <i /><i /><b><Upload className="h-8 w-8" /></b>
                </span>
                <strong>{t("home.dragDrop")}</strong>
                <small>{t("home.supportedFormats")}</small>
                <span className="void-command"><Command className="h-4 w-4" /> {t("home.convertNow")} <ArrowRight className="h-4 w-4" /></span>
              </button>
              <div className="void-console-foot">
                <span><Fingerprint className="h-3.5 w-3.5" /> PRIVATE SESSION</span>
                <span>PDF / DOCX / JPG</span>
              </div>
            </div>
          </div>
        </div>

        <div className="void-ticker" aria-hidden="true">
          <div>
            <span>CONVERT WITHOUT LIMITS</span><i>✦</i><span>ZERO FRICTION</span><i>✦</i><span>FILES IN MOTION</span><i>✦</i>
            <span>CONVERT WITHOUT LIMITS</span><i>✦</i><span>ZERO FRICTION</span><i>✦</i><span>FILES IN MOTION</span><i>✦</i>
          </div>
        </div>
      </section>

      <section id="tools" className="void-tools-section">
        <div className="void-section-head">
          <div>
            <span className="void-eyebrow"><Sparkles className="h-4 w-4" /> MODULE DIRECTORY</span>
            <h2>{t("home.allTools")}<sup>{pdfTools.length + imageTools.length}</sup></h2>
          </div>
          <p>选择模块，投入文件，让文档穿过我们的处理引擎。没有复杂设置，只有结果。</p>
        </div>

        <div className="void-tool-grid">
          {pdfTools.map((tool, index) => (
            <ToolCard key={tool.href} tool={tool} index={index} />
          ))}
          {imageTools.map((tool, index) => (
            <ToolCard key={tool.href} tool={tool} index={pdfTools.length + index} />
          ))}
        </div>
      </section>

      <section className="void-proof-section">
        <div className="void-proof-shell">
          <div className="void-proof-title">
            <span>WHY / PDF VOID</span>
            <h2>FAST.<br />PRIVATE.<br /><em>GONE.</em></h2>
            <p>{t("home.whyChooseUsDesc")}</p>
          </div>
          <div className="void-proof-grid">
            <Proof icon={Zap} index="01" title={t("home.advantages.fast.title")} desc={t("home.advantages.fast.desc")} />
            <Proof icon={LockKeyhole} index="02" title={t("home.advantages.security.title")} desc={t("home.advantages.security.desc")} />
            <Proof icon={Check} index="03" title={t("home.advantages.free.title")} desc={t("home.advantages.free.desc")} />
            <Proof icon={Clock3} index="04" title={t("home.advantages.accurate.title")} desc={t("home.advantages.accurate.desc")} />
          </div>
        </div>
      </section>

      <section className="void-final-section">
        <div className="void-final-card">
          <span className="void-final-code">ENDPOINT / 01</span>
          <div className="void-final-copy">
            <h2>{t("home.readyTitle")}</h2>
            <p>{t("home.readyDesc")}</p>
          </div>
          <Link href="/pdf-to-word" className="void-final-button">
            <span>{t("home.convertNow")}</span><ArrowUpRight className="h-8 w-8" />
          </Link>
          <div className="void-final-orb" />
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
  code: string;
};

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const tone = toolTones[index % toolTones.length];
  return (
    <Link href={tool.href} className={`void-tool-card void-tone-${tone} group`}>
      <div className="void-tool-top">
        <span>{tool.code}</span>
        <ArrowUpRight className="h-4 w-4" />
      </div>
      <div className="void-tool-icon"><tool.icon className="h-7 w-7" /></div>
      <div className="void-tool-copy">
        <h3>{tool.title}</h3>
        <p>{tool.desc}</p>
      </div>
      <span className="void-tool-number">{String(index + 1).padStart(2, "0")}</span>
    </Link>
  );
}

function Proof({ icon: Icon, index, title, desc }: { icon: React.ComponentType<{ className?: string }>; index: string; title: string; desc: string }) {
  return (
    <article className="void-proof-card">
      <div><span>{index}</span><Icon className="h-6 w-6" /></div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </article>
  );
}
