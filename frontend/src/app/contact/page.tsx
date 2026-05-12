"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function ContactPage() {
  const { t } = useI18n();

  const faqItems = [
    { q: t("contact.faqItems.feedback.q"), a: t("contact.faqItems.feedback.a") },
    { q: t("contact.faqItems.bug.q"), a: t("contact.faqItems.bug.a") },
    { q: t("contact.faqItems.replyTime.q"), a: t("contact.faqItems.replyTime.a") },
    { q: t("contact.faqItems.api.q"), a: t("contact.faqItems.api.a") },
  ];

  return (
    <div className="min-h-screen bg-theme">
      <section className="relative pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <span className="mr-2">📧</span>
              <span className="text-theme-muted">{t("contact.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-theme mb-6">{t("contact.title")}</h1>
            <p className="text-lg text-theme-muted leading-relaxed max-w-2xl mx-auto">{t("contact.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-theme text-center mb-12">{t("contact.contactMethods")}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-theme mb-4">{t("contact.email")}</h3>
              <p className="text-theme-muted mb-4">{t("contact.emailDesc")}</p>
              <a href="mailto:2531636478@qq.com" className="inline-flex items-center text-indigo-500 hover:text-indigo-400 transition-colors font-medium">
                2531636478@qq.com
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-theme mb-4">{t("contact.github")}</h3>
              <p className="text-theme-muted mb-4">{t("contact.githubDesc")}</p>
              <a href="https://github.com/sun-liang-rong" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-500 hover:text-indigo-400 transition-colors font-medium">
                github.com/sun-liang-rong
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-theme-secondary">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-theme text-center mb-12">{t("contact.faq")}</h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-theme mb-3">{faq.q}</h3>
                <p className="text-theme-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-theme mb-4">{t("contact.startNow")}</h2>
          <p className="text-theme-muted mb-6">{t("contact.startNowDesc")}</p>
          <Link href="/pdf-to-word" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg">
            {t("contact.startConvert")}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
