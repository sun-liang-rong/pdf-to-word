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
      <div className="w-full p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">正在查询任务状态...</span>
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

  const getStatusText = () => {
    switch (status) {
      case "waiting":
        return "等待处理...";
      case "processing":
        return "正在转换...";
      case "completed":
        return "转换完成!";
      case "failed":
        return "转换失败";
      default:
        return "未知状态";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "waiting":
        return "bg-yellow-500";
      case "processing":
        return "bg-primary-500";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700 font-medium">{getStatusText()}</span>
        <span className="text-gray-500 text-sm">{progress}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {status === "processing" && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          请稍候，文件正在转换中...
        </p>
      )}
    </div>
  );
}
