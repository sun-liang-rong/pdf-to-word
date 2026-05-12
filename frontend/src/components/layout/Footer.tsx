"use client";

import Link from "next/link";
import { Shield, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="bg-theme-card border-t border-theme theme-transition">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold gradient-text">PDF转换器</span>
            </div>
            <span className="text-sm text-theme-muted">&copy; {currentYear} {t("footer.copyright")}</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-theme-muted">
            <Link href="/privacy" className="hover:text-indigo-500 transition-colors">{t("footer.privacy")}</Link>
            <Link href="/terms" className="hover:text-indigo-500 transition-colors">{t("footer.terms")}</Link>
            <Link href="/about" className="hover:text-indigo-500 transition-colors">{t("footer.about")}</Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-theme-muted">
              <Shield className="w-4 h-4 text-emerald-500" />
              {t("footer.sslEncrypted")}
            </span>
            <span className="flex items-center gap-2 text-sm text-theme-muted">
              <Clock className="w-4 h-4 text-indigo-500" />
              {t("footer.autoDelete")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
