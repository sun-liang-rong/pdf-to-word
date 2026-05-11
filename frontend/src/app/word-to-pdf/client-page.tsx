"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { FileUp } from "lucide-react";

const faqItems = [{'question': 'Word转PDF后格式会变化吗？', 'answer': '我们的转换引擎能够完美保留Word文档的格式、图片、表格和排版。'}, {'question': '支持哪些Word格式？', 'answer': '支持.doc和.docx两种Word格式，推荐使用.docx格式以获得最佳转换效果。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '精准还原', 'desc': '保留原格式'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="Word转PDF在线转换器"
      description="免费将Word文档(.doc/.docx)转换为PDF格式，完美保留原有排版和格式"
      conversionType="word-to-pdf"
      accept={{"application/msword": ['.doc'], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ['.docx']}}
      icon={<FileUp className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-purple-500 to-pink-500"
      outputExtension=".pdf"
      faqItems={faqItems}
      features={features}
    />
  );
}
