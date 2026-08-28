"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  FileCheck2,
  FileText,
  FileUp,
  Info,
  LoaderCircle,
  LockKeyhole,
  ScanText,
  ShieldCheck,
  Trash2,
  UploadCloud,
  XCircle,
  Zap,
} from "lucide-react";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import { pdfToolError } from "@/lib/pdf-tool-request";
import { useI18n } from "@/lib/i18n";
import type { ConversionTaskResult } from "@/types/task";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const PDF_ACCEPT = { "application/pdf": [".pdf"] };

export default function PdfToWordClient() {
  const { t, locale } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [completedTask, setCompletedTask] = useState<ConversionTaskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqItems = [
    { question: t("tools_detail.pdfToWord.faq.0.q"), answer: t("tools_detail.pdfToWord.faq.0.a") },
    { question: t("tools_detail.pdfToWord.faq.1.q"), answer: t("tools_detail.pdfToWord.faq.1.a") },
  ];

  const handleFileSelect = useCallback((nextFile: File) => {
    setFile(nextFile);
    setTaskId(null);
    setCompletedTask(null);
    setError(null);
  }, []);

  const submit = async () => {
    if (!file || isSubmitting) return;

    setIsSubmitting(true);
    setTaskId(null);
    setCompletedTask(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "pdf-to-word");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/convert`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const nextTaskId = response.data?.taskId;

      if (typeof nextTaskId !== "string" || !nextTaskId.trim()) {
        throw new Error("Invalid conversion response: missing taskId");
      }

      setTaskId(nextTaskId);
    } catch (requestError) {
      setError(pdfToolError(requestError, t("conversion.retryOrCheck")));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = useCallback((task: ConversionTaskResult) => {
    setCompletedTask(task);
    setTaskId(null);
  }, []);

  const handleTaskError = useCallback((message: string) => {
    setTaskId(null);
    setError(message);
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setTaskId(null);
    setCompletedTask(null);
    setError(null);
    setIsSubmitting(false);
  }, []);

  const isReady = !isSubmitting && !taskId && !completedTask;

  return (
    <div className="void-page word-page min-h-screen overflow-hidden">
      <div className="void-noise" aria-hidden="true" />
      <div className="void-grid" aria-hidden="true" />

      <section className="word-hero">
        <div className="word-page-shell">
          <nav className="word-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{t("conversion.home")}</Link>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t("tools_detail.pdfToWord.title")}</span>
          </nav>

          <div className="word-masthead">
            <div className="word-copy">
              <div className="void-system-line">
                <span><CircleDot className="h-3.5 w-3.5" /> {t("tools_detail.pdfToWord.workflow.eyebrow")}</span>
                <span>PDF → DOC</span>
              </div>
              <h1
                className="word-title"
                aria-label={t("tools_detail.pdfToWord.title")}
              >
                <span className="sr-only">{t("tools_detail.pdfToWord.title")}</span>
                <span className="word-title-visual" aria-hidden="true">
                  <span className="word-title-line word-title-source">
                    <span className="word-title-token">PDF</span>
                    <span className="word-title-tag">SOURCE</span>
                  </span>
                  <span className="word-title-connector">
                    <span className="word-title-connector-line" />
                    <ArrowRight className="h-4 w-4" />
                    <span>{locale === "zh" ? "转换为" : "TO"}</span>
                  </span>
                  <span className="word-title-line word-title-target">
                    <span className="word-title-token">Word</span>
                    <span className="word-title-tag">EDITABLE DOC</span>
                  </span>
                </span>
                <span className="word-title-caption" aria-hidden="true">
                  <span className="word-title-caption-mark" />
                  {locale === "zh" ? "在线转换器" : "ONLINE CONVERTER"}
                </span>
              </h1>
              <p className="word-description">{t("tools_detail.pdfToWord.description")}</p>

              <div className="word-trust-row">
                <span><Zap className="h-4 w-4" /> {t("conversion.commonFeatures.fast.label")}</span>
                <span><ShieldCheck className="h-4 w-4" /> {t("conversion.commonFeatures.secure.label")}</span>
                <span><FileCheck2 className="h-4 w-4" /> {t("tools_detail.pdfToWord.features.accurate.label")}</span>
              </div>
            </div>

            <div className="word-console-wrap">
              <div className="word-console-orbit word-console-orbit-one" aria-hidden="true" />
              <div className="word-console-orbit word-console-orbit-two" aria-hidden="true" />
              <div className="word-console">
                <div className="word-console-bar">
                  <div className="word-console-lights" aria-hidden="true"><i /><i /><i /></div>
                  <span>{t("tools_detail.pdfToWord.workflow.toolLabel")}</span>
                  <span>READY / 001</span>
                </div>

                <div className="word-console-body">
                  <div className="word-panel-heading">
                    <span className="word-panel-index">01</span>
                    <div>
                      <p className="word-panel-kicker">{t("tools_detail.pdfToWord.workflow.ready")}</p>
                      <h2>{t("conversion.startConversion")}</h2>
                    </div>
                  </div>

                  {isSubmitting && <ProcessingState file={file} />}

                  {taskId && !completedTask && !isSubmitting && (
                    <div className="word-progress">
                      <ConversionProgress
                        taskId={taskId}
                        onComplete={handleComplete}
                        onError={handleTaskError}
                      />
                    </div>
                  )}

                  {completedTask && (
                    <div className="word-result">
                      <DownloadButton task={completedTask} onReset={reset} />
                    </div>
                  )}

                  {isReady && (
                    <div className="word-ready-state">
                      <PdfWordDropzone
                        disabled={isSubmitting}
                        onFileSelect={handleFileSelect}
                      />

                      {file && (
                        <div className="word-file-row">
                          <div className="word-file-badge">PDF</div>
                          <div className="min-w-0 flex-1">
                            <p className="word-file-name">{file.name}</p>
                            <p className="word-file-meta">
                              {t("tools_detail.pdfToWord.workflow.selected")} · {formatFileSize(file.size)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setFile(null); setError(null); }}
                            className="word-icon-button"
                            title={t("tools_detail.pdfToWord.workflow.removeFile")}
                            aria-label={t("tools_detail.pdfToWord.workflow.removeFile")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={submit}
                        disabled={!file}
                        className="word-submit"
                      >
                        <span>{error ? t("tools_detail.pdfToWord.workflow.retry") : t("tools_detail.pdfToWord.workflow.start")}</span>
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </button>

                      <p className="word-help-line">
                        <LockKeyhole className="h-3.5 w-3.5" />
                        {t("tools_detail.pdfToWord.workflow.privacy")}
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="word-error" role="alert">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold">{t("tools_detail.pdfToWord.workflow.errorTitle")}</p>
                        <p>{error}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setError(null)}
                        className="word-error-close"
                        title={t("tools_detail.pdfToWord.workflow.dismissError")}
                        aria-label={t("tools_detail.pdfToWord.workflow.dismissError")}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="word-console-foot">
                  <span><CircleDot className="h-3.5 w-3.5" /> {t("tools_detail.pdfToWord.workflow.formatNote")}</span>
                  <span>{t("upload.maxSize").replace("{size}", "20")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="word-flow-strip" aria-label={t("conversion.howToUse")}>
            <FlowStep index="01" icon={<FileUp />} title={t("tools_detail.pdfToWord.workflow.flow.input")} description={t("tools_detail.pdfToWord.workflow.flow.inputDesc")} />
            <ArrowRight className="word-flow-arrow" aria-hidden="true" />
            <FlowStep index="02" icon={<ScanText />} title={t("tools_detail.pdfToWord.workflow.flow.recognize")} description={t("tools_detail.pdfToWord.workflow.flow.recognizeDesc")} />
            <ArrowRight className="word-flow-arrow" aria-hidden="true" />
            <FlowStep index="03" icon={<FileCheck2 />} title={t("tools_detail.pdfToWord.workflow.flow.output")} description={t("tools_detail.pdfToWord.workflow.flow.outputDesc")} />
          </div>
        </div>
      </section>

      <section className="word-feature-band">
        <div className="word-page-shell word-feature-shell">
          <div className="word-section-label"><span>02</span> {t("tools_detail.pdfToWord.workflow.sectionLabel")}</div>
          <div className="word-feature-grid">
            <FeatureItem icon={<Zap />} title={t("conversion.commonFeatures.fast.label")} description={t("conversion.commonFeatures.fast.desc")} />
            <FeatureItem icon={<LockKeyhole />} title={t("conversion.commonFeatures.secure.label")} description={t("conversion.commonFeatures.secure.desc")} />
            <FeatureItem icon={<CheckCircle2 />} title={t("tools_detail.pdfToWord.features.accurate.label")} description={t("tools_detail.pdfToWord.features.accurate.desc")} />
          </div>
        </div>
      </section>

      <section className="word-faq-section">
        <div className="word-page-shell word-faq-shell">
          <div>
            <div className="word-section-label"><span>03</span> FAQ / PDF → WORD</div>
            <h2 className="word-section-title">{t("conversion.faq")}</h2>
            <p className="word-section-description">{t("conversion.faqDesc")}</p>
          </div>

          <div className="word-faq-list">
            {faqItems.map((faq) => (
              <details key={faq.question} className="word-faq-item">
                <summary>
                  <span>{faq.question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0" aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="word-next-section">
        <div className="word-page-shell word-next-shell">
          <div>
            <div className="word-section-label"><span>04</span> NEXT MODULE</div>
            <h2>{t("conversion.otherFormats")}</h2>
            <p>{t("conversion.otherFormatsDesc")}</p>
          </div>
          <Link href="/" className="word-next-link">
            <span>{t("conversion.viewAllTools")}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function PdfWordDropzone({
  disabled,
  onFileSelect,
}: {
  disabled: boolean;
  onFileSelect: (file: File) => void;
}) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles[0]) onFileSelect(acceptedFiles[0]);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: PDF_ACCEPT,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled,
    onDrop,
    onDropRejected: (rejections) => {
      const code = rejections[0]?.errors[0]?.code;
      setError(code === "file-too-large"
        ? t("upload.fileTooLarge").replace("{size}", "20")
        : t("upload.invalidType"));
    },
  });

  const dropzoneState = isDragReject ? "is-reject" : isDragAccept ? "is-accept" : isDragActive ? "is-active" : "";

  return (
    <div>
      <div
        {...getRootProps({ className: `word-dropzone ${dropzoneState}` })}
        aria-label={t("tools_detail.pdfToWord.workflow.dropTitle")}
      >
        <input {...getInputProps()} />
        <div className="word-drop-icon" aria-hidden="true">
          {isDragReject ? <XCircle className="h-8 w-8" /> : isDragActive ? <UploadCloud className="h-8 w-8" /> : <FileUp className="h-8 w-8" />}
        </div>
        <p className="word-drop-title">
          {isDragReject ? t("upload.formatNotSupported") : isDragActive ? t("upload.releaseToUpload") : t("tools_detail.pdfToWord.workflow.dropTitle")}
        </p>
        <p className="word-drop-description">{t("tools_detail.pdfToWord.workflow.dropDescription")}</p>
        <span className="word-pick-button"><UploadCloud className="h-4 w-4" /> {t("tools_detail.pdfToWord.workflow.chooseFile")}</span>
        <p className="word-drop-meta">{t("tools_detail.pdfToWord.workflow.fileRule")}</p>
      </div>
      {error && (
        <p className="word-drop-error" role="alert">
          <Info className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

function ProcessingState({ file }: { file: File | null }) {
  const { t } = useI18n();

  return (
    <div className="word-processing" aria-live="polite" aria-busy="true">
      <div className="word-processing-icon"><LoaderCircle className="h-8 w-8" /></div>
      <p className="word-panel-kicker">{t("progress.processing")}</p>
      <h3>{t("tools_detail.pdfToWord.workflow.processing")}</h3>
      <p>{t("tools_detail.pdfToWord.workflow.processingDesc")}</p>
      {file && <div className="word-processing-file"><FileText className="h-4 w-4" /><span>{file.name}</span></div>}
      <div className="word-processing-tip"><Clock3 className="h-4 w-4" /> {t("tools_detail.pdfToWord.workflow.processingTip")}</div>
    </div>
  );
}

function FlowStep({
  index,
  icon,
  title,
  description,
}: {
  index: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="word-flow-step">
      <div className="word-flow-icon">{icon}</div>
      <div>
        <span className="word-flow-index">{index}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="word-feature-item">
      <div className="word-feature-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
