"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Cog,
  Download,
  FileText,
  LockKeyhole,
  RefreshCw,
  Settings2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import { pdfToolError, submitPdfTool } from "@/lib/pdf-tool-request";
import type { ConversionTaskResult } from "@/types/task";
import { useI18n } from "@/lib/i18n";

interface PdfOperationShellProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  endpoint: string;
  outputSuffix: string;
  fields: Record<string, string | number>;
  extraFiles?: Record<string, File | null>;
  onFileChange?: (file: File | null) => void;
  canSubmit?: boolean;
  validationMessage?: string;
  children?: React.ReactNode;
}

export default function PdfOperationShell({
  title,
  description,
  icon,
  endpoint,
  outputSuffix,
  fields,
  extraFiles,
  onFileChange,
  canSubmit = true,
  validationMessage,
  children,
}: PdfOperationShellProps) {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [completedTask, setCompletedTask] = useState<ConversionTaskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const workflowSteps = [
    { title: t("progress.upload"), description: t("pdfTool.selectFileFirst"), icon: <UploadCloud className="h-4 w-4" /> },
    { title: t("pdfTool.configure"), description: t("pdfTool.readyToProcess"), icon: <Settings2 className="h-4 w-4" /> },
    { title: t("progress.processing"), description: t("pdfTool.autoDelete"), icon: <Cog className="h-4 w-4" /> },
  ];

  const reset = () => {
    setFile(null);
    setTaskId(null);
    setCompletedTask(null);
    setError(null);
    onFileChange?.(null);
  };

  const clearFile = () => {
    if (submitting) return;
    setFile(null);
    setError(null);
    onFileChange?.(null);
  };

  const submit = async () => {
    if (!file || !canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const nextTaskId = await submitPdfTool(endpoint, file, fields, extraFiles);
      setTaskId(nextTaskId);
    } catch (requestError) {
      setError(pdfToolError(requestError, t("conversion.retryOrCheck")));
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = (task: ConversionTaskResult) => {
    setTaskId(null);
    setCompletedTask(task);
  };

  const handleProgressError = (message: string) => {
    setTaskId(null);
    setError(message);
  };

  return (
    <div className="operation-page min-h-screen">
      <div className="operation-grid" aria-hidden="true" />

      <section className="operation-hero">
        <div className="operation-shell">
          <nav className="operation-breadcrumb" aria-label={t("conversion.home")}>
            <Link href="/">{t("conversion.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{title}</span>
          </nav>

          <div className="operation-intro">
            <div className="operation-intro-copy">
              <div className="operation-kicker">
                <span className="operation-status-dot" aria-hidden="true" />
                <span>{t("pdfTool.configure")}</span>
                <span className="operation-kicker-code">{endpoint.toUpperCase()}</span>
              </div>
              <h1 className="operation-title">{title}</h1>
              <p className="operation-description">{description}</p>
            </div>
            <div className="operation-intro-meta" aria-label="工具信息">
              <div><span>INPUT</span><strong>PDF</strong></div>
              <div><span>OUTPUT</span><strong>{outputSuffix.split(".").pop()?.toUpperCase() || "PDF"}</strong></div>
              <div><span>LIMIT</span><strong>50 MB</strong></div>
            </div>
          </div>

          <div className="operation-workbench">
            <div className="operation-workbench-head">
              <div className="operation-tool-icon">{icon}</div>
              <div className="min-w-0 flex-1">
                <p className="operation-panel-kicker">01 / WORKBENCH</p>
                <h2>{t("pdfTool.configure")}</h2>
                <p>{t("pdfTool.autoDelete")}</p>
              </div>
              <span className="operation-ready-chip"><span /> READY</span>
            </div>

            <div className="operation-workbench-body">
              <div className="operation-workspace-main">
                {!taskId && !completedTask && (
                  <>
                    <FileUploader
                      accept={{ "application/pdf": [".pdf"] }}
                      maxSize={50 * 1024 * 1024}
                      onFileSelect={(next) => {
                        setFile(next);
                        onFileChange?.(next);
                        setError(null);
                      }}
                      isUploading={submitting}
                    />

                    {file && (
                      <div className="operation-file-row">
                        <div className="operation-file-icon"><FileText className="h-5 w-5" /></div>
                        <div className="min-w-0 flex-1">
                          <p className="operation-file-name" title={file.name}>{file.name}</p>
                          <p className="operation-file-meta">{formatFileSize(file.size)} · {t("pdfTool.fileReady")}</p>
                        </div>
                        <button type="button" onClick={clearFile} disabled={submitting} className="operation-icon-button" aria-label={t("pdfTool.removeFile")} title={t("pdfTool.removeFile")}>
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    <fieldset disabled={submitting} className="operation-options">
                      {children}
                    </fieldset>

                    {validationMessage && (
                      <p className="operation-validation"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{validationMessage}</p>
                    )}

                    <div className="operation-action-row">
                      <p className="operation-ready-note">
                        <CheckCircle className="h-4 w-4" />
                        {file ? t("pdfTool.readyToProcess") : t("pdfTool.selectFileFirst")}
                      </p>
                      <button type="button" onClick={submit} disabled={!file || !canSubmit || submitting} className="operation-primary-action">
                        {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        {submitting ? t("pdfTool.processing") : t("pdfTool.start")}
                      </button>
                    </div>
                  </>
                )}

                {taskId && !completedTask && <ConversionProgress taskId={taskId} onComplete={handleComplete} onError={handleProgressError} />}
                {completedTask && <DownloadButton task={completedTask} onReset={reset} />}

                {error && (
                  <div className="operation-error" role="alert">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="min-w-0 flex-1"><p>{t("pdfTool.failed")}</p><span>{error}</span></div>
                    {file && !taskId && !completedTask && <button type="button" onClick={submit} disabled={submitting || !canSubmit} className="operation-error-retry"><RefreshCw className="h-4 w-4" /> {t("pdfTool.retry")}</button>}
                    <button type="button" onClick={() => setError(null)} className="operation-icon-button" aria-label={t("pdfTool.dismissError")} title={t("pdfTool.dismissError")}><XCircle className="h-4 w-4" /></button>
                  </div>
                )}
              </div>

              <aside className="operation-workflow" aria-label={t("pdfTool.configure")}>
                <div className="operation-workflow-head"><span>WORKFLOW</span><span>03 STEPS</span></div>
                {workflowSteps.map((step, index) => (
                  <div key={step.title} className={`operation-workflow-step ${index === 0 ? "is-active" : ""}`}>
                    <span className="operation-workflow-index">0{index + 1}</span>
                    <span className="operation-workflow-icon">{step.icon}</span>
                    <div><strong>{step.title}</strong><small>{step.description}</small></div>
                  </div>
                ))}
                <div className="operation-security-note"><LockKeyhole className="h-4 w-4" /><span>{t("pdfTool.autoDelete")}</span></div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
