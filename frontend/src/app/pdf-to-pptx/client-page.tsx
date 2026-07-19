"use client";

import { Presentation } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";

export default function Client() {
  return <PdfOperationShell title="PDF 转 PowerPoint" description="将 PDF 页面转换为可编辑的 PPTX 演示文稿。" icon={<Presentation className="h-8 w-8" />} gradient="" endpoint="pdf-to-pptx" outputSuffix="-converted.pptx" fields={{}} />;
}
