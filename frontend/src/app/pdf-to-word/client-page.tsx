"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { FileText } from "lucide-react";

export default function PdfToWordClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.pdfToWord.faq.0.q"), answer: t("tools_detail.pdfToWord.faq.0.a") },
    { question: t("tools_detail.pdfToWord.faq.1.q"), answer: t("tools_detail.pdfToWord.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.pdfToWord.features.accurate.label"), desc: t("tools_detail.pdfToWord.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.pdfToWord.title")}
      description={t("tools_detail.pdfToWord.description")}
      conversionType="pdf-to-word"
      accept={{ "application/pdf": ['.pdf'] }}
      icon={<FileText className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
      outputExtension=".docx"
      faqItems={faqItems}
      features={features}
    />
  );
}
