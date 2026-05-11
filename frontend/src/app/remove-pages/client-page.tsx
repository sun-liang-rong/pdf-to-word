"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { Scissors } from "lucide-react";

const faqItems = [{'question': '可以删除多个页面吗？', 'answer': '可以，支持删除单个或多个PDF页面。'}, {'question': '删除后的页面可以恢复吗？', 'answer': '删除操作不可恢复，请确认后再进行操作。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '精准删除', 'desc': '指定页面'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="PDF删除页面工具"
      description="免费删除PDF文件中的指定页面，保留其他页面"
      conversionType="remove-pages"
      accept={{"application/pdf": ['.pdf']}}
      icon={<Scissors className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-amber-500 to-orange-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
