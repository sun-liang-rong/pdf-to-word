"use client";

import { useState } from "react";
import axios from "axios";

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
        setError("文件已过期或不存在，请重新上传转换");
      } else {
        setError("下载失败，请稍后重试");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full animate-bounce-in">
      <div className="success-container rounded-2xl p-6 sm:p-8">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-emerald rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-accent-emerald rounded-full animate-pulse opacity-10" style={{ animationDelay: '0.5s' }} />
            
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent-emerald to-teal-500 rounded-full flex items-center justify-center shadow-emerald">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            转换成功！
          </h3>
          <p className="text-sm sm:text-base text-foreground-muted px-2">
            您的文件已成功转换，点击下方按钮下载
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3 border border-accent-emerald/20">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent-emerald/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-white truncate">
              {fileName}
            </p>
            <p className="text-xs text-accent-emerald">转换完成</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 error-container flex items-start space-x-2 sm:space-x-3 animate-slide-down">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs sm:text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:gap-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-accent-emerald to-teal-500 hover:from-teal-500 hover:to-accent-emerald disabled:from-accent-emerald/50 disabled:to-teal-500/50 text-white font-semibold rounded-xl transition-all duration-300 shadow-emerald hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 text-sm sm:text-base"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2" />
                下载中...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                下载文件
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 border border-white/10 hover:border-primary/30 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            转换其他文件
          </button>
        </div>

        <div className="mt-4 sm:mt-6 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-foreground-muted">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>文件将在 30 分钟后自动删除</span>
        </div>
      </div>
    </div>
  );
}
