"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

interface FileUploaderProps {
  accept: Record<string, string[]>;
  maxSize: number;
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export default function FileUploader({
  accept,
  maxSize,
  onFileSelect,
  isUploading = false,
}: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
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
    if (isDragReject || error) return "border-red-400 bg-red-50";
    if (isDragAccept) return "border-green-400 bg-green-50";
    if (isDragActive) return "border-primary-400 bg-primary-50";
    if (isFocused) return "border-primary-400";
    return "border-gray-300 hover:border-primary-300 hover:bg-gray-50";
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={clsx(
          "relative border-2 border-dashed rounded-2xl p-10 md:p-14 text-center cursor-pointer transition-all duration-300",
          getBorderColor(),
          isUploading && "opacity-60 cursor-not-allowed"
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl z-10">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100 border-t-primary-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-primary-700 font-semibold text-lg">正在上传文件...</p>
            <p className="text-sm text-gray-500 mt-1">请稍候，正在处理您的文件</p>
          </div>
        )}
        
        <div className={clsx("flex flex-col items-center", isUploading && "invisible")}>
          {/* Icon Container */}
          <div className={clsx(
            "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
            isDragActive ? "bg-primary-100 scale-110" : "bg-gray-100"
          )}>
            {isDragAccept ? (
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : isDragReject ? (
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>

          {/* Text Content */}
          {isDragActive ? (
            <div className="space-y-2">
              <p className="text-xl font-semibold text-primary-600">
                {isDragAccept ? "释放文件以上传" : "文件格式不支持"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xl font-semibold text-gray-700">
                拖拽文件到此处
              </p>
              <p className="text-gray-500">
                或 <span className="text-primary-600 font-medium underline underline-offset-2">点击选择文件</span>
              </p>
            </div>
          )}

          {/* File Info */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              最大 {Math.round(maxSize / 1024 / 1024)}MB
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>支持多种格式</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-slide-down">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
            <p className="text-red-600/70 text-sm mt-1">请检查文件格式和大小后重试</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
