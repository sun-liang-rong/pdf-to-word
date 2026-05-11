"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { Minimize2 } from "lucide-react";

const faqItems = [{'question': '压缩后画质会受影响吗？', 'answer': '我们采用智能压缩算法，在减小文件大小的同时尽可能保持画质。'}, {'question': '可以压缩到多小？', 'answer': '压缩效果取决于原PDF的内容，通常可减小30-70%的体积。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '高压缩比', 'desc': '减小体积'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="PDF压缩在线工具"
      description="免费压缩PDF文件大小，减小体积的同时保持画质"
      conversionType="compress-pdf"
      accept={{"application/pdf": ['.pdf']}}
      icon={<Minimize2 className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-pink-500 to-rose-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
