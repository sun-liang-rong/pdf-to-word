"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, XCircle } from "lucide-react";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import { pdfToolError, submitPdfTool } from "@/lib/pdf-tool-request";

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
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setFile(null); setTaskId(null); setDownloadUrl(null); setError(null);
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

  const baseName = file?.name.replace(/\.[^/.]+$/, "") || "document";

  return (
    <div className="min-h-screen bg-theme relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <section className="relative max-w-5xl mx-auto px-4 py-12">
        <nav className="mb-8 flex items-center gap-2 text-sm text-theme-muted">
          <Link href="/" className="hover:text-indigo-500">首页</Link><span>/</span><span>{title}</span>
        </nav>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-theme mb-4">{title}</h1>
          <p className="text-lg text-theme-muted max-w-2xl mx-auto">{description}</p>
        </div>
        <div className="glass-card rounded-3xl overflow-hidden max-w-3xl mx-auto">
          <div className={`${gradient} px-8 py-6 text-white flex items-center gap-4`}>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">{icon}</div>
            <div><h2 className="text-xl font-bold">配置处理选项</h2><p className="text-white/80 text-sm">文件只用于本次处理，30分钟后自动删除</p></div>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            {!taskId && !downloadUrl && (
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
                <button onClick={submit} disabled={!file || !canSubmit || submitting} className="w-full py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 disabled:opacity-40 hover:scale-[1.01] transition">
                  {submitting ? "正在处理..." : "开始处理 PDF"}
                </button>
              </>
            )}
            {taskId && !downloadUrl && <ConversionProgress taskId={taskId} onComplete={setDownloadUrl} onError={setError} />}
            {downloadUrl && <DownloadButton downloadUrl={downloadUrl} fileName={`${baseName}${outputSuffix}`} onReset={reset} />}
            {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500">{error}</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
