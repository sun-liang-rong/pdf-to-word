"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, XCircle } from "lucide-react";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import { pdfToolError, submitPdfTool } from "@/lib/pdf-tool-request";
import type { ConversionTaskResult } from "@/types/task";

interface PdfOperationShellProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  endpoint: string;
  outputSuffix: string;
  fields: Record<string, string | number>;
  canSubmit?: boolean;
  validationMessage?: string;
  children: React.ReactNode;
}

export default function PdfOperationShell({
  title, description, icon, gradient, endpoint, outputSuffix, fields,
  canSubmit = true, validationMessage, children,
}: PdfOperationShellProps) {
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [completedTask, setCompletedTask] = useState<ConversionTaskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setFile(null); setTaskId(null); setCompletedTask(null); setError(null);
  };

  const submit = async () => {
    if (!file || !canSubmit) return;
    setSubmitting(true); setError(null);
    try {
      setTaskId(await submitPdfTool(endpoint, file, fields));
    } catch (err) {
      setError(pdfToolError(err, "处理失败，请稍后重试"));
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="detail-studio-page min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <section className="relative mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:py-16">
        <nav className="detail-breadcrumb mb-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-theme-muted">
          <Link href="/" className="hover:text-indigo-500">首页</Link><span>/</span><span>{title}</span>
        </nav>
        <div className="detail-hero mb-12 max-w-4xl">
          <h1 className="detail-title mb-5 text-5xl font-black leading-[0.9] tracking-[-0.06em] text-theme md:text-7xl">{title}</h1>
          <p className="max-w-2xl text-lg leading-8 text-theme-muted">{description}</p>
        </div>
        <div className="detail-workbench overflow-hidden">
          <div className="detail-workbench-head flex items-center gap-4 px-6 py-5 md:px-8">
            <div className="detail-tool-icon flex h-14 w-14 items-center justify-center">{icon}</div>
            <div><h2 className="text-xl font-black tracking-[-0.03em] text-theme">配置处理选项</h2><p className="text-sm text-theme-muted">文件只用于本次处理，30分钟后自动删除</p></div>
          </div>
          <div className="space-y-6 p-5 md:p-8">
            {!taskId && !completedTask && (
              <>
                <FileUploader accept={{ "application/pdf": [".pdf"] }} maxSize={50 * 1024 * 1024} onFileSelect={(next) => { setFile(next); setError(null); }} />
                {file && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-theme-secondary border border-theme">
                    <FileText className="w-6 h-6 text-indigo-500" />
                    <div className="flex-1 min-w-0"><p className="text-theme font-medium truncate">{file.name}</p><p className="text-xs text-theme-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
                    <button onClick={() => setFile(null)}><XCircle className="w-5 h-5 text-theme-muted" /></button>
                  </div>
                )}
                {children}
                {validationMessage && <p className="text-sm text-amber-500">{validationMessage}</p>}
                <button onClick={submit} disabled={!file || !canSubmit || submitting} className="detail-primary-action w-full py-4 disabled:opacity-40">
                  {submitting ? "正在处理..." : "开始处理 PDF"}
                </button>
              </>
            )}
            {taskId && !completedTask && <ConversionProgress taskId={taskId} onComplete={setCompletedTask} onError={setError} />}
            {completedTask && <DownloadButton task={completedTask} onReset={reset} />}
            {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500">{error}</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
