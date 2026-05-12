"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { Merge } from "lucide-react";

export default function MergePdfClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.mergePdf.faq.0.q"), answer: t("tools_detail.mergePdf.faq.0.a") },
    { question: t("tools_detail.mergePdf.faq.1.q"), answer: t("tools_detail.mergePdf.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.mergePdf.features.accurate.label"), desc: t("tools_detail.mergePdf.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.mergePdf.title")}
      description={t("tools_detail.mergePdf.description")}
      conversionType="merge-pdf"
      accept={{ "application/pdf": ['.pdf'] }}
      icon={<Merge className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
