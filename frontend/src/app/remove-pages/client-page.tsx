"use client";

import { useRef, useState } from "react";
import { Scissors } from "lucide-react";
import PdfOperationShell from "@/components/pdf-tools/PdfOperationShell";
import PageExpressionInput from "@/components/remove-pages/PageExpressionInput";
import { getPDFPageCount } from "@/lib/pdf-utils";
import { useI18n } from "@/lib/i18n";

export default function RemovePagesClient() {
  const { t } = useI18n();
  const [pageCount, setPageCount] = useState(0);
  const [pageNumbers, setPageNumbers] = useState("");
  const [pageError, setPageError] = useState<string | null>(null);
  const pageReadRequest = useRef(0);

  const handleFileChange = async (file: File | null) => {
    const requestId = ++pageReadRequest.current;
    setPageCount(0);
    setPageNumbers("");
    setPageError(null);
    if (file) {
      try {
        const count = await getPDFPageCount(file);
        if (requestId === pageReadRequest.current) setPageCount(count);
      } catch (error) {
        if (requestId === pageReadRequest.current) setPageError(error instanceof Error ? error.message : "无法读取 PDF 文件");
      }
    }
  };

  return (
    <PdfOperationShell
      title={t("tools_detail.removePages.title")}
      description={t("tools_detail.removePages.description")}
      icon={<Scissors className="w-8 h-8" />}
      gradient="bg-gradient-to-r from-amber-500 to-orange-500"
      endpoint="remove-pages"
      outputSuffix=".pdf"
      fields={{ pageNumbers }}
      onFileChange={handleFileChange}
      canSubmit={pageCount > 0 && Boolean(pageNumbers) && !pageError}
      validationMessage={pageError || (!pageNumbers && pageCount > 0 ? "请输入要删除的页面" : undefined)}
    >
      {pageCount > 0 && <PageExpressionInput pageCount={pageCount} onExpressionChange={(expression) => setPageNumbers(expression)} onError={setPageError} />}
    </PdfOperationShell>
  );
}
