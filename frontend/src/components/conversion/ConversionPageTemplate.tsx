"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, XCircle } from "lucide-react";
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
  gradient,
  outputExtension,
  faqItems,
  features,
}: ConversionPageProps) {
  const { t } = useI18n();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [completedTask, setCompletedTask] = useState<ConversionTaskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const steps = [
    { step: 1, title: t("conversion.steps.upload.title"), description: t("conversion.steps.upload.description"), icon: "📤" },
    { step: 2, title: t("conversion.steps.convert.title"), description: t("conversion.steps.convert.description"), icon: "⚙️" },
    { step: 3, title: t("conversion.steps.download.title"), description: t("conversion.steps.download.description"), icon: "📥" },
  ];

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setTaskId(null);
    setCompletedTask(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", conversionType);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/convert`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setTaskId(response.data.taskId);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError(err.response?.data?.message || t("conversion.conversionFailed"));
      } else {
        setError(err.response?.data?.message || t("conversion.retryOrCheck"));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleComplete = (task: ConversionTaskResult) => {
    setCompletedTask(task);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTaskId(null);
    setCompletedTask(null);
    setError(null);
  };

  return (
    <div className="detail-studio-page min-h-screen">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero section */}
      <section className="relative pb-20 pt-10 lg:pb-28 lg:pt-14">
        <div className="max-w-5xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="detail-breadcrumb mb-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-theme-muted">
            <Link href="/" className="hover:text-indigo-500 transition-colors">{t("conversion.home")}</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-theme font-medium">{title}</span>
          </nav>

          {/* Title */}
          <div className="text-center mb-10">
            <div className="detail-kicker mb-6 inline-flex items-center gap-2">
              <span className="mr-2">🔄</span>
              <span className="text-theme-muted">{t("conversion.formatConversion")}</span>
            </div>
            <h1 className="detail-title mb-5 text-5xl font-black leading-[0.9] tracking-[-0.06em] text-theme md:text-7xl">
              {title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-theme-muted">
              {description}
            </p>
          </div>

          {/* Conversion card */}
          <div className="detail-workbench overflow-hidden">
            <div className="detail-workbench-head px-6 py-5 md:px-8">
              <div className="flex items-center space-x-4">
                <div className="detail-tool-icon flex h-14 w-14 items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-[-0.03em] text-theme">{t("conversion.startConversion")}</h2>
                  <p className="text-sm text-theme-muted">{t("conversion.uploadAndConvert")}</p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8">
              {!taskId && !completedTask && (
                <div className="space-y-6">
                  <FileUploader
                    accept={accept}
                    maxSize={50 * 1024 * 1024}
                    onFileSelect={handleFileSelect}
                    isUploading={isUploading}
                  />

                  {selectedFile && !taskId && (
                    <div className="p-4 bg-theme-secondary rounded-2xl border border-theme flex items-center space-x-4 animate-fade-in">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-theme truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-theme-muted">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-2 hover:bg-theme rounded-xl transition-colors"
                      >
                        <XCircle className="w-5 h-5 text-theme-muted" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {taskId && !completedTask && (
                <ConversionProgress
                  taskId={taskId}
                  onComplete={handleComplete}
                  onError={handleError}
                />
              )}

              {completedTask && (
                <DownloadButton
                  task={completedTask}
                  onReset={handleReset}
                />
              )}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start space-x-3 animate-slide-down">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-600 dark:text-red-400 font-medium">{t("conversion.conversionFailed")}</p>
                    <p className="text-red-500 dark:text-red-300/70 text-sm mt-1">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="detail-feature-grid mt-8 grid grid-cols-1 sm:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="detail-feature-cell p-6">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <div className="font-bold text-theme mb-1">{feature.label}</div>
                <div className="text-sm text-theme-muted">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="detail-dark-band py-20 lg:py-28">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">{t("conversion.howToUse")}</h2>
            <p className="mt-3 text-white/55">{t("conversion.howToUseDesc")}</p>
          </div>

          <div className="detail-steps-grid grid grid-cols-1 md:grid-cols-3">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="detail-step-icon relative z-10 mb-6 flex h-20 w-20 items-center justify-center text-3xl">
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                <p className="text-white/55 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="detail-hero mb-10 max-w-3xl">
            <h2 className="text-4xl font-black tracking-[-0.05em] text-theme md:text-6xl">{t("conversion.faq")}</h2>
            <p className="text-theme-muted">{t("conversion.faqDesc")}</p>
          </div>

          <div className="detail-faq-list">
            {faqItems.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-theme-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <div className="studio-cta relative overflow-hidden p-10 text-left">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative z-10">
              <h2 className="relative z-10 mb-4 text-4xl font-black tracking-[-0.05em] text-[#151515] md:text-6xl">{t("conversion.otherFormats")}</h2>
              <p className="relative z-10 mb-8 max-w-2xl text-lg text-[#151515]/65">{t("conversion.otherFormatsDesc")}</p>
              <Link href="/" className="studio-cta-button relative z-10">
                {t("conversion.viewAllTools")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="detail-faq-item overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
      >
        <span className="text-base font-medium text-theme group-hover:text-indigo-500 transition-colors pr-4">{question}</span>
        <svg className={`w-5 h-5 text-theme-muted flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-indigo-500" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40" : "max-h-0"}`}>
        <p className="px-6 pb-5 text-sm text-theme-muted leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
