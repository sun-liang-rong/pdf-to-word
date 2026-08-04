"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
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

interface FileItem {
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
    : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface SortableItemProps {
  fileItem: FileItem;
  index: number;
  onRemove: (id: string) => void;
}

function SortableItem({ fileItem, index, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fileItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "flex items-center justify-between p-4 card-dark border border-primary/20 rounded-xl transition-all touch-none",
        isDragging
          ? "border-primary-400/50 bg-primary/20 shadow-glow"
          : "hover:border-primary/40"
      )}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-foreground-muted cursor-grab hover:text-primary-400 transition-colors select-none touch-none p-2 -m-2 active:cursor-grabbing"
          title="拖拽排序"
          aria-label="拖拽排序"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>
        <span className="flex items-center justify-center w-8 h-8 bg-primary/20 text-primary-300 rounded-lg text-sm font-medium border border-primary/30 flex-shrink-0">
          {index + 1}
        </span>
        <span
          className="text-white truncate flex-1 min-w-0"
          title={fileItem.file.name}
        >
          {fileItem.file.name}
        </span>
        <span className="text-sm text-foreground-muted whitespace-nowrap flex-shrink-0">
          ({(fileItem.file.size / 1024 / 1024).toFixed(2)} MB)
        </span>
      </div>
      <button
        onClick={() => onRemove(fileItem.id)}
        className="text-red-400 hover:text-red-300 p-2 transition-colors ml-2 hover:bg-red-500/10 rounded-lg flex-shrink-0"
        title="删除文件"
        aria-label="删除文件"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default function MultiFileUploader({
  maxSize,
  onFilesChange,
  isUploading = false,
}: MultiFileUploaderProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFiles = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const newFileItems = acceptedFiles.map((file) => ({
        id: generateId(),
        file,
      }));
      const updatedFiles = [...files, ...newFileItems];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    accept: { "application/pdf": [".pdf"] },
    maxSize,
    multiple: true,
    disabled: isUploading,
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        setError(
          `文件大小超过限制 (最大 ${Math.round(maxSize / 1024 / 1024)}MB)`
        );
      } else if (error?.code === "file-invalid-type") {
        setError("只支持 PDF 文件");
      } else {
        setError("文件上传失败，请重试");
      }
    },
  });

  const removeFile = (id: string) => {
    const newFiles = files.filter((f) => f.id !== id);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);
      const newFiles = arrayMove(files, oldIndex, newIndex);
      setFiles(newFiles);
      onFilesChange(newFiles);
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  if (files.length === 0) {
    return (
      <div className="w-full">
        <div
          {...getRootProps()}
          className={clsx(
            "border-2 border-dashed rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all relative min-h-[280px] upload-zone",
            isDragActive
              ? "border-primary-500/50 bg-primary-500/10"
              : "border-primary/30 hover:border-primary/50 hover:bg-white/5",
            isUploading && "opacity-60 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} disabled={isUploading} multiple />

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm rounded-2xl">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary-500 mb-4"></div>
              <p className="text-primary-300 font-medium text-base sm:text-lg">正在处理 PDF 文件...</p>
            </div>
          )}

          <div className={clsx("flex flex-col items-center", isUploading && "invisible")}>
            <div className={clsx(
              "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300",
              isDragActive ? "bg-primary/20 scale-110" : "bg-white/5 border border-primary/20"
            )}>
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-foreground-muted"
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
            </div>
            {isDragActive ? (
              <p className="text-lg text-primary-300 font-medium mb-2">
                释放文件以上传
              </p>
            ) : (
              <>
                <p className="text-lg sm:text-xl font-semibold text-white mb-2">
                  上传多个 PDF 文件
                </p>
                <p className="text-sm sm:text-base text-foreground-muted mb-4">
                  拖拽多个 PDF 文件到此处，或点击选择文件
                </p>
              </>
            )}
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-foreground-muted">
              <span className="flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                最大 {Math.round(maxSize / 1024 / 1024)}MB
              </span>
              <span className="w-0.5 h-3 sm:w-1 sm:h-1 bg-primary/30 rounded-full hidden sm:inline-block"></span>
              <span>支持批量上传</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 error-container flex items-start space-x-3 animate-slide-down">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-red-400 font-medium">{error}</p>
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

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              已选择 {files.length} 个文件
            </h3>
            <p className="text-sm text-foreground-muted">
              总大小：{(totalSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={files.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {files.map((fileItem, index) => (
                  <SortableItem
                    key={fileItem.id}
                    fileItem={fileItem}
                    index={index}
                    onRemove={removeFile}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <p className="mt-3 text-xs sm:text-sm text-foreground-muted flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            拖拽文件可调整合并顺序
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />
          <div
            onClick={handleAddClick}
            className={clsx(
              "border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all w-full sm:w-40 h-40 flex flex-col items-center justify-center",
              "border-primary/30 hover:border-primary/50 hover:bg-white/5",
              isUploading && "opacity-60 cursor-not-allowed"
            )}
          >
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-foreground-muted mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-xs sm:text-sm text-foreground-muted">添加文件</p>
          </div>

          <button
            onClick={() => {
              setFiles([]);
              onFilesChange([]);
            }}
            className="px-3 sm:px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-xs sm:text-sm"
          >
            清空全部
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 error-container flex items-start space-x-3 animate-slide-down">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base text-red-400 font-medium">{error}</p>
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
