"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { Merge } from "lucide-react";

const faqItems = [{'question': '可以合并多个PDF文件吗？', 'answer': '可以，您可以上传多个PDF文件，我们会将它们合并为一个文件。'}, {'question': '合并后的顺序可以调整吗？', 'answer': '是的，上传后可以调整PDF文件的顺序。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '顺序可调', 'desc': '自定义顺序'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="PDF合并在线工具"
      description="免费将多个PDF文件合并为一个PDF文档，保留原有格式"
      conversionType="merge-pdf"
      accept={{"application/pdf": ['.pdf']}}
      icon={<Merge className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
