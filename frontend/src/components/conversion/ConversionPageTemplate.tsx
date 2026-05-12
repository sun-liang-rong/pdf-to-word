"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, XCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import axios from "axios";

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
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
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
    setDownloadUrl(null);
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

  const handleComplete = (url: string) => {
    setDownloadUrl(url);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTaskId(null);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-theme">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero section */}
      <section className="relative pt-12 pb-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-theme-muted mb-8">
            <Link href="/" className="hover:text-indigo-500 transition-colors">{t("conversion.home")}</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-theme font-medium">{title}</span>
          </nav>

          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <span className="mr-2">🔄</span>
              <span className="text-theme-muted">{t("conversion.formatConversion")}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-theme mb-4">
              {title}
            </h1>
            <p className="text-lg text-theme-muted max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Conversion card */}
          <div className="glass-card rounded-3xl overflow-hidden max-w-3xl mx-auto">
            <div className={`${gradient} px-8 py-6`}>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur">
                  {icon}
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">{t("conversion.startConversion")}</h2>
                  <p className="text-white/80 text-sm">{t("conversion.uploadAndConvert")}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {!taskId && !downloadUrl && (
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

              {taskId && !downloadUrl && (
                <ConversionProgress
                  taskId={taskId}
                  onComplete={handleComplete}
                  onError={handleError}
                />
              )}

              {downloadUrl && (
                <DownloadButton
                  downloadUrl={downloadUrl}
                  fileName={selectedFile?.name.replace(/\.[^/.]+$/, "") + outputExtension || "converted" + outputExtension}
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
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 text-center hover-lift">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <div className="font-bold text-theme mb-1">{feature.label}</div>
                <div className="text-sm text-theme-muted">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-theme-secondary">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-theme mb-3">{t("conversion.howToUse")}</h2>
            <p className="text-theme-muted">{t("conversion.howToUseDesc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/50 to-pink-500/30" />

            {steps.map((item, index) => (
              <div key={index} className="relative text-center">
                <div className={`w-20 h-20 ${gradient} rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg relative z-10`}>
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-theme mb-2">{item.title}</h3>
                <p className="text-theme-muted text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-theme mb-3">{t("conversion.faq")}</h2>
            <p className="text-theme-muted">{t("conversion.faqDesc")}</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-theme-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{t("conversion.otherFormats")}</h2>
              <p className="text-white/80 mb-8 text-lg">{t("conversion.otherFormatsDesc")}</p>
              <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
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
    <div className="glass-card rounded-2xl overflow-hidden">
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
