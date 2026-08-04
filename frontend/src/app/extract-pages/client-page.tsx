"use client";

import { useState } from "react";
import { Files } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";
import { parsePageExpression } from "@/lib/pdf-page-expression";

export default function ExtractPagesClient() {
  const [expression, setExpression] = useState("1");
  const result = parsePageExpression(expression);
  return (
    <PdfOperationShell title="提取 PDF 页面" description="输入需要保留的页码，将选定页面按原顺序生成一个新 PDF。" icon={<Files className="w-8 h-8" />} gradient="bg-gradient-to-r from-cyan-500 to-blue-500" endpoint="extract-pages" outputSuffix="-extracted.pdf" fields={{ pageNumbers: result.valid ? result.normalized : expression }} canSubmit={result.valid} validationMessage={result.valid ? `将提取 ${result.pages.length} 个页面` : result.error}>
      <div>
        <label htmlFor="pageNumbers" className="block text-sm font-semibold text-theme mb-2">页码范围</label>
        <input id="pageNumbers" value={expression} onChange={(event) => setExpression(event.target.value)} placeholder="例如：1,3-5,8" className="w-full px-4 py-4 rounded-2xl bg-theme-secondary border border-theme text-theme outline-none focus:border-cyan-500" />
        <p className="mt-2 text-xs text-theme-muted">支持单页、连续范围和组合，例如 1,3-5,8。</p>
      </div>
    </PdfOperationShell>
  );
}
