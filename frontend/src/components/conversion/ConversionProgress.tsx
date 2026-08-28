"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check, FileText, LoaderCircle, UploadCloud, Cog, Download } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ConversionTaskResult } from "@/types/task";

interface ConversionProgressProps {
  taskId: string;
  onComplete: (task: ConversionTaskResult) => void;
  onError: (error: string) => void;
}

export default function ConversionProgress({ taskId, onComplete, onError }: ConversionProgressProps) {
  const { t } = useI18n();

  const steps = [
    { id: "upload", label: t("progress.upload"), icon: <UploadCloud className="h-4 w-4" /> },
    { id: "process", label: t("progress.processing"), icon: <Cog className="h-4 w-4" /> },
    { id: "complete", label: t("progress.complete"), icon: <Download className="h-4 w-4" /> },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await axios.get<ConversionTaskResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}`,
      );
      return response.data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "completed" || status === "failed" ? false : 1000;
    },
    enabled: Boolean(taskId),
  });

  useEffect(() => {
    if (!data) return;
    if (data.status === "completed") {
      if (data.canDownload && data.downloadUrl) {
        onComplete(data);
      } else {
        onError(t("download.expired"));
      }
    }
    if (data.status === "failed") onError(data.error || t("progress.failed"));
  }, [data, onComplete, onError, t]);

  if (isLoading || !data) {
    return (
      <div className="operation-progress glass-card" aria-live="polite" aria-busy="true">
        <div className="operation-progress-loading">
          <LoaderCircle className="h-8 w-8 animate-spin" />
          <span>{t("progress.initializing")}</span>
        </div>
      </div>
    );
  }

  const status = data.status;
  const progress = Math.max(0, Math.min(100, data.progress || 0));
  const currentStep = status === "completed" ? 2 : status === "processing" ? 1 : 0;
  const statusText = {
    waiting: t("progress.waiting"),
    processing: t("progress.converting"),
    completed: t("progress.done"),
    failed: t("progress.failed"),
  }[status] || t("progress.processingStatus");
  const statusDescription = {
    waiting: t("progress.waitingDesc"),
    processing: t("progress.convertingDesc"),
    completed: t("progress.doneDesc"),
    failed: t("progress.failedDesc"),
  }[status] || "";

  return (
    <div className="operation-progress glass-card" aria-live="polite">
      <div className="operation-progress-steps">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isComplete = index < currentStep || status === "completed";
          return (
            <div key={step.id} className={`operation-progress-step ${isCurrent ? "is-current" : ""} ${isComplete ? "is-complete" : ""}`}>
              <span className="operation-progress-step-icon">
                {isComplete ? <Check className="h-4 w-4" /> : isCurrent && status === "processing" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : step.icon}
              </span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="operation-progress-panel">
        <div className="operation-progress-status-icon"><Cog className="h-6 w-6" /></div>
        <h3>{statusText}</h3>
        <p>{statusDescription}</p>

        <div className="operation-progress-track" role="progressbar" aria-label={t("progress.progressLabel")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="operation-progress-meta"><span>{t("progress.progressLabel")}</span><strong>{progress}%</strong></div>

        {status === "processing" && <div className="operation-progress-pulse"><i /><i /><i /><span>{t("progress.processingDots")}</span></div>}

        <div className="operation-progress-tip">
          <FileText className="h-4 w-4" />
          <span>{t("progress.waitTip")}</span>
        </div>
      </div>
    </div>
  );
}
