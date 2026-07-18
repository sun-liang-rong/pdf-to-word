"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, ShieldCheck } from "lucide-react";
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
    <footer className="studio-footer">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="studio-footer-grid">
          <div className="studio-footer-brand">
            <Link href="/" className="studio-footer-logo" aria-label="PDF LAB 首页">
              <span>PDF</span><span>/LAB</span>
            </Link>
            <p>一个快速、直接、不制造麻烦的在线文档工作台。</p>
            <div className="studio-footer-status"><span /> SYSTEM ONLINE</div>
          </div>

          <div className="studio-footer-column">
            <span className="studio-footer-label">TOOLS / 工具</span>
            {toolLinks.map(([label, href]) => (
              <Link key={href} href={href}>{label}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            ))}
          </div>

          <div className="studio-footer-column">
            <span className="studio-footer-label">INFO / 信息</span>
            <Link href="/blog">博客<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/about">{t("footer.about")}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/privacy">{t("footer.privacy")}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/terms">{t("footer.terms")}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="studio-footer-trust">
            <span className="studio-footer-label">SECURITY / 安全</span>
            <div><ShieldCheck className="h-5 w-5" /><span>{t("footer.sslEncrypted")}<small>传输过程全程加密</small></span></div>
            <div><Clock3 className="h-5 w-5" /><span>{t("footer.autoDelete")}<small>临时文件定时清理</small></span></div>
          </div>
        </div>

        <div className="studio-footer-bottom">
          <span>© {currentYear} PDF/LAB — {t("footer.copyright")}</span>
          <span>BUILT FOR DOCUMENT PEOPLE</span>
        </div>
      </div>
    </footer>
  );
}
