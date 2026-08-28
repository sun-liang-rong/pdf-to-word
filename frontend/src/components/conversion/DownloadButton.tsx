"use client";

import { useState } from "react";
import axios from "axios";
import { CheckCircle, Download, FileText, LockKeyhole, RefreshCw, XCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ConversionTaskResult } from "@/types/task";

interface TaskDownloadProps {
  task: ConversionTaskResult;
  onReset: () => void;
}

interface LegacyDownloadProps {
  downloadUrl: string;
  fileName: string;
  onReset: () => void;
}

type DownloadButtonProps = TaskDownloadProps | LegacyDownloadProps;

export default function DownloadButton({ ...props }: DownloadButtonProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const task = "task" in props ? props.task : null;
  const downloadUrl = task?.downloadUrl ?? ("downloadUrl" in props ? props.downloadUrl : undefined);
  const fileName = task?.outputFileName ?? ("fileName" in props ? props.fileName : "converted");

  const handleDownload = async () => {
    if (!downloadUrl || isDownloading) return;
    setIsDownloading(true);
    setError(null);

    try {
      const response = await axios.get(downloadUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (requestError: any) {
      setError(requestError.response?.status === 404 ? t("download.expired") : t("download.downloadFailed"));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="operation-result glass-card" aria-live="polite">
      <div className="operation-result-icon"><CheckCircle className="h-7 w-7" /></div>
      <div className="operation-result-heading">
        <h3>{t("download.success")}</h3>
        <p>{t("download.successDesc")}</p>
      </div>

      <div className="operation-result-file">
        <FileText className="h-5 w-5" />
        <div className="min-w-0 flex-1"><strong title={fileName}>{fileName}</strong><span>{t("download.converted")}</span></div>
      </div>

      {error && <div className="operation-result-error" role="alert"><XCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}

      <div className="operation-result-actions">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading || !downloadUrl || (task ? !task.canDownload : false)}
          className="operation-primary-action"
          aria-busy={isDownloading}
        >
          {isDownloading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isDownloading ? t("download.downloading") : t("download.downloadFile")}
        </button>
        <button type="button" onClick={props.onReset} className="operation-secondary-action"><RefreshCw className="h-4 w-4" />{t("download.convertOther")}</button>
      </div>

      <p className="operation-result-privacy"><LockKeyhole className="h-4 w-4" />{t("download.autoDelete")}</p>
    </div>
  );
}
