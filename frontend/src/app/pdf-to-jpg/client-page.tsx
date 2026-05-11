"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { FileImage } from "lucide-react";

const faqItems = [{'question': 'PDF的每一页都会转换为图片吗？', 'answer': '是的，PDF的每一页都会被转换为单独的JPG图片文件。'}, {'question': '转换后的图片质量如何？', 'answer': '我们会以高质量进行转换，确保图片清晰可读。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '高清画质', 'desc': '保留清晰度'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="PDF转JPG在线转换器"
      description="免费将PDF文件转换为JPG/PNG图片格式，支持单页或批量转换"
      conversionType="pdf-to-jpg"
      accept={{"application/pdf": ['.pdf']}}
      icon={<FileImage className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-orange-500 to-red-500"
      outputExtension=".jpg"
      faqItems={faqItems}
      features={features}
    />
  );
}
