"use client";

import { useState, useCallback } from "react";
import FileUploader from "@/components/upload/FileUploader";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";
import { getPDFPageCount } from "@/lib/pdf-utils";
import * as pdfjs from "pdfjs-dist";
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

const steps = [
  { step: 1, title: "上传 PDF 文件", description: "拖拽或点击上传需要处理的 PDF 文件", icon: "📤" },
  { step: 2, title: "调整页面顺序", description: "拖拽调整页面顺序或选择预设模式", icon: "🔀" },
  { step: 3, title: "下载新文件", description: "点击生成按钮，下载重新排序的 PDF", icon: "📥" },
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

const modeOptions: { value: RearrangeMode; label: string }[] = [
  { value: "CUSTOM", label: "自定义排序" },
  { value: "REVERSE_ORDER", label: "全部倒序" },
  { value: "DUPLICATE", label: "复制页面" },
  { value: "DUPLEX_SORT", label: "双面扫描排序" },
  { value: "BOOKLET_SORT", label: "小册子排序" },
  { value: "ODD_EVEN_SPLIT", label: "奇偶页分离" },
  { value: "ODD_EVEN_MERGE", label: "奇偶页合并" },
  { value: "REMOVE_FIRST", label: "删除第一页" },
  { value: "REMOVE_LAST", label: "删除最后一页" },
  { value: "REMOVE_FIRST_AND_LAST", label: "删除首尾页" },
];

interface SortableThumbnailProps {
  id: string;
  pageNum: number;
  canvas: HTMLCanvasElement;
  index: number;
}

function SortableThumbnail({ id, pageNum, canvas, index }: SortableThumbnailProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative border-2 rounded-xl p-3 group select-none touch-none ${isDragging ? "border-primary-500 shadow-2xl scale-105 rotate-2 bg-primary/20" : "border-primary/20 hover:border-primary/50 hover:bg-white/5"}`}>
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-20"
        aria-label={`拖拽第 ${pageNum} 页`}
      />
      <div className={`absolute -top-2 -left-2 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10 transition-colors ${isDragging ? "bg-primary-600" : "bg-primary-500 group-hover:bg-primary-600"}`}>
        {index + 1}
      </div>
      <div className="flex items-center justify-center bg-white/5 rounded-lg overflow-hidden" style={{ aspectRatio: canvas ? canvas.width / canvas.height : 0.707 }}>
        <canvas ref={(el) => { if (el && canvas) { const ctx = el.getContext("2d"); if (ctx) { el.width = canvas.width; el.height = canvas.height; ctx.drawImage(canvas, 0, 0); } } }} className="w-full h-full object-contain" />
      </div>
      <div className="text-center mt-3">
        <span className="inline-block px-3 py-1 bg-primary/20 rounded-full text-sm text-primary-300 font-medium">第 {pageNum} 页</span>
      </div>
      {isDragging && <div className="absolute inset-0 bg-primary-500/10 rounded-xl pointer-events-none" />}
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
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setDownloadUrl(null);
    setLoadingProgress(0);

    try {
      const pages = await getPDFPageCount(selectedFile);
      setPageCount(pages);
      const initialOrder = Array.from({ length: pages }, (_, i) => i + 1);
      setPageOrder(initialOrder);
      setOriginalOrder(initialOrder);
      await renderThumbnails(selectedFile, pages);
    } catch (err: unknown) {
      setError("无法读取 PDF 文件，请检查文件是否损坏");
      setPageCount(0);
    }
  };

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
      if (context) await page.render({ canvasContext: context, viewport }).promise;
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
      case "REVERSE_ORDER": setPageOrder([...originalOrder].reverse()); break;
      case "ODD_EVEN_SPLIT": {
        const odd = originalOrder.filter((n) => n % 2 === 1);
        const even = originalOrder.filter((n) => n % 2 === 0);
        setPageOrder([...odd, ...even]);
      } break;
      case "ODD_EVEN_MERGE": {
        const odd2 = originalOrder.filter((n) => n % 2 === 1);
        const even2 = originalOrder.filter((n) => n % 2 === 0);
        const merged: number[] = [];
        const maxLen = Math.max(odd2.length, even2.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < odd2.length) merged.push(odd2[i]);
          if (i < even2.length) merged.push(even2[i]);
        }
        setPageOrder(merged);
      } break;
      case "REMOVE_FIRST": setPageOrder(originalOrder.slice(1)); break;
      case "REMOVE_LAST": setPageOrder(originalOrder.slice(0, -1)); break;
      case "REMOVE_FIRST_AND_LAST": setPageOrder(originalOrder.slice(1, -1)); break;
      default: setPageOrder([...originalOrder]);
    }
  };

  const generatePageNumbers = (): string => {
    if (mode === "DUPLICATE") return duplicateCount.toString();
    return pageOrder.join(",");
  };

  const handleRearrange = async () => {
    if (!file) { setError("请先上传 PDF 文件"); return; }
    const pageNumbers = generatePageNumbers();
    if (!pageNumbers) { setError("请设置页面顺序"); return; }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageNumbers", pageNumbers);
      formData.append("customMode", mode);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/convert/rearrange-pages`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setDownloadUrl(`/api/download/${response.data.taskId}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setError(err.response?.data?.message || "今日次数已用完，请明日再来");
      } else if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "页面排序失败，请检查文件后重试");
      } else {
        setError("页面排序失败，请检查文件后重试");
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
    setDownloadUrl(null);
    setError(null);
    setLoadingProgress(0);
  };

  const handleRestoreOriginal = () => {
    setPageOrder([...originalOrder]);
    setMode("CUSTOM");
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="relative container mx-auto px-4 py-16">
          <nav className="flex items-center space-x-2 text-sm text-foreground-muted mb-8">
            <a href="/" className="hover:text-primary-400 transition-colors">首页</a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-white font-medium">PDF 页面排序</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">🔀</span><span className="text-primary-300">PDF 工具</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">PDF 页面排序在线工具</h1>
              <p className="text-lg text-foreground-muted">免费在线调整 PDF 页面顺序，支持拖拽排序和多种自动排列模式</p>
            </div>

            <div className="card-dark rounded-3xl overflow-hidden border border-primary/20">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🔀</div>
                  <div>
                    <h2 className="text-white font-bold text-lg">开始排序</h2>
                    <p className="text-primary-200 text-sm">拖拽调整页面顺序</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!downloadUrl ? (
                  <>
                    {!file ? (
                      <FileUploader accept={{ "application/pdf": [".pdf"] }} maxSize={20 * 1024 * 1024} onFileSelect={handleFileSelect} isUploading={isProcessing} />
                    ) : (
                      <div className="space-y-6">
                        <div className="p-4 bg-white/5 rounded-xl border border-primary/20 flex items-center space-x-3 animate-fade-in">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-foreground-muted">{(file.size / 1024 / 1024).toFixed(2)} MB · {pageCount} 页</p>
                          </div>
                          <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {loadingProgress < 100 ? (
                          <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary-500 mx-auto mb-4"></div>
                            <p className="text-primary-300">正在加载页面... {loadingProgress}%</p>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-white text-lg">排列模式</h3>
                                {mode === "CUSTOM" && <span className="text-sm text-foreground-muted bg-primary/20 px-3 py-1 rounded-full">拖拽调整</span>}
                              </div>
                              <button onClick={handleRestoreOriginal} className="text-sm text-primary-400 hover:text-primary-300 hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                恢复原始
                              </button>
                            </div>

                            <div className="mb-4">
                              <select value={mode} onChange={(e) => handleModeChange(e.target.value as RearrangeMode)} className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary">
                                {modeOptions.map((option) => (<option key={option.value} value={option.value} className="bg-gray-900">{option.label}</option>))}
                              </select>
                            </div>

                            {mode === "DUPLICATE" && (
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-white mb-2">复制倍数</label>
                                <input type="number" min={2} max={10} value={duplicateCount} onChange={(e) => setDuplicateCount(parseInt(e.target.value) || 2)} className="w-32 px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary" />
                                <p className="text-sm text-foreground-muted mt-1">每页将被复制 {duplicateCount} 次</p>
                              </div>
                            )}

                            {mode === "CUSTOM" && (
                              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={pageOrder.map((p) => p.toString())} strategy={rectSortingStrategy}>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-4 bg-white/5 rounded-xl border border-primary/20">
                                    {pageOrder.map((pageNum, index) => (<SortableThumbnail key={pageNum.toString()} id={pageNum.toString()} pageNum={pageNum} canvas={pageThumbnails[pageNum - 1]} index={index} />))}
                                  </div>
                                </SortableContext>
                              </DndContext>
                            )}

                            <button onClick={handleRearrange} disabled={isProcessing} className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6">
                              {isProcessing ? (<><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /><span>正在处理...</span></>) : (<><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg><span>生成新 PDF</span></>)}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="p-6 bg-accent-emerald/10 border border-accent-emerald/30 rounded-xl">
                      <svg className="w-16 h-16 text-accent-emerald mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xl font-bold text-white mb-2">排序完成！</h3>
                      <p className="text-foreground-muted mb-4">您的 PDF 文件已成功重新排列</p>
                      <a href={downloadUrl} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        下载新文件
                      </a>
                    </div>
                    <button onClick={handleReset} className="text-primary-400 hover:text-primary-300 font-medium">排序另一个文件</button>
                  </div>
                )}

                {error && (
                  <div className="error-container flex items-start space-x-3 animate-slide-down mt-6">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-400 font-medium">排序失败</p>
                      <p className="text-red-400/70 text-sm mt-1">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/20 rounded transition-colors">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[{ icon: "🔀", label: "拖拽排序", desc: "灵活调整" }, { icon: "⚡", label: "多种模式", desc: "智能排序" }, { icon: "🔒", label: "安全保障", desc: "30 分钟删除" }].map((feature, index) => (
                <div key={index} className="text-center p-4 card-dark rounded-xl border border-primary/10">
                  <div className="text-2xl mb-2">{feature.icon}</div><div className="font-medium text-white text-sm">{feature.label}</div><div className="text-xs text-foreground-muted">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold text-white mb-4">如何排序 PDF 页面</h2><p className="text-foreground-muted">简单三步，轻松完成</p></div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />
              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border border-primary/20 relative z-10">{item.icon}</div>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-glow">{item.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3><p className="text-foreground-muted text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
