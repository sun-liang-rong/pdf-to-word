"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { Image } from "lucide-react";

const faqItems = [{'question': '压缩后图片质量如何？', 'answer': '我们采用智能压缩算法，在减小文件大小的同时尽可能保持画质。'}, {'question': '支持批量压缩吗？', 'answer': '支持多张图片批量压缩，提高效率。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '高压缩比', 'desc': '减小体积'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="图片压缩在线工具"
      description="免费压缩JPG/PNG图片文件大小，减小体积的同时保持画质"
      conversionType="image-compress"
      accept={{"image/jpeg": ['.jpg', '.jpeg'], "image/png": ['.png']}}
      icon={<Image className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-emerald-500 to-teal-500"
      outputExtension=".jpg"
      faqItems={faqItems}
      features={features}
    />
  );
}
