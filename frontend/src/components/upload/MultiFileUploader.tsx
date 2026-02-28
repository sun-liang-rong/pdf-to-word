"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
        "flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-all",
        isDragging
          ? "shadow-lg border-primary-400 bg-primary-50"
          : "hover:border-primary-300"
      )}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <span
          {...attributes}
          {...listeners}
          className="text-gray-400 cursor-move hover:text-primary-600 transition-colors select-none"
          title="拖拽排序"
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
        </span>
        <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
          {index + 1}
        </span>
        <span
          className="text-gray-700 truncate flex-1"
          title={fileItem.file.name}
        >
          {fileItem.file.name}
        </span>
        <span className="text-sm text-gray-500 whitespace-nowrap">
          ({(fileItem.file.size / 1024 / 1024).toFixed(2)} MB)
        </span>
      </div>
      <button
        onClick={() => onRemove(fileItem.id)}
        className="text-red-500 hover:text-red-700 p-2 transition-colors ml-2"
        title="删除文件"
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
        setError("只支持PDF文件");
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
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all relative min-h-[300px]",
            isDragActive
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50",
            isUploading && "opacity-60 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} disabled={isUploading} multiple />

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-primary-600 font-medium">正在合并PDF文件...</p>
            </div>
          )}

          <div className={clsx("flex flex-col", isUploading && "invisible")}>
            <svg
              className="w-16 h-16 text-gray-400 mb-4 mx-auto"
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
                  拖拽多个PDF文件到此处，或点击选择文件
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

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              已选择 {files.length} 个文件
            </h3>
            <p className="text-sm text-gray-600">
              总大小: {(totalSize / 1024 / 1024).toFixed(2)} MB
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

          <p className="mt-3 text-sm text-gray-500 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
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

        <div className="flex flex-col gap-2">
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
              "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all w-40 h-40 flex flex-col items-center justify-center",
              "border-gray-300 hover:border-primary-400 hover:bg-gray-50",
              isUploading && "opacity-60 cursor-not-allowed"
            )}
          >
            <svg
              className="w-10 h-10 text-gray-400 mb-2"
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
            <p className="text-sm text-gray-600">添加文件</p>
          </div>

          <button
            onClick={() => {
              setFiles([]);
              onFilesChange([]);
            }}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
          >
            清空全部
          </button>
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
