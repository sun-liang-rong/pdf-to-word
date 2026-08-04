"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { ArrowUpDown } from "lucide-react";

export default function RearrangePdfClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.rearrangePdf.faq.0.q"), answer: t("tools_detail.rearrangePdf.faq.0.a") },
    { question: t("tools_detail.rearrangePdf.faq.1.q"), answer: t("tools_detail.rearrangePdf.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.rearrangePdf.features.accurate.label"), desc: t("tools_detail.rearrangePdf.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.rearrangePdf.title")}
      description={t("tools_detail.rearrangePdf.description")}
      conversionType="rearrange-pdf"
      accept={{ "application/pdf": ['.pdf'] }}
      icon={<ArrowUpDown className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-violet-500 to-purple-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
