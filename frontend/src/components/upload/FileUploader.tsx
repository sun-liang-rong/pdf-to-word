"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import { Upload, CheckCircle, XCircle, FileText } from "lucide-react";

interface FileUploaderProps {
  accept: Record<string, string[]>;
  maxSize: number;
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  multiple?: boolean;
  title?: string;
  description?: string;
}

export default function FileUploader({
  accept,
  maxSize,
  onFileSelect,
  isUploading = false,
  multiple = false,
  title,
  description,
}: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      if (acceptedFiles.length > 0) {
        if (multiple) {
          acceptedFiles.forEach(file => onFileSelect(file));
        } else {
          onFileSelect(acceptedFiles[0]);
        }
      }
    },
    [onFileSelect, multiple]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled: isUploading,
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        setError(`文件大小超过限制 (最大 ${Math.round(maxSize / 1024 / 1024)}MB)`);
      } else if (error?.code === "file-invalid-type") {
        setError("文件类型不支持，请上传正确的文件格式");
      } else {
        setError("文件上传失败，请重试");
      }
    },
  });

  const getBorderColor = () => {
    if (isDragReject || error) return "border-red-400 bg-red-50 dark:bg-red-900/20";
    if (isDragAccept) return "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
    if (isDragActive) return "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20";
    if (isFocused) return "border-indigo-400";
    return "border-theme hover:border-indigo-400 hover:bg-theme-secondary";
  };

  const defaultTitle = multiple ? "上传多个文件" : "上传文件";
  const defaultDescription = multiple 
    ? "支持批量上传，拖拽文件到此处或点击选择" 
    : "拖拽文件到此处，或点击选择文件";

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={clsx(
          "relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 min-h-[240px] md:min-h-[280px]",
          getBorderColor(),
          isUploading && "opacity-60 cursor-not-allowed"
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-theme/95 backdrop-blur rounded-3xl z-10">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Upload className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
            <p className="mt-4 text-indigo-600 dark:text-indigo-400 font-semibold text-lg">正在上传文件...</p>
            <p className="text-sm text-theme-muted mt-1">请稍候，正在处理您的文件</p>
          </div>
        )}
        
        <div className={clsx("flex flex-col items-center", isUploading && "invisible")}>
          <div className={clsx(
            "w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300",
            isDragAccept ? "bg-emerald-100 dark:bg-emerald-900/30 scale-110" :
            isDragReject ? "bg-red-100 dark:bg-red-900/30 scale-110" :
            isDragActive ? "bg-indigo-100 dark:bg-indigo-900/30 scale-110" :
            "bg-theme-secondary border border-theme"
          )}>
            {isDragAccept ? (
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            ) : isDragReject ? (
              <XCircle className="w-10 h-10 text-red-500" />
            ) : (
              <Upload className="w-10 h-10 text-theme-muted" />
            )}
          </div>

          {isDragActive ? (
            <div className="space-y-2">
              <p className="text-xl font-semibold text-theme">
                {isDragAccept ? "释放文件以上传" : "文件格式不支持"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xl font-semibold text-theme">
                {title || defaultTitle}
              </p>
              <p className="text-base text-theme-muted">
                {description || defaultDescription}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-theme-muted flex-wrap">
            <span className="flex items-center whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1" />
              最大 {Math.round(maxSize / 1024 / 1024)}MB
            </span>
            <span className="w-1 h-1 bg-theme rounded-full"></span>
            <span>{multiple ? "支持多文件" : "支持单文件"}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start space-x-3 animate-slide-down">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-base text-red-600 dark:text-red-400 font-medium break-words">{error}</p>
            <p className="text-sm text-red-500 dark:text-red-300/70 mt-1">请检查文件格式和大小后重试</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
