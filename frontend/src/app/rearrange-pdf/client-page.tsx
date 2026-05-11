"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { ArrowUpDown } from "lucide-react";

const faqItems = [{'question': '如何调整页面顺序？', 'answer': '上传后可以通过拖拽方式调整PDF页面的顺序。'}, {'question': '可以复制页面吗？', 'answer': '支持复制PDF中的页面，生成包含重复页面的新PDF。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '拖拽排序', 'desc': '轻松调整'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="PDF页面排序工具"
      description="免费调整PDF文件中页面的顺序，支持拖拽排序"
      conversionType="rearrange-pdf"
      accept={{"application/pdf": ['.pdf']}}
      icon={<ArrowUpDown className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-violet-500 to-purple-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
