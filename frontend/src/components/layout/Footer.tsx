"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, Radio, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const toolLinks = [
  ["PDF 转 Word", "/pdf-to-word"],
  ["Word 转 PDF", "/word-to-pdf"],
  ["合并 PDF", "/merge-pdf"],
  ["压缩 PDF", "/compress-pdf"],
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="void-footer">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="void-footer-marquee" aria-hidden="true">
          <span>PDF / VOID</span><i>DOCUMENTS IN MOTION</i><span>PDF / VOID</span><i>DOCUMENTS IN MOTION</i>
        </div>
        <div className="void-footer-grid">
          <div className="void-footer-brand">
            <Link href="/" aria-label="PDF VOID 首页">PDF<span>/VOID</span></Link>
            <p>不注册，不绕路。一个为高效文档工作而生的在线处理系统。</p>
            <div><Radio className="h-3.5 w-3.5" /> ALL SYSTEMS NOMINAL</div>
          </div>

          <div className="void-footer-column">
            <span className="void-footer-label">01 / MODULES</span>
            {toolLinks.map(([label, href]) => (
              <Link key={href} href={href}>{label}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            ))}
          </div>

          <div className="void-footer-column">
            <span className="void-footer-label">02 / INDEX</span>
            <Link href="/blog">博客<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/about">{t("footer.about")}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/privacy">{t("footer.privacy")}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/terms">{t("footer.terms")}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="void-footer-trust">
            <span className="void-footer-label">03 / PROTOCOL</span>
            <div><ShieldCheck className="h-5 w-5" /><span>{t("footer.sslEncrypted")}<small>256-BIT TRANSPORT</small></span></div>
            <div><Clock3 className="h-5 w-5" /><span>{t("footer.autoDelete")}<small>EPHEMERAL STORAGE</small></span></div>
          </div>
        </div>
        <div className="void-footer-bottom">
          <span>© {currentYear} PDF/VOID — {t("footer.copyright")}</span>
          <span>BUILT FOR DOCUMENT PEOPLE / V.26.07</span>
        </div>
      </div>
    </footer>
  );
}
