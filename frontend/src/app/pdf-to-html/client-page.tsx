"use client";

import { FileCode2 } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";

export default function Client() {
  return <PdfOperationShell title="PDF 转 HTML" description="将 PDF 内容转换为 HTML 网页资源压缩包。" icon={<FileCode2 className="h-8 w-8" />} gradient="" endpoint="pdf-to-html" outputSuffix="-converted.zip" fields={{}} />;
}
