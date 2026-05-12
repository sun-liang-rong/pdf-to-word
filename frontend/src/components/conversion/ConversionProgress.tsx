"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ConversionProgressProps {
  taskId: string;
  onComplete: (downloadUrl: string) => void;
  onError: (error: string) => void;
}

interface TaskStatus {
  id: string;
  status: "waiting" | "processing" | "completed" | "failed";
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export default function ConversionProgress({
  taskId,
  onComplete,
  onError,
}: ConversionProgressProps) {
  const { t } = useI18n();

  const steps = [
    { id: "upload", label: t("progress.upload"), icon: "📤" },
    { id: "process", label: t("progress.processing"), icon: "⚙️" },
    { id: "complete", label: t("progress.complete"), icon: "✅" },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await axios.get<TaskStatus>(
        `${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}`
      );
      return response.data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") {
        return false;
      }
      return 1000;
    },
    enabled: !!taskId,
  });

  if (isLoading || !data) {
    return (
      <div className="w-full p-8 glass-card rounded-2xl">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500"></div>
          </div>
          <span className="mt-4 text-theme-muted font-medium">{t("progress.initializing")}</span>
        </div>
      </div>
    );
  }

  const status = data.status;
  const progress = data.progress || 0;

  if (status === "completed" && data.downloadUrl) {
    setTimeout(() => onComplete(data.downloadUrl!), 0);
  }

  if (status === "failed") {
    setTimeout(() => onError(data.error || t("progress.failed")), 0);
  }

  const getCurrentStep = () => {
    switch (status) {
      case "waiting": return 0;
      case "processing": return 1;
      case "completed": return 2;
      default: return 0;
    }
  };

  const currentStep = getCurrentStep();

  const getStatusText = () => {
    switch (status) {
      case "waiting": return t("progress.waiting");
      case "processing": return t("progress.converting");
      case "completed": return t("progress.done");
      case "failed": return t("progress.failed");
      default: return t("progress.processingStatus");
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case "waiting": return t("progress.waitingDesc");
      case "processing": return t("progress.convertingDesc");
      case "completed": return t("progress.doneDesc");
      case "failed": return t("progress.failedDesc");
      default: return "";
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-1.5 bg-theme-secondary -translate-y-1/2 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((currentStep) / (steps.length - 1)) * 100 + (status === "processing" ? (progress / steps.length) : 0), 100)}%` }}
            />
          </div>

          {steps.map((step, index) => {
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.id} className="relative flex flex-col items-center z-10">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${
                    isCurrent
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg scale-110 animate-pulse-glow"
                      : isActive
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                      : "bg-theme-card text-theme-muted border border-theme"
                  }`}
                >
                  {isCurrent && status === "processing" ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors ${
                    isActive ? "text-theme" : "text-theme-muted"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-theme mb-2">{getStatusText()}</h3>
          <p className="text-sm text-theme-muted">{getStatusDescription()}</p>
        </div>

        <div className="relative">
          <div className="w-full bg-theme-secondary rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-gradient" />
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-theme-muted">{t("progress.progressLabel")}</span>
            <span className="text-2xl font-bold gradient-text">{progress}%</span>
          </div>
        </div>

        {status === "processing" && (
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-theme-muted">{t("progress.processingDots")}</span>
          </div>
        )}

        <div className="mt-6 p-4 bg-theme-secondary rounded-2xl">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-theme-muted">
              {t("progress.waitTip")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
