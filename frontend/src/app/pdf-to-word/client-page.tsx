"use client";

import ConversionPageTemplate from "@/components/conversion/ConversionPageTemplate";
import { FileText } from "lucide-react";

const faqItems = [{'question': 'PDF转Word后格式会乱吗？', 'answer': '我们的转换引擎采用先进的OCR技术和格式识别算法，能够最大程度保留原文档的排版、图片和表格。'}, {'question': '扫描版PDF能转换吗？', 'answer': '可以。我们的系统支持OCR识别，能够将扫描版PDF转换为可编辑的Word文档。'}];

const features = [{'icon': '⚡', 'label': '极速转换', 'desc': '15秒内完成'}, {'icon': '🔒', 'label': '安全保障', 'desc': '30分钟删除'}, {'icon': '🎯', 'label': '精准还原', 'desc': '保留原格式'}];

export default function ClientPage() {
  return (
    <ConversionPageTemplate
      title="PDF转Word在线转换器"
      description="免费将PDF文件转换为可编辑的Word文档(.doc/.docx)，保留原有格式和排版"
      conversionType="pdf-to-word"
      accept={{"application/pdf": ['.pdf']}}
      icon={<FileText className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
      outputExtension=".docx"
      faqItems={faqItems}
      features={features}
    />
  );
}
