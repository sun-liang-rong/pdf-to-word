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
      <div className="w-full p-8 bg-gray-50 rounded-2xl">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
          </div>
          <span className="mt-4 text-gray-600 font-medium">正在初始化...</span>
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
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((currentStep) / (steps.length - 1)) * 100 + (status === "processing" ? (progress / steps.length) : 0), 100)}%` }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.id} className="relative flex flex-col items-center z-10">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
                    isCurrent
                      ? "bg-primary-600 text-white shadow-lg scale-110"
                      : isActive
                      ? "bg-primary-100 text-primary-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCurrent && status === "processing" ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors ${
                    isActive ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-8">
        {/* Status Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{getStatusText()}</h3>
          <p className="text-gray-500">{getStatusDescription()}</p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 50%, #3b82f6 100%)",
                backgroundSize: "200% 100%",
                animation: status === "processing" ? "shimmer 2s linear infinite" : "none",
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">转换进度</span>
            <span className="text-2xl font-bold text-primary-600">{progress}%</span>
          </div>
        </div>

        {/* Processing Animation */}
        {status === "processing" && (
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">正在处理中...</span>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">
              转换时间取决于文件大小和页数，请耐心等待，不要关闭页面
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
