"use client";

import { useState } from "react";
import axios from "axios";
import { Download, RefreshCw, Lock, FileText, CheckCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface DownloadButtonProps {
  downloadUrl: string;
  fileName: string;
  onReset: () => void;
}

export default function DownloadButton({
  downloadUrl,
  fileName,
  onReset,
}: DownloadButtonProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(t("download.expired"));
      } else {
        setError(t("download.downloadFailed"));
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="glass-card rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse opacity-10" style={{ animationDelay: '0.5s' }} />

            <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-theme mb-2">
            {t("download.success")}
          </h3>
          <p className="text-base text-theme-muted">
            {t("download.successDesc")}
          </p>
        </div>

        <div className="bg-theme-secondary rounded-2xl p-4 mb-6 flex items-center space-x-3 border border-theme">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-theme truncate">
              {fileName}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">{t("download.converted")}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start space-x-3 animate-slide-down">
            <FileText className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-500 hover:to-emerald-500 disabled:from-emerald-500/50 disabled:to-teal-500/50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 text-base"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                {t("download.downloading")}
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                {t("download.downloadFile")}
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="w-full inline-flex items-center justify-center px-6 py-4 bg-theme-card hover:bg-theme-secondary text-theme font-semibold rounded-2xl transition-all duration-300 border border-theme hover:border-indigo-300 text-base"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            {t("download.convertOther")}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-theme-muted">
          <Lock className="w-4 h-4" />
          <span>{t("download.autoDelete")}</span>
        </div>
      </div>
    </div>
  );
}
