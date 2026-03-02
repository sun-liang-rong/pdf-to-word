"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

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
    if (isDragReject || error) return "border-red-400/50 bg-red-500/10";
    if (isDragAccept) return "border-accent-emerald/50 bg-accent-emerald/10";
    if (isDragActive) return "border-primary-400/50 bg-primary-500/10";
    if (isFocused) return "border-primary-400/50";
    return "border-primary/30 hover:border-primary/50 hover:bg-white/5";
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
          "relative border-2 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 text-center cursor-pointer transition-all duration-300 min-h-[240px] sm:min-h-[280px] upload-zone",
          getBorderColor(),
          isUploading && "opacity-60 cursor-not-allowed"
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm rounded-2xl z-10">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary/20 border-t-primary-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <p className="mt-3 sm:mt-4 text-primary-300 font-semibold text-base sm:text-lg">正在上传文件...</p>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">请稍候，正在处理您的文件</p>
          </div>
        )}
        
        <div className={clsx("flex flex-col items-center", isUploading && "invisible")}>
          <div className={clsx(
            "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300",
            isDragActive ? "bg-primary/20 scale-110" : "bg-white/5 border border-primary/20"
          )}>
            {isDragAccept ? (
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : isDragReject ? (
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>

          {isDragActive ? (
            <div className="space-y-1 sm:space-y-2">
              <p className="text-lg sm:text-xl font-semibold text-primary-300">
                {isDragAccept ? "释放文件以上传" : "文件格式不支持"}
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <p className="text-lg sm:text-xl font-semibold text-white px-2">
                {title || defaultTitle}
              </p>
              <p className="text-sm sm:text-base text-foreground-muted">
                {description || defaultDescription}
              </p>
            </div>
          )}

          <div className="mt-4 sm:mt-6 flex items-center justify-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-foreground-muted flex-wrap px-2">
            <span className="flex items-center whitespace-nowrap">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              最大 {Math.round(maxSize / 1024 / 1024)}MB
            </span>
            <span className="w-0.5 h-3 sm:w-1 sm:h-1 bg-primary/30 rounded-full hidden sm:inline-block"></span>
            <span>{multiple ? "支持多文件" : "支持单文件"}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 sm:mt-4 error-container flex items-start space-x-2 sm:space-x-3 animate-slide-down">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base text-red-400 font-medium break-words">{error}</p>
            <p className="text-xs sm:text-sm text-red-400/70 mt-1">请检查文件格式和大小后重试</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-400/50 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
