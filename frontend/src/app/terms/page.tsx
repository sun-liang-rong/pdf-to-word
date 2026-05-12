"use client";

import { FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function TermsPage() {
  const { t } = useI18n();

  const services = [
    t("terms.services.0"), t("terms.services.1"), t("terms.services.2"), t("terms.services.3"),
    t("terms.services.4"), t("terms.services.5"), t("terms.services.6"), t("terms.services.7"),
    t("terms.services.8"), t("terms.services.9"), t("terms.services.10"),
  ];

  const usageRules = [
    t("terms.usageRules.0"), t("terms.usageRules.1"), t("terms.usageRules.2"),
    t("terms.usageRules.3"), t("terms.usageRules.4"),
  ];

  const sections = [
    { title: t("terms.sections.accept.title"), content: t("terms.sections.accept.content") },
    { title: t("terms.sections.description.title"), content: t("terms.sections.description.content"), serviceList: services },
    { title: t("terms.sections.rules.title"), content: t("terms.sections.rules.content"), ruleList: usageRules, warning: t("terms.sections.rules.warning") },
    { title: t("terms.sections.ip.title"), content: t("terms.sections.ip.content"), extra: t("terms.sections.ip.extra") },
    { title: t("terms.sections.privacy.title"), content: t("terms.sections.privacy.content"), list: [t("terms.sections.privacy.items.0"), t("terms.sections.privacy.items.1"), t("terms.sections.privacy.items.2")] },
    { title: t("terms.sections.disclaimer.title"), content: t("terms.sections.disclaimer.content"), list: [t("terms.sections.disclaimer.items.0"), t("terms.sections.disclaimer.items.1"), t("terms.sections.disclaimer.items.2"), t("terms.sections.disclaimer.items.3")], extra: t("terms.sections.disclaimer.extra") },
    { title: t("terms.sections.liability.title"), content: t("terms.sections.liability.content"), list: [t("terms.sections.liability.items.0"), t("terms.sections.liability.items.1"), t("terms.sections.liability.items.2"), t("terms.sections.liability.items.3")] },
    { title: t("terms.sections.termination.title"), content: t("terms.sections.termination.content"), list: [t("terms.sections.termination.items.0"), t("terms.sections.termination.items.1"), t("terms.sections.termination.items.2")] },
    { title: t("terms.sections.changes.title"), content: t("terms.sections.changes.content") },
    { title: t("terms.sections.law.title"), content: t("terms.sections.law.content") },
    { title: t("terms.sections.contact.title"), content: t("terms.sections.contact.content"), contact: true },
  ];

  return (
    <div className="min-h-screen bg-theme">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl" />
      </div>

      <section className="relative pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4 mr-2" />
              <span className="text-theme-muted">{t("terms.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-theme mb-6">{t("terms.title")}</h1>
            <p className="text-lg text-theme-muted">{t("terms.lastUpdated")}</p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-theme mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">{index + 1}</span>
                  {section.title}
                </h2>
                <p className="text-theme-muted leading-relaxed mb-4">{section.content}</p>
                {section.serviceList && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {section.serviceList.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-theme-muted">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.ruleList && (
                  <ul className="space-y-3 ml-4 mb-4">
                    {section.ruleList.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-theme-muted">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.warning && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                    <p className="text-amber-500 font-medium">{section.warning}</p>
                  </div>
                )}
                {section.list && (
                  <ul className="space-y-3 ml-4 mb-4">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-theme-muted">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.extra && <p className="text-theme-muted leading-relaxed mt-4">{section.extra}</p>}
                {section.contact && (
                  <div className="mt-6 space-y-3">
                    <p className="text-theme-muted">
                      <strong className="text-theme">{t("terms.email")}：</strong>
                      <a href="mailto:2531636478@qq.com" className="text-indigo-500 hover:text-indigo-400 transition-colors ml-2">2531636478@qq.com</a>
                    </p>
                    <p className="text-theme-muted">
                      <strong className="text-theme">{t("terms.github")}：</strong>
                      <a href="https://github.com/sun-liang-rong" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-400 transition-colors ml-2">github.com/sun-liang-rong</a>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
