"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { Image } from "lucide-react";

export default function JpgToPdfClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.jpgToPdf.faq.0.q"), answer: t("tools_detail.jpgToPdf.faq.0.a") },
    { question: t("tools_detail.jpgToPdf.faq.1.q"), answer: t("tools_detail.jpgToPdf.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.jpgToPdf.features.accurate.label"), desc: t("tools_detail.jpgToPdf.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.jpgToPdf.title")}
      description={t("tools_detail.jpgToPdf.description")}
      conversionType="jpg-to-pdf"
      accept={{ "image/jpeg": ['.jpg', '.jpeg'], "image/png": ['.png'] }}
      icon={<Image className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-green-500 to-teal-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
