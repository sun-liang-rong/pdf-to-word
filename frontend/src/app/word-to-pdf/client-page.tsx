"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { FileUp } from "lucide-react";

export default function WordToPdfClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.wordToPdf.faq.0.q"), answer: t("tools_detail.wordToPdf.faq.0.a") },
    { question: t("tools_detail.wordToPdf.faq.1.q"), answer: t("tools_detail.wordToPdf.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.wordToPdf.features.accurate.label"), desc: t("tools_detail.wordToPdf.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.wordToPdf.title")}
      description={t("tools_detail.wordToPdf.description")}
      conversionType="word-to-pdf"
      accept={{
        "application/msword": ['.doc'],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ['.docx'],
      }}
      icon={<FileUp className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-purple-500 to-pink-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
