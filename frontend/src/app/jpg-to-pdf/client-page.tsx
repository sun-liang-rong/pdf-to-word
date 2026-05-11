"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { Image } from "lucide-react";

const faqItems = [{'question': '支持多张图片合并吗？', 'answer': '可以，您可以上传多张图片，我们会将它们合并为一个PDF文件。'}, {'question': '支持哪些图片格式？', 'answer': '支持JPG、JPEG、PNG等常见图片格式。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '批量合并', 'desc': '多图合一'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="JPG转PDF在线转换器"
      description="免费将JPG/PNG图片合并转换为PDF文件，支持多图片合并"
      conversionType="jpg-to-pdf"
      accept={{"image/jpeg": ['.jpg', '.jpeg'], "image/png": ['.png']}}
      icon={<Image className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-green-500 to-teal-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
