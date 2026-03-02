"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

const steps = [
  { id: "upload", label: "上传文件", icon: "📤" },
  { id: "process", label: "转换中", icon: "⚙️" },
  { id: "complete", label: "完成", icon: "✅" },
];

export default function ConversionProgress({
  taskId,
  onComplete,
  onError,
}: ConversionProgressProps) {
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
      <div className="w-full p-8 card-dark rounded-2xl">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary-500"></div>
          </div>
          <span className="mt-4 text-foreground-muted font-medium">正在初始化...</span>
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
    setTimeout(() => onError(data.error || "转换失败"), 0);
  }

  const getCurrentStep = () => {
    switch (status) {
      case "waiting":
        return 0;
      case "processing":
        return 1;
      case "completed":
        return 2;
      default:
        return 0;
    }
  };

  const currentStep = getCurrentStep();

  const getStatusText = () => {
    switch (status) {
      case "waiting":
        return "正在排队等待处理...";
      case "processing":
        return "正在转换文件中...";
      case "completed":
        return "转换完成！";
      case "failed":
        return "转换失败";
      default:
        return "处理中...";
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case "waiting":
        return "系统正在准备处理您的文件";
      case "processing":
        return "请稍候，正在努力转换中";
      case "completed":
        return "文件已成功转换，正在准备下载";
      case "failed":
        return "转换过程中出现错误";
      default:
        return "";
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-white/10 -translate-y-1/2 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((currentStep) / (steps.length - 1)) * 100 + (status === "processing" ? (progress / steps.length) : 0), 100)}%` }}
            />
          </div>

          {steps.map((step, index) => {
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.id} className="relative flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all duration-300 ${
                    isCurrent
                      ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-glow scale-110"
                      : isActive
                      ? "bg-primary/20 text-primary-300 border border-primary/30"
                      : "bg-white/5 text-foreground-muted border border-white/10"
                  }`}
                >
                  {isCurrent && status === "processing" ? (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-foreground-muted"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-dark rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{getStatusText()}</h3>
          <p className="text-xs sm:text-sm text-foreground-muted">{getStatusDescription()}</p>
        </div>

        <div className="relative">
          <div className="w-full bg-white/10 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative progress-bar-fill"
              style={{
                width: `${progress}%`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 sm:mt-3">
            <span className="text-xs sm:text-sm text-foreground-muted">转换进度</span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary-400">{progress}%</span>
          </div>
        </div>

        {status === "processing" && (
          <div className="mt-4 sm:mt-6 flex items-center justify-center space-x-1 sm:space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-foreground-muted">正在处理中...</span>
          </div>
        )}

        <div className="mt-4 sm:mt-6 info-container rounded-xl">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs sm:text-sm text-primary-300">
              转换时间取决于文件大小和页数，请耐心等待，不要关闭页面
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
