"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { Minimize2 } from "lucide-react";

export default function CompressPdfClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.compressPdf.faq.0.q"), answer: t("tools_detail.compressPdf.faq.0.a") },
    { question: t("tools_detail.compressPdf.faq.1.q"), answer: t("tools_detail.compressPdf.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.compressPdf.features.accurate.label"), desc: t("tools_detail.compressPdf.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.compressPdf.title")}
      description={t("tools_detail.compressPdf.description")}
      conversionType="compress-pdf"
      accept={{ "application/pdf": ['.pdf'] }}
      icon={<Minimize2 className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-pink-500 to-rose-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
