"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { SplitSquareHorizontal } from "lucide-react";

const faqItems = [{'question': '可以按页码范围拆分吗？', 'answer': '支持按页码范围或单页拆分PDF文件。'}, {'question': '拆分后的文件质量如何？', 'answer': '拆分后的PDF保留原有的质量和格式。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '灵活拆分', 'desc': '按页拆分'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="PDF拆分在线工具"
      description="免费将PDF文件拆分为多个文档，支持按页拆分"
      conversionType="split-pdf"
      accept={{"application/pdf": ['.pdf']}}
      icon={<SplitSquareHorizontal className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-cyan-500 to-blue-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
