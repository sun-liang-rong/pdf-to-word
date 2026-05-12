"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { Scissors } from "lucide-react";

export default function RemovePagesClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.removePages.faq.0.q"), answer: t("tools_detail.removePages.faq.0.a") },
    { question: t("tools_detail.removePages.faq.1.q"), answer: t("tools_detail.removePages.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.removePages.features.accurate.label"), desc: t("tools_detail.removePages.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.removePages.title")}
      description={t("tools_detail.removePages.description")}
      conversionType="remove-pages"
      accept={{ "application/pdf": ['.pdf'] }}
      icon={<Scissors className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-amber-500 to-orange-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
