"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { useI18n } from "@/lib/i18n";
import { Image } from "lucide-react";

export default function ImageCompressClient() {
  const { t } = useI18n();

  const faqItems = [
    { question: t("tools_detail.imageCompress.faq.0.q"), answer: t("tools_detail.imageCompress.faq.0.a") },
    { question: t("tools_detail.imageCompress.faq.1.q"), answer: t("tools_detail.imageCompress.faq.1.a") },
  ];

  const features = [
    { icon: "⚡", label: t("conversion.commonFeatures.fast.label"), desc: t("conversion.commonFeatures.fast.desc") },
    { icon: "🔒", label: t("conversion.commonFeatures.secure.label"), desc: t("conversion.commonFeatures.secure.desc") },
    { icon: "🎯", label: t("tools_detail.imageCompress.features.accurate.label"), desc: t("tools_detail.imageCompress.features.accurate.desc") },
  ];

  return (
    <ConversionPageTemplate
      title={t("tools_detail.imageCompress.title")}
      description={t("tools_detail.imageCompress.description")}
      conversionType="image-compress"
      accept={{ "image/jpeg": ['.jpg', '.jpeg'], "image/png": ['.png'] }}
      icon={<Image className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-emerald-500 to-teal-500"
      outputExtension=".jpg"
      faqItems={faqItems}
      features={features}
    />
  );
}
