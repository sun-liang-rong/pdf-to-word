"use client";

import { Shield, Lock, Trash2, CheckCircle, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t } = useI18n();

  const securityFeatures = [
    { icon: <Lock className="w-6 h-6" />, title: t("privacy.features.ssl.title"), description: t("privacy.features.ssl.desc") },
    { icon: <Trash2 className="w-6 h-6" />, title: t("privacy.features.autoDelete.title"), description: t("privacy.features.autoDelete.desc") },
    { icon: <EyeOff className="w-6 h-6" />, title: t("privacy.features.noStore.title"), description: t("privacy.features.noStore.desc") },
  ];

  const sections = [
    { title: t("privacy.sections.intro.title"), content: t("privacy.sections.intro.content") },
    { title: t("privacy.sections.collection.title"), content: t("privacy.sections.collection.content"), list: [t("privacy.sections.collection.items.0"), t("privacy.sections.collection.items.1"), t("privacy.sections.collection.items.2")] },
    { title: t("privacy.sections.usage.title"), content: t("privacy.sections.usage.content"), list: [t("privacy.sections.usage.items.0"), t("privacy.sections.usage.items.1"), t("privacy.sections.usage.items.2"), t("privacy.sections.usage.items.3")] },
    { title: t("privacy.sections.thirdParty.title"), content: t("privacy.sections.thirdParty.content"), list: [t("privacy.sections.thirdParty.items.0"), t("privacy.sections.thirdParty.items.1")] },
    { title: t("privacy.sections.cookies.title"), content: t("privacy.sections.cookies.content"), list: [t("privacy.sections.cookies.items.0"), t("privacy.sections.cookies.items.1")], extra: t("privacy.sections.cookies.extra") },
    { title: t("privacy.sections.rights.title"), content: t("privacy.sections.rights.content"), list: [t("privacy.sections.rights.items.0"), t("privacy.sections.rights.items.1"), t("privacy.sections.rights.items.2"), t("privacy.sections.rights.items.3")] },
    { title: t("privacy.sections.children.title"), content: t("privacy.sections.children.content") },
    { title: t("privacy.sections.changes.title"), content: t("privacy.sections.changes.content") },
    { title: t("privacy.sections.contact.title"), content: t("privacy.sections.contact.content"), contact: true },
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
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-theme-muted">{t("privacy.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-theme mb-6">{t("privacy.title")}</h1>
            <p className="text-lg text-theme-muted">{t("privacy.lastUpdated")}</p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="glass-card rounded-3xl p-6 hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-4 text-emerald-500">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-theme mb-2">{feature.title}</h3>
                <p className="text-sm text-theme-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-theme mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">{index + 1}</span>
                  {section.title}
                </h2>
                <p className="text-theme-muted leading-relaxed mb-4">{section.content}</p>
                {section.list && (
                  <ul className="space-y-3 ml-4">
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
                      <strong className="text-theme">{t("privacy.email")}：</strong>
                      <a href="mailto:2531636478@qq.com" className="text-indigo-500 hover:text-indigo-400 transition-colors ml-2">2531636478@qq.com</a>
                    </p>
                    <p className="text-theme-muted">
                      <strong className="text-theme">{t("privacy.github")}：</strong>
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
