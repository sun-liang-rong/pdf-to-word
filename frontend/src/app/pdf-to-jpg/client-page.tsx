"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { FileImage } from "lucide-react";

export default function PdfToJpgClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.pdfToJpg.faq.0.q"), answer: t("tools_detail.pdfToJpg.faq.0.a") },
    { question: t("tools_detail.pdfToJpg.faq.1.q"), answer: t("tools_detail.pdfToJpg.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.pdfToJpg.features.accurate.label"), desc: t("tools_detail.pdfToJpg.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.pdfToJpg.title")}
      description={t("tools_detail.pdfToJpg.description")}
      conversionType="pdf-to-jpg"
      accept={{ "application/pdf": ['.pdf'] }}
      icon={<FileImage className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-orange-500 to-red-500"
      outputExtension=".jpg"
      faqItems={faqItems}
      features={features}
    />
  );
}
