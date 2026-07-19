"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";

export default function Client() {
  const [pages, setPages] = useState("all");
  return (
    <PdfOperationShell title="PDF 转 Excel" description="提取 PDF 表格并导出为可编辑 XLSX 工作簿。" icon={<FileSpreadsheet className="h-8 w-8" />} gradient="" endpoint="pdf-to-excel" outputSuffix="-converted.xlsx" fields={{ pageNumbers: pages }}>
      <label className="text-sm text-theme">转换页码
        <input value={pages} onChange={(event) => setPages(event.target.value)} placeholder="all 或 1-3,5" className="mt-2 w-full rounded-xl border border-theme bg-theme-secondary p-3 text-theme" />
      </label>
    </PdfOperationShell>
  );
}
