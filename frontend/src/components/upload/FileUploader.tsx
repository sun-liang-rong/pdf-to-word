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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
        setError("文件类型不支持");
      } else {
        setError("文件上传失败，请重试");
      }
    },
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all relative",
          isDragActive
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-primary-400 hover:bg-gray-50",
          isUploading && "opacity-60 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-primary-600 font-medium">正在上传并转换...</p>
            <p className="text-sm text-gray-500 mt-1">请稍候，正在处理您的文件</p>
          </div>
        )}
        
        <div className={clsx("flex flex-col items-center", isUploading && "invisible")}>
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {isDragActive ? (
            <p className="text-lg text-primary-600 font-medium">
              释放文件以上传
            </p>
          ) : (
            <>
              <p className="text-lg text-gray-700 font-medium mb-2">
                拖拽文件到此处，或点击选择文件
              </p>
              <p className="text-sm text-gray-500">
                最大文件大小: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
