"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Cog,
  Download,
  FileText,
  LockKeyhole,
  RefreshCw,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import axios from "axios";
import type { ConversionTaskResult } from "@/types/task";

interface ConversionPageProps {
  title: string;
  description: string;
  conversionType: string;
  accept: Record<string, string[]>;
  icon: React.ReactNode;
  gradient: string;
  outputExtension: string;
  faqItems: { question: string; answer: string }[];
  features: { icon: string; label: string; desc: string }[];
}

export default function ConversionPageTemplate({
  title,
  description,
  conversionType,
  accept,
  icon,
  outputExtension,
  faqItems,
  features,
}: ConversionPageProps) {
  const { t } = useI18n();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [completedTask, setCompletedTask] = useState<ConversionTaskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workflowSteps = [
    { title: t("conversion.steps.upload.title"), description: t("conversion.steps.upload.description"), icon: <UploadCloud className="h-4 w-4" /> },
    { title: t("conversion.steps.convert.title"), description: t("conversion.steps.convert.description"), icon: <Cog className="h-4 w-4" /> },
    { title: t("conversion.steps.download.title"), description: t("conversion.steps.download.description"), icon: <Download className="h-4 w-4" /> },
  ];

  const acceptedFormats = Object.values(accept).flat().join(" / ").toUpperCase();
  const outputLabel = outputExtension.replace(/^\./, "").toUpperCase();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setTaskId(null);
    setCompletedTask(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", conversionType);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/convert`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (typeof response.data?.taskId !== "string" || !response.data.taskId.trim()) {
        throw new Error("Invalid conversion response: missing taskId");
      }

      setTaskId(response.data.taskId);
    } catch (requestError: any) {
      if (requestError.response?.status === 429) {
        setError(requestError.response?.data?.message || t("conversion.conversionFailed"));
      } else {
        setError(requestError.response?.data?.message || t("conversion.retryOrCheck"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = (task: ConversionTaskResult) => {
    setTaskId(null);
    setCompletedTask(task);
  };

  const handleError = (errorMessage: string) => {
    setTaskId(null);
    setError(errorMessage);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTaskId(null);
    setCompletedTask(null);
    setError(null);
  };

  const clearFile = () => {
    if (isSubmitting) return;
    setSelectedFile(null);
    setError(null);
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
                <span>{t("conversion.formatConversion")}</span>
                <span className="operation-kicker-code">{conversionType.toUpperCase()}</span>
              </div>
              <h1 className="operation-title">{title}</h1>
              <p className="operation-description">{description}</p>
            </div>

            <div className="operation-intro-meta" aria-label="文件信息">
              <div><span>INPUT</span><strong>{acceptedFormats || "FILE"}</strong></div>
              <div><span>OUTPUT</span><strong>{outputLabel}</strong></div>
              <div><span>LIMIT</span><strong>50 MB</strong></div>
            </div>
          </div>

          <div className="operation-workbench">
            <div className="operation-workbench-head">
              <div className="operation-tool-icon">{icon}</div>
              <div className="min-w-0 flex-1">
                <p className="operation-panel-kicker">01 / INPUT</p>
                <h2>{t("conversion.startConversion")}</h2>
                <p>{t("conversion.uploadAndConvert")}</p>
              </div>
              <span className="operation-ready-chip"><span /> READY</span>
            </div>

            <div className="operation-workbench-body">
              <div className="operation-workspace-main">
                {!taskId && !completedTask && (
                  <div className="space-y-5">
                    <FileUploader
                      accept={accept}
                      maxSize={50 * 1024 * 1024}
                      onFileSelect={handleFileSelect}
                      isUploading={isSubmitting}
                    />

                    {selectedFile && (
                      <div className="operation-file-row">
                        <div className="operation-file-icon"><FileText className="h-5 w-5" /></div>
                        <div className="min-w-0 flex-1">
                          <p className="operation-file-name" title={selectedFile.name}>{selectedFile.name}</p>
                          <p className="operation-file-meta">{formatFileSize(selectedFile.size)} · {t("conversion.fileReady")}</p>
                        </div>
                        <button
                          type="button"
                          onClick={clearFile}
                          disabled={isSubmitting}
                          className="operation-icon-button"
                          aria-label={t("conversion.removeFile")}
                          title={t("conversion.removeFile")}
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    <div className="operation-action-row">
                      <p className="operation-ready-note">
                        <CheckCircle className="h-4 w-4" />
                        {selectedFile ? t("conversion.fileReady") : t("upload.title")}
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedFile || isSubmitting}
                        className="operation-primary-action"
                      >
                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        {isSubmitting ? t("conversion.submitting") : t("conversion.startNow")}
                      </button>
                    </div>
                  </div>
                )}

                {taskId && !completedTask && (
                  <ConversionProgress taskId={taskId} onComplete={handleComplete} onError={handleError} />
                )}

                {completedTask && <DownloadButton task={completedTask} onReset={handleReset} />}

                {error && (
                  <div className="operation-error" role="alert">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p>{t("conversion.conversionFailed")}</p>
                      <span>{error}</span>
                    </div>
                    {selectedFile && !taskId && !completedTask && (
                      <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="operation-error-retry">
                        <RefreshCw className="h-4 w-4" /> {t("conversion.retry")}
                      </button>
                    )}
                    <button type="button" onClick={() => setError(null)} className="operation-icon-button" aria-label={t("conversion.dismissError")} title={t("conversion.dismissError")}>
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <aside className="operation-workflow" aria-label={t("conversion.howToUse")}>
                <div className="operation-workflow-head">
                  <span>WORKFLOW</span>
                  <span>03 STEPS</span>
                </div>
                {workflowSteps.map((step, index) => (
                  <div key={step.title} className={`operation-workflow-step ${index === 0 ? "is-active" : ""}`}>
                    <span className="operation-workflow-index">0{index + 1}</span>
                    <span className="operation-workflow-icon">{step.icon}</span>
                    <div><strong>{step.title}</strong><small>{step.description}</small></div>
                  </div>
                ))}
                <div className="operation-security-note">
                  <LockKeyhole className="h-4 w-4" />
                  <span>{t("pdfTool.autoDelete")}</span>
                </div>
              </aside>
            </div>
          </div>

          <div className="operation-feature-grid">
            {features.map((feature, index) => (
              <div key={index} className="operation-feature-cell">
                <span className="operation-feature-icon" aria-hidden="true">{feature.icon}</span>
                <div><strong>{feature.label}</strong><p>{feature.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="operation-process-band">
        <div className="operation-shell">
          <div className="operation-section-heading">
            <span>02 / PROCESS</span>
            <h2>{t("conversion.howToUse")}</h2>
            <p>{t("conversion.howToUseDesc")}</p>
          </div>
          <div className="operation-process-grid">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="operation-process-step">
                <span className="operation-process-index">0{index + 1}</span>
                <span className="operation-process-icon">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="operation-faq-section">
        <div className="operation-shell operation-faq-shell">
          <div className="operation-section-heading">
            <span>03 / FAQ</span>
            <h2>{t("conversion.faq")}</h2>
            <p>{t("conversion.faqDesc")}</p>
          </div>
          <div className="operation-faq-list">
            {faqItems.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="operation-cta-section">
        <div className="operation-shell">
          <div className="operation-cta">
            <div>
              <span className="operation-cta-code">04 / NEXT MODULE</span>
              <h2>{t("conversion.otherFormats")}</h2>
              <p>{t("conversion.otherFormatsDesc")}</p>
            </div>
            <Link href="/" className="operation-cta-button">
              <span>{t("conversion.viewAllTools")}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const answerId = `conversion-faq-${index}`;

  return (
    <div className={`operation-faq-item ${open ? "is-open" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="operation-faq-question"
        aria-expanded={open}
        aria-controls={answerId}
      >
        <span className="operation-faq-number">0{index + 1}</span>
        <span className="flex-1 text-left">{question}</span>
        <ChevronDown className="h-5 w-5 shrink-0" aria-hidden="true" />
      </button>
      <div id={answerId} className={`operation-faq-answer ${open ? "is-open" : ""}`}>
        <div>{answer}</div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
