"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { Droplets } from "lucide-react";

const faqItems = [{'question': '支持文字水印吗？', 'answer': '支持添加自定义文字水印，可以设置字体、颜色和位置。'}, {'question': '可以调整水印透明度吗？', 'answer': '支持调整水印的透明度和旋转角度。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '自定义样式', 'desc': '灵活设置'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="图片水印在线工具"
      description="免费为图片添加文字或图片水印，支持自定义水印样式"
      conversionType="image-watermark"
      accept={{"image/jpeg": ['.jpg', '.jpeg'], "image/png": ['.png']}}
      icon={<Droplets className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-sky-500 to-indigo-500"
      outputExtension=".jpg"
      faqItems={faqItems}
      features={features}
    />
  );
}
