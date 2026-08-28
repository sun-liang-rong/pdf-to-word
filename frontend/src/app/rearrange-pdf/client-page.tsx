"use client";

import { useRef, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";
import PageExpressionInput from "@/components/remove-pages/PageExpressionInput";
import { getPDFPageCount } from "@/lib/pdf-utils";
import { useI18n } from "@/lib/i18n";

type RearrangeMode = "CUSTOM" | "REVERSE_ORDER" | "DUPLICATE" | "DUPLEX_SORT" | "BOOKLET_SORT" | "ODD_EVEN_SPLIT" | "ODD_EVEN_MERGE" | "REMOVE_FIRST" | "REMOVE_LAST" | "REMOVE_FIRST_AND_LAST";

const modes: Array<{ value: RearrangeMode; label: string; expression: string }> = [
  { value: "CUSTOM", label: "自定义顺序", expression: "" },
  { value: "REVERSE_ORDER", label: "倒序排列", expression: "all" },
  { value: "DUPLEX_SORT", label: "双面排序", expression: "all" },
  { value: "BOOKLET_SORT", label: "小册子排序", expression: "all" },
  { value: "ODD_EVEN_SPLIT", label: "奇偶页分离", expression: "all" },
  { value: "ODD_EVEN_MERGE", label: "奇偶页合并", expression: "all" },
  { value: "REMOVE_FIRST", label: "删除第一页", expression: "all" },
  { value: "REMOVE_LAST", label: "删除最后一页", expression: "all" },
  { value: "REMOVE_FIRST_AND_LAST", label: "删除首尾页", expression: "all" },
];

export default function RearrangePdfClient() {
  const { t } = useI18n();
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<RearrangeMode>("CUSTOM");
  const [pageNumbers, setPageNumbers] = useState("");
  const [pageError, setPageError] = useState<string | null>(null);
  const pageReadRequest = useRef(0);

  const handleFileChange = async (file: File | null) => {
    const requestId = ++pageReadRequest.current;
    setPageCount(0); setPageNumbers(""); setPageError(null);
    if (file) {
      try {
        const count = await getPDFPageCount(file);
        if (requestId === pageReadRequest.current) setPageCount(count);
      } catch (error) {
        if (requestId === pageReadRequest.current) setPageError(error instanceof Error ? error.message : "无法读取 PDF 文件");
      }
    }
  };

  const handleModeChange = (nextMode: RearrangeMode) => {
    setMode(nextMode);
    const selected = modes.find((item) => item.value === nextMode);
    if (selected?.expression) { setPageNumbers(selected.expression); setPageError(null); }
    else if (nextMode === "CUSTOM") setPageNumbers("");
  };

  return (
    <PdfOperationShell
      title={t("tools_detail.rearrangePdf.title")}
      description={t("tools_detail.rearrangePdf.description")}
      icon={<ArrowUpDown className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-violet-500 to-purple-500"
      endpoint="rearrange-pages"
      outputSuffix=".pdf"
      fields={{ pageNumbers, customMode: mode }}
      onFileChange={handleFileChange}
      canSubmit={pageCount > 0 && Boolean(pageNumbers) && !pageError}
      validationMessage={pageError || (!pageNumbers && pageCount > 0 ? "请输入页面顺序" : undefined)}
    >
      {pageCount > 0 && <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-theme mb-2">排列模式</label>
          <select value={mode} onChange={(event) => handleModeChange(event.target.value as RearrangeMode)} className="w-full px-4 py-2 rounded-lg border border-theme bg-theme-secondary text-theme">
            {modes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>
        {mode === "CUSTOM" && <PageExpressionInput pageCount={pageCount} onExpressionChange={(expression) => setPageNumbers(expression)} onError={setPageError} />}
        {mode !== "CUSTOM" && <p className="text-sm text-theme-muted">当前模式将处理全部 {pageCount} 页。</p>}
      </div>}
    </PdfOperationShell>
  );
}
