"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import { Upload, CheckCircle, XCircle, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        setError(t("upload.fileTooLarge").replace("{size}", String(Math.round(maxSize / 1024 / 1024))));
      } else if (err?.code === "file-invalid-type") {
        setError(t("upload.invalidType"));
      } else {
        setError(t("upload.uploadFailed"));
      }
    },
  });

  const defaultTitle = multiple ? t("upload.titleMultiple") : t("upload.title");
  const defaultDescription = multiple
    ? t("upload.dragDropMultiple")
    : t("upload.dragDrop");
  const acceptedFormats = Object.values(accept).flat().join(" / ").toUpperCase();
  const uploaderState = isDragReject || error ? "is-reject" : isDragAccept ? "is-accept" : isDragActive ? "is-dragging" : isFocused ? "is-focused" : "";

  return (
    <div className="w-full">
      <div
        {...getRootProps({
          "aria-label": title || defaultTitle,
          "aria-busy": isUploading,
        })}
        className={clsx(
          "operation-uploader relative cursor-pointer text-center transition-all duration-300",
          uploaderState,
          isUploading && "opacity-60 cursor-not-allowed"
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <input {...getInputProps()} disabled={isUploading} />

        {isUploading && (
          <div className="operation-uploader-loading">
            <div className="operation-uploader-spinner"><Upload className="h-5 w-5" /></div>
            <p>{t("upload.uploading")}</p>
            <span>{t("upload.pleaseWait")}</span>
          </div>
        )}

        <div className={clsx("operation-uploader-content", isUploading && "invisible")}>
          <div className="operation-upload-icon">
            {isDragAccept ? (
              <CheckCircle className="h-9 w-9" />
            ) : isDragReject ? (
              <XCircle className="h-9 w-9" />
            ) : (
              <Upload className="h-9 w-9" />
            )}
          </div>

          {isDragActive ? (
            <p className="operation-upload-title">{isDragAccept ? t("upload.releaseToUpload") : t("upload.formatNotSupported")}</p>
          ) : (
            <div>
              <p className="operation-upload-title">{title || defaultTitle}</p>
              <p className="operation-upload-description">{description || defaultDescription}</p>
            </div>
          )}

          <span className="operation-upload-action"><Upload className="h-4 w-4" />{t("upload.title")}</span>

          <div className="operation-upload-meta">
            <span><FileText className="h-4 w-4" />{acceptedFormats || t("upload.singleFile")}</span>
            <span>{t("upload.maxSize").replace("{size}", String(Math.round(maxSize / 1024 / 1024)))}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="operation-uploader-error" role="alert" aria-live="assertive">
          <XCircle className="h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p>{error}</p>
            <span>{t("upload.checkFormat")}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="operation-icon-button"
            aria-label={t("upload.dismissError")}
            title={t("upload.dismissError")}
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
