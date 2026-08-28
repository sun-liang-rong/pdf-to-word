"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  GripVertical,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useI18n } from "@/lib/i18n";

export interface FileItem {
  id: string;
  file: File;
}

interface MultiFileUploaderProps {
  maxSize: number;
  onFilesChange: (files: FileItem[]) => void;
  isUploading?: boolean;
}

function generateId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

interface SortableItemProps {
  fileItem: FileItem;
  index: number;
  onRemove: (id: string) => void;
  disabled: boolean;
  removeLabel: string;
  reorderLabel: string;
}

function SortableItem({
  fileItem,
  index,
  onRemove,
  disabled,
  removeLabel,
  reorderLabel,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fileItem.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="listitem"
      className={clsx(
        "flex min-h-[68px] items-center gap-3 rounded-xl border bg-theme-card p-3 transition-all touch-none sm:p-4",
        isDragging
          ? "border-indigo-400 bg-indigo-50 shadow-lg dark:bg-indigo-950/40"
          : "border-theme hover:border-indigo-300",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        className="flex-shrink-0 cursor-grab rounded-lg p-2 text-theme-muted transition-colors hover:bg-theme-secondary hover:text-indigo-500 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        title={reorderLabel}
        aria-label={reorderLabel}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-sm font-bold text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
        {index + 1}
      </span>

      <FileText className="hidden h-5 w-5 flex-shrink-0 text-indigo-500 sm:block" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-theme" title={fileItem.file.name}>
          {fileItem.file.name}
        </p>
        <p className="mt-0.5 text-xs text-theme-muted">{formatBytes(fileItem.file.size)}</p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(fileItem.id)}
        disabled={disabled}
        className="flex-shrink-0 rounded-lg p-2 text-theme-muted transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-950/30"
        title={removeLabel}
        aria-label={`${removeLabel}: ${fileItem.file.name}`}
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function MultiFileUploader({
  maxSize,
  onFilesChange,
  isUploading = false,
}: MultiFileUploaderProps) {
  const { t } = useI18n();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const filesRef = useRef<FileItem[]>([]);

  const updateFiles = useCallback((nextFiles: FileItem[]) => {
    filesRef.current = nextFiles;
    setFiles(nextFiles);
    onFilesChange(nextFiles);
  }, [onFilesChange]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleFiles = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setError(null);
      updateFiles([
        ...filesRef.current,
        ...acceptedFiles.map((file) => ({ id: generateId(), file })),
      ]);
    },
    [updateFiles],
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop: handleFiles,
    accept: { "application/pdf": [".pdf"] },
    maxSize,
    multiple: true,
    disabled: isUploading,
    onDropRejected: (rejections) => {
      const rejection = rejections[0]?.errors[0];
      if (rejection?.code === "file-too-large") {
        setError(t("upload.fileTooLarge").replace("{size}", String(Math.round(maxSize / 1024 / 1024))));
      } else if (rejection?.code === "file-invalid-type") {
        setError(t("upload.invalidType"));
      } else {
        setError(t("upload.uploadFailed"));
      }
    },
  });

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((item) => item.id !== id);
    updateFiles(updatedFiles);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isUploading) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = files.findIndex((item) => item.id === active.id);
    const newIndex = files.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const updatedFiles = arrayMove(files, oldIndex, newIndex);
    updateFiles(updatedFiles);
  };

  const clearFiles = () => {
    if (isUploading) return;
    updateFiles([]);
  };

  const totalSize = files.reduce((sum, item) => sum + item.file.size, 0);
  const maxSizeLabel = t("upload.maxSize").replace("{size}", String(Math.round(maxSize / 1024 / 1024)));
  return (
    <div className="w-full">
      {files.length === 0 ? (
        <div {...getRootProps({ className: `operation-multi-uploader ${isDragReject || error ? "is-reject" : isDragAccept ? "is-accept" : isDragActive ? "is-dragging" : ""}`, "aria-label": t("upload.titleMultiple") })}>
          <input {...getInputProps()} />
          {isUploading && (
            <div className="operation-uploader-loading">
              <div className="operation-uploader-spinner"><Upload className="h-5 w-5" /></div>
              <p>{t("upload.uploading")}</p>
              <span>{t("upload.pleaseWait")}</span>
            </div>
          )}
          <div className={clsx("operation-uploader-content", isUploading && "invisible")}>
            <div className="operation-upload-icon">
              {isDragReject ? <X className="h-9 w-9 text-red-500" /> : isDragAccept ? <CheckCircle className="h-9 w-9 text-emerald-500" /> : <Upload className="h-9 w-9 text-theme-muted" />}
            </div>
            <p className="operation-upload-title">{isDragActive ? (isDragAccept ? t("upload.releaseToUpload") : t("upload.formatNotSupported")) : t("upload.titleMultiple")}</p>
            {!isDragActive && <p className="operation-upload-description">{t("upload.dragDropMultiple")}</p>}
            <span className="operation-upload-action"><Plus className="h-4 w-4" />{t("upload.addFile")}</span>
            <div className="operation-upload-meta">
              <span><FileText className="h-4 w-4" />{maxSizeLabel}</span>
              <span>{t("upload.multipleFiles")}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="operation-multi-list space-y-4" role="region" aria-live="polite" aria-label={t("upload.selectedCount").replace("{count}", String(files.length))}>
          <div className="flex flex-col gap-2 border-b border-theme pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-base font-bold text-theme">{t("upload.selectedCount").replace("{count}", String(files.length))}</p>
              <p className="mt-1 text-xs text-theme-muted">{t("upload.reorderHint")}</p>
            </div>
            <p className="text-sm text-theme-muted">{t("upload.totalSize")} {formatBytes(totalSize)}</p>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={files.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2" role="list">
                {files.map((fileItem, index) => (
                  <SortableItem
                    key={fileItem.id}
                    fileItem={fileItem}
                    index={index}
                    onRemove={removeFile}
                    disabled={isUploading}
                    removeLabel={t("upload.removeFile")}
                    reorderLabel={t("upload.dragToReorder")}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div {...getRootProps({ className: clsx("operation-multi-add", isDragActive && "is-dragging", isUploading && "is-disabled"), "aria-label": t("upload.addFile") })}>
              <input {...getInputProps()} />
              <Plus className="h-5 w-5" />
              <span>{isDragActive ? t("upload.releaseToUpload") : t("upload.addFile")}</span>
            </div>
            <button
              type="button"
              onClick={clearFiles}
              disabled={isUploading}
              className="operation-multi-clear"
            >
              <Trash2 className="h-4 w-4" />
              {t("upload.clearAll")}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="operation-uploader-error mt-4" role="alert" aria-live="assertive">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p>{error}</p>
            <span>{t("upload.checkFormat")}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="operation-icon-button" aria-label={t("upload.dismissError")} title={t("upload.dismissError")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
