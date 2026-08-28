"use client";

import { useState } from "react";
import axios from "axios";
import { AlertCircle, Merge, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import MultiFileUploader from "@/components/upload/MultiFileUploader";
import MergeOptions from "@/components/merge/MergeOptions";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import { pdfToolError } from "@/lib/pdf-tool-request";
import type { ConversionTaskResult } from "@/types/task";
import { useI18n } from "@/lib/i18n";

export default function MergePdfClient() {
  const { t } = useI18n();
  const [files, setFiles] = useState<Array<{ id: string; file: File }>>([]);
  const [sortType, setSortType] = useState("order");
  const [removeCertSign, setRemoveCertSign] = useState(false);
  const [generateToc, setGenerateToc] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [completedTask, setCompletedTask] = useState<ConversionTaskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  const submit = async () => {
    if (files.length < 2) return;
    setSubmitting(true); setError(null);
    const formData = new FormData();
    files.forEach(({ file }) => formData.append("files", file));
    formData.append("sortType", sortType);
    formData.append("removeCertSign", String(removeCertSign));
    formData.append("generateToc", String(generateToc));
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/convert/merge`, formData);
      if (typeof response.data?.taskId !== "string" || !response.data.taskId) throw new Error("服务器未返回任务编号");
      setTaskId(response.data.taskId);
    } catch (err) {
      setError(pdfToolError(err, "合并失败，请稍后重试"));
    } finally { setSubmitting(false); }
  };

  const handleProgressError = (message: string) => { setTaskId(null); setError(message); };
  const reset = () => {
    setFiles([]);
    setTaskId(null);
    setCompletedTask(null);
    setError(null);
    setUploaderKey((key) => key + 1);
  };

  return (
    <div className="detail-studio-page min-h-screen relative overflow-hidden">
      <section className="relative mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:py-16">
        <nav className="detail-breadcrumb mb-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-theme-muted"><Link href="/" className="hover:text-indigo-500">首页</Link><span>/</span><span>{t("tools_detail.mergePdf.title")}</span></nav>
        <div className="detail-hero mb-12 max-w-4xl"><h1 className="detail-title mb-5 text-5xl font-black leading-[0.9] text-theme md:text-7xl">{t("tools_detail.mergePdf.title")}</h1><p className="max-w-2xl text-lg leading-8 text-theme-muted">{t("tools_detail.mergePdf.description")}</p></div>
        <div className="detail-workbench overflow-hidden">
          <div className="detail-workbench-head flex items-center gap-4 px-6 py-5 md:px-8"><div className="detail-tool-icon flex h-14 w-14 items-center justify-center"><Merge className="w-8 h-8" /></div><div><h2 className="text-xl font-black text-theme">配置处理选项</h2><p className="text-sm text-theme-muted">文件只用于本次处理，30分钟后自动删除</p></div></div>
          <div className="space-y-6 p-5 md:p-8">
            {!taskId && !completedTask && <>
              <fieldset disabled={submitting} className="min-w-0 space-y-6">
                <MultiFileUploader key={uploaderKey} maxSize={50 * 1024 * 1024} onFilesChange={setFiles} isUploading={submitting} />
                <MergeOptions sortType={sortType} removeCertSign={removeCertSign} generateToc={generateToc} onSortTypeChange={setSortType} onRemoveCertSignChange={setRemoveCertSign} onGenerateTocChange={setGenerateToc} />
              </fieldset>
              <div className="flex flex-col gap-3 border-t border-theme pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-theme-muted">{files.length < 2 ? "至少选择 2 个 PDF 文件" : `已选择 ${files.length} 个文件，可开始合并`}</p>
                <button type="button" onClick={submit} disabled={files.length < 2 || submitting} className="detail-primary-action flex w-full items-center justify-center gap-2 px-5 py-4 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">
                  {submitting && <RefreshCw className="h-5 w-5 animate-spin" />}
                  {submitting ? "正在合并..." : `开始合并 ${files.length > 1 ? `(${files.length} 个文件)` : ""}`}
                </button>
              </div>
            </>}
            {taskId && !completedTask && <ConversionProgress taskId={taskId} onComplete={setCompletedTask} onError={handleProgressError} />}
            {completedTask && <DownloadButton task={completedTask} onReset={reset} />}
            {error && <div className="flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300" role="alert"><AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" /><div className="min-w-0 flex-1"><p className="font-semibold">合并失败</p><p className="mt-1 break-words text-sm opacity-80">{error}</p></div>{files.length >= 2 && !taskId && !completedTask && <button type="button" onClick={submit} disabled={submitting} className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold hover:bg-red-100 disabled:opacity-50 dark:hover:bg-red-900/30"><RefreshCw className="h-4 w-4" />重试</button>}<button type="button" onClick={() => setError(null)} className="flex-shrink-0 rounded-lg p-1 opacity-60 hover:bg-red-100 hover:opacity-100 dark:hover:bg-red-900/30" aria-label="关闭错误提示" title="关闭错误提示"><XCircle className="h-4 w-4" /></button></div>}
          </div>
        </div>
      </section>
    </div>
  );
}
