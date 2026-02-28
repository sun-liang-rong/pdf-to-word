"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";
import { getPDFPageCount } from "@/lib/pdf-utils";
import * as pdfjs from "pdfjs-dist";
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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const faqItems = [
  {
    question: "PDF 页面排序后原文件会改变吗？",
    answer: "不会。页面排序会生成新的 PDF 文件，原文件保持不变。",
  },
  {
    question: "支持哪些排序模式？",
    answer: "支持拖拽自定义排序、倒序、复制页面、双面扫描排序、小册子排序、奇偶页分离/合并等多种模式。",
  },
  {
    question: "可以撤销排序操作吗？",
    answer: "可以。点击'恢复原始顺序'按钮可以重置为初始状态。",
  },
];

type RearrangeMode =
  | "CUSTOM"
  | "REVERSE_ORDER"
  | "DUPLICATE"
  | "DUPLEX_SORT"
  | "BOOKLET_SORT"
  | "ODD_EVEN_SPLIT"
  | "ODD_EVEN_MERGE"
  | "REMOVE_FIRST"
  | "REMOVE_LAST"
  | "REMOVE_FIRST_AND_LAST";

const modeOptions: { value: RearrangeMode; label: string; description: string }[] = [
  { value: "CUSTOM", label: "自定义排序", description: "使用拖拽调整页面顺序" },
  { value: "REVERSE_ORDER", label: "全部倒序", description: "将页面顺序完全颠倒" },
  { value: "DUPLICATE", label: "复制页面", description: "将每页复制指定次数" },
  { value: "DUPLEX_SORT", label: "双面扫描排序", description: "适用于双面扫描文档" },
  { value: "BOOKLET_SORT", label: "小册子排序", description: "适用于小册子打印" },
  { value: "ODD_EVEN_SPLIT", label: "奇偶页分离", description: "奇数页在前，偶数页在后" },
  { value: "ODD_EVEN_MERGE", label: "奇偶页合并", description: "奇偶页交替排列" },
  { value: "REMOVE_FIRST", label: "删除第一页", description: "删除第一页后重新排序" },
  { value: "REMOVE_LAST", label: "删除最后一页", description: "删除最后一页后重新排序" },
  { value: "REMOVE_FIRST_AND_LAST", label: "删除首尾页", description: "删除首尾页后重新排序" },
];

interface SortableThumbnailProps {
  id: string;
  pageNum: number;
  canvas: HTMLCanvasElement;
  index: number;
}

function SortableThumbnail({ id, pageNum, canvas, index }: SortableThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        "relative border-2 rounded-xl p-3 bg-white cursor-move group select-none",
        isDragging 
          ? "border-blue-500 shadow-2xl scale-105 rotate-2" 
          : "border-gray-200 hover:border-blue-400 hover:shadow-lg"
      )}
    >
      {/* 序号标签 */}
      <div
        className={clsx(
          "absolute -top-2 -left-2 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10 transition-colors",
          isDragging ? "bg-blue-600" : "bg-blue-500 group-hover:bg-blue-600"
        )}
      >
        {index + 1}
      </div>
      
      {/* 拖拽提示图标 */}
      <div className="absolute top-2 right-2 text-gray-300 group-hover:text-gray-400 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      
      {/* 预览画布区域 - 增大显示区域 */}
      <div 
        className="flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden"
        style={{ aspectRatio: canvas ? canvas.width / canvas.height : 0.707 }}
      >
        <canvas
          ref={(el) => {
            if (el && canvas) {
              const ctx = el.getContext("2d");
              if (ctx) {
                el.width = canvas.width;
                el.height = canvas.height;
                ctx.drawImage(canvas, 0, 0);
              }
            }
          }}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* 页面信息 */}
      <div className="text-center mt-3">
        <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 font-medium">
          原第 {pageNum} 页
        </span>
      </div>
      
      {/* 拖拽时的视觉反馈遮罩 */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none" />
      )}
    </div>
  );
}

export default function RearrangePdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [originalOrder, setOriginalOrder] = useState<number[]>([]);
  const [pageThumbnails, setPageThumbnails] = useState<HTMLCanvasElement[]>([]);
  const [mode, setMode] = useState<RearrangeMode>("CUSTOM");
  const [duplicateCount, setDuplicateCount] = useState(2);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setError(null);
        setTaskId(null);
        setDownloadUrl(null);
        setLoadingProgress(0);

        try {
          const pages = await getPDFPageCount(selectedFile);
          setPageCount(pages);
          const initialOrder = Array.from({ length: pages }, (_, i) => i + 1);
          setPageOrder(initialOrder);
          setOriginalOrder(initialOrder);
          await renderThumbnails(selectedFile, pages);
        } catch (err: any) {
          setError("无法读取 PDF 文件，请检查文件是否损坏");
          setPageCount(0);
        }
      }
    },
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
    disabled: isProcessing,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        setError("文件大小超过限制 (最大 20MB)");
      } else if (err?.code === "file-invalid-type") {
        setError("只支持 PDF 文件");
      } else {
        setError("文件上传失败，请重试");
      }
    },
  });

  const renderThumbnails = async (pdfFile: File, pages: number) => {
    const canvases: HTMLCanvasElement[] = [];
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;

    for (let i = 1; i <= pages; i++) {
      const page = await pdf.getPage(i);
      const scale = 0.15;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const context = canvas.getContext("2d");
      if (context) {
        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      }

      canvases.push(canvas);
      setLoadingProgress(Math.round((i / pages) * 100));
    }

    setPageThumbnails(canvases);
    setLoadingProgress(100);
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPageOrder((items) => {
        const oldIndex = items.findIndex((item) => item.toString() === active.id);
        const newIndex = items.findIndex((item) => item.toString() === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleModeChange = (newMode: RearrangeMode) => {
    setMode(newMode);

    switch (newMode) {
      case "REVERSE_ORDER":
        setPageOrder([...originalOrder].reverse());
        break;
      case "ODD_EVEN_SPLIT":
        const odd = originalOrder.filter((n) => n % 2 === 1);
        const even = originalOrder.filter((n) => n % 2 === 0);
        setPageOrder([...odd, ...even]);
        break;
      case "ODD_EVEN_MERGE":
        const odd2 = originalOrder.filter((n) => n % 2 === 1);
        const even2 = originalOrder.filter((n) => n % 2 === 0);
        const merged: number[] = [];
        const maxLen = Math.max(odd2.length, even2.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < odd2.length) merged.push(odd2[i]);
          if (i < even2.length) merged.push(even2[i]);
        }
        setPageOrder(merged);
        break;
      case "REMOVE_FIRST":
        setPageOrder(originalOrder.slice(1));
        break;
      case "REMOVE_LAST":
        setPageOrder(originalOrder.slice(0, -1));
        break;
      case "REMOVE_FIRST_AND_LAST":
        setPageOrder(originalOrder.slice(1, -1));
        break;
      case "CUSTOM":
      default:
        setPageOrder([...originalOrder]);
        break;
    }
  };

  const generatePageNumbers = (): string => {
    if (mode === "DUPLICATE") {
      return duplicateCount.toString();
    }
    return pageOrder.join(",");
  };

  const handleRearrange = async () => {
    if (!file) {
      setError("请先上传 PDF 文件");
      return;
    }

    const pageNumbers = generatePageNumbers();
    if (!pageNumbers) {
      setError("请设置页面顺序");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setTaskId(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageNumbers", pageNumbers);
      formData.append("customMode", mode);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/convert/rearrange-pages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTaskId(response.data.taskId);
      setDownloadUrl(`/api/download/${response.data.taskId}`);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError(err.response?.data?.message || "今日次数已用完，请明日再来");
      } else {
        setError(err.response?.data?.message || "页面排序失败，请检查文件后重试");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setPageOrder([]);
    setOriginalOrder([]);
    setPageThumbnails([]);
    setMode("CUSTOM");
    setDuplicateCount(2);
    setTaskId(null);
    setDownloadUrl(null);
    setError(null);
    setLoadingProgress(0);
  };

  const handleRestoreOriginal = () => {
    setPageOrder([...originalOrder]);
    setMode("CUSTOM");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            PDF 页面排序
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            免费在线调整 PDF 页面顺序，支持拖拽排序和多种自动排列模式
          </p>

          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            {!taskId && !downloadUrl && (
              <>
                {!file ? (
                  <div
                    {...getRootProps()}
                    className={clsx(
                      "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all relative min-h-[200px] flex flex-col items-center justify-center",
                      isDragActive
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:border-primary-400 hover:bg-gray-50",
                      isProcessing && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <input {...getInputProps()} disabled={isProcessing} />
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
                      <p className="text-lg text-primary-600 font-medium">释放文件以上传</p>
                    ) : (
                      <>
                        <p className="text-lg text-gray-700 font-medium mb-2">
                          拖拽 PDF 文件到此处，或点击选择文件
                        </p>
                        <p className="text-sm text-gray-500">最大文件大小：20MB</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 文件信息 */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9v6h2v-4h1a2 2 0 000-4h-3zm2 2v-1h1v1h-1z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB · {pageCount} 页
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* 模式选择 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        排列模式
                      </label>
                      <select
                        value={mode}
                        onChange={(e) => handleModeChange(e.target.value as RearrangeMode)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {modeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} - {option.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 复制倍数输入 */}
                    {mode === "DUPLICATE" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          复制倍数
                        </label>
                        <input
                          type="number"
                          min={2}
                          max={10}
                          value={duplicateCount}
                          onChange={(e) => setDuplicateCount(parseInt(e.target.value) || 2)}
                          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">每页将被复制 {duplicateCount} 次</p>
                      </div>
                    )}

                    {/* 页面预览和拖拽区域 */}
                    {loadingProgress < 100 ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">正在加载页面... {loadingProgress}%</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              页面预览
                            </h3>
                            {mode === "CUSTOM" && (
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                                拖拽卡片调整顺序
                              </span>
                            )}
                          </div>
                          <button
                            onClick={handleRestoreOriginal}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            恢复原始顺序
                          </button>
                        </div>

                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={pageOrder.map((p) => p.toString())}
                            strategy={rectSortingStrategy}
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 max-h-[700px] overflow-y-auto p-6 bg-gray-50 rounded-xl border border-gray-200">
                              {pageOrder.map((pageNum, index) => (
                                <SortableThumbnail
                                  key={pageNum.toString()}
                                  id={pageNum.toString()}
                                  pageNum={pageNum}
                                  canvas={pageThumbnails[pageNum - 1]}
                                  index={index}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>

                        {/* 操作按钮 */}
                        <div className="flex gap-4">
                          <button
                            onClick={handleRearrange}
                            disabled={isProcessing}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? "正在处理..." : "生成新 PDF"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {downloadUrl && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">排序完成！</h3>
                  <p className="text-gray-600 mb-4">您的 PDF 文件已成功重新排列</p>

                  <a
                    href={downloadUrl}
                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    下载新文件
                  </a>
                </div>

                <button
                  onClick={handleReset}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  排序另一个文件
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
