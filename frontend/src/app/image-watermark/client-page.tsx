"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { Droplets } from "lucide-react";

export default function ImageWatermarkClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.imageWatermark.faq.0.q"), answer: t("tools_detail.imageWatermark.faq.0.a") },
    { question: t("tools_detail.imageWatermark.faq.1.q"), answer: t("tools_detail.imageWatermark.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.imageWatermark.features.accurate.label"), desc: t("tools_detail.imageWatermark.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.imageWatermark.title")}
      description={t("tools_detail.imageWatermark.description")}
      conversionType="image-watermark"
      accept={{ "image/jpeg": ['.jpg', '.jpeg'], "image/png": ['.png'] }}
      icon={<Droplets className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-sky-500 to-indigo-500"
      outputExtension=".jpg"
      faqItems={faqItems}
      features={features}
    />
  );
}
