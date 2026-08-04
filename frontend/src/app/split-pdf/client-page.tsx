"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { SplitSquareHorizontal } from "lucide-react";

export default function SplitPdfClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.splitPdf.faq.0.q"), answer: t("tools_detail.splitPdf.faq.0.a") },
    { question: t("tools_detail.splitPdf.faq.1.q"), answer: t("tools_detail.splitPdf.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.splitPdf.features.accurate.label"), desc: t("tools_detail.splitPdf.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.splitPdf.title")}
      description={t("tools_detail.splitPdf.description")}
      conversionType="split-pdf"
      accept={{ "application/pdf": ['.pdf'] }}
      icon={<SplitSquareHorizontal className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-cyan-500 to-blue-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
