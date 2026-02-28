"use client";

import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";
import { getPDFPageCount } from "@/lib/pdf-utils";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const faqItems = [
  {
    question: "拆分 PDF 后原文件会改变吗？",
    answer: "不会。拆分 PDF 操作会生成新的独立 PDF 文件，原文件保持不变。您可以放心使用。",
  },
  {
    question: "拆分后的文件格式是什么？",
    answer: "拆分后的文件可能是多个独立的 PDF 文件，或者是一个 ZIP 压缩包（包含所有拆分后的 PDF 文件）。",
  },
  {
    question: "支持批量拆分吗？",
    answer: "支持。您可以选择多个页面进行拆分，每个选中的页面都会生成一个独立的 PDF 文件。",
  },
  {
    question: "文件安全吗？",
    answer: "非常安全。所有文件处理都在服务器端完成，文件会在 30 分钟后自动删除，不会泄露任何隐私。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传 PDF 文件",
    description: "拖拽或点击上传需要处理的 PDF 文件",
  },
  {
    step: 2,
    title: "设置拆分范围",
    description: "选择自定义或固定模式，设置拆分范围",
  },
  {
    step: 3,
    title: "下载拆分文件",
    description: "点击拆分按钮，下载生成的独立 PDF 文件",
  },
];

interface Range {
  id: string;
  start: number;
  end: number;
}

interface PreviewPDF {
  rangeId: string;
  rangeIndex: number;
  pages: number[];
  canvasRefs: HTMLCanvasElement[];
  aspectRatio: number; // PDF宽高比
}

export default function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState<Range[]>([{ id: 'range-1', start: 1, end: 1 }]);
  const [mode, setMode] = useState<'custom' | 'fixed'>('custom');
  const [mergeAll, setMergeAll] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageThumbnails, setPageThumbnails] = useState<HTMLCanvasElement[]>([]);
  const [previewPDFs, setPreviewPDFs] = useState<PreviewPDF[]>([]);
  const [customRanges, setCustomRanges] = useState<Range[]>([{ id: 'range-1', start: 1, end: 1 }]);
  const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);
  const rangeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 使用 useEffect 处理模式切换时的预览更新
  useEffect(() => {
    if (mode === 'fixed' && pageCount > 0) {
      const fixedRanges: Range[] = [];
      for (let i = 1; i <= pageCount; i++) {
        fixedRanges.push({
          id: `fixed-${i}`,
          start: i,
          end: i,
        });
      }
      setRanges(fixedRanges);
      updatePreviewPDFs(pageThumbnails, fixedRanges);
    } else if (mode === 'custom') {
      setRanges(customRanges);
      updatePreviewPDFs(pageThumbnails, customRanges);
    }
  }, [mode, pageCount]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setError(null);
        setTaskId(null);
        setDownloadUrl(null);
        setRanges([{ id: 'range-1', start: 1, end: 1 }]);
        setMergeAll(false);
        setSelectedRangeId(null);
        
        try {
          const pages = await getPDFPageCount(selectedFile);
          setPageCount(pages);
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
      const scale = 0.2;
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const context = canvas.getContext('2d');
      if (context) {
        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      }
      
      canvases.push(canvas);
    }
    
    setPageThumbnails(canvases);
    updatePreviewPDFs(canvases, ranges);
  };

  const updatePreviewPDFs = (canvases: HTMLCanvasElement[], currentRanges: Range[]) => {
    // 计算PDF的宽高比（使用第一页作为参考）
    const aspectRatio = canvases.length > 0 ? canvases[0].width / canvases[0].height : 1;
    
    const previews: PreviewPDF[] = currentRanges.map((range, index) => {
      const pages: number[] = [];
      const rangeCanvases: HTMLCanvasElement[] = [];
      
      for (let i = range.start; i <= range.end; i++) {
        if (i >= 1 && i <= canvases.length) {
          pages.push(i);
          rangeCanvases.push(canvases[i - 1]);
        }
      }
      
      return {
        rangeId: range.id,
        rangeIndex: index,
        pages,
        canvasRefs: rangeCanvases,
        aspectRatio,
      };
    });
    
    setPreviewPDFs(previews);
  };

  const addRange = () => {
    const lastRange = ranges[ranges.length - 1];
    const newStart = lastRange ? lastRange.end + 1 : 1;
    const newRange: Range = {
      id: `range-${Date.now()}`,
      start: Math.min(newStart, pageCount),
      end: Math.min(newStart, pageCount),
    };
    const updatedRanges = [...ranges, newRange];
    setRanges(updatedRanges);
    updatePreviewPDFs(pageThumbnails, updatedRanges);
    
    // 自动选中新添加的范围
    setTimeout(() => {
      setSelectedRangeId(newRange.id);
      scrollToRange(newRange.id);
    }, 100);
  };

  const removeRange = (id: string) => {
    if (ranges.length === 1) return;
    const updatedRanges = ranges.filter((r) => r.id !== id);
    setRanges(updatedRanges);
    updatePreviewPDFs(pageThumbnails, updatedRanges);
    if (selectedRangeId === id) {
      setSelectedRangeId(null);
    }
  };

  const updateRange = (id: string, field: 'start' | 'end', value: number) => {
    const updatedRanges = ranges.map((r) => {
      if (r.id === id) {
        const updated = { ...r, [field]: Math.max(1, Math.min(value, pageCount)) };
        if (field === 'start' && updated.start > updated.end) {
          updated.end = updated.start;
        }
        if (field === 'end' && updated.end < updated.start) {
          updated.start = updated.end;
        }
        return updated;
      }
      return r;
    });
    setRanges(updatedRanges);
    updatePreviewPDFs(pageThumbnails, updatedRanges);
  };

  const getPageRanges = (): Range[] => {
    if (mode === 'fixed') {
      const fixedRanges: Range[] = [];
      for (let i = 1; i <= pageCount; i++) {
        fixedRanges.push({
          id: `fixed-${i}`,
          start: i,
          end: i,
        });
      }
      return fixedRanges;
    }
    return ranges;
  };

  const generatePageNumbers = (): string => {
    const rangesToUse = getPageRanges();
    const parts = rangesToUse.map((range) => {
      if (range.start === range.end) {
        return `${range.start}`;
      }
      return `${range.start}-${range.end}`;
    });
    return parts.join(",");
  };

  const handleSplit = async () => {
    if (!file) {
      setError("请先上传 PDF 文件");
      return;
    }

    const pageNumbers = generatePageNumbers();
    if (!pageNumbers) {
      setError("请设置拆分范围");
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
      formData.append("mergeAll", String(mergeAll));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/convert/split-pages`,
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
        setError(err.response?.data?.message || "今日拆分次数已用完，请明日再来");
      } else {
        setError(
          err.response?.data?.message || "拆分页面失败，请检查文件后重试"
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setRanges([{ id: 'range-1', start: 1, end: 1 }]);
    setMode('custom');
    setMergeAll(false);
    setTaskId(null);
    setDownloadUrl(null);
    setError(null);
    setPageThumbnails([]);
    setPreviewPDFs([]);
    setSelectedRangeId(null);
  };

  // 点击左侧预览框时选中右侧对应的范围
  const handlePreviewClick = (rangeId: string) => {
    setSelectedRangeId(rangeId);
    scrollToRange(rangeId);
  };

  // 滚动到对应的范围输入框
  const scrollToRange = (rangeId: string) => {
    const element = rangeRefs.current.get(rangeId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 添加高亮动画效果
      element.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2');
      }, 1500);
    }
  };

  const currentRanges = getPageRanges();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            PDF 页面拆分
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            免费在线拆分 PDF 页面，将指定页面生成为独立的 PDF 文件
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
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* 左侧：预览区域 - 占据更多空间 */}
                    <div className="lg:col-span-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">预览</h3>
                          <button
                            onClick={handleReset}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            重新上传
                          </button>
                        </div>
                        
                        {/* 动态预览区域：根据范围数量展示对应的 PDF 预览 */}
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto">
                            {previewPDFs.map((preview) => {
                              const pageCount = preview.pages.length;
                              
                              // 判断布局方式：1-2页横向排列，3页及以上使用省略模式
                              const isHorizontalLayout = pageCount <= 2;
                              const shouldShowEllipsis = pageCount >= 3;
                              const isSelected = selectedRangeId === preview.rangeId;
                              
                              // 构建显示的页面列表
                              let displayItems: (HTMLCanvasElement | null)[] = [];
                              let displayPageNumbers: (number | null)[] = [];
                              
                              if (isHorizontalLayout) {
                                // 1-2页：全部显示，横向排列
                                displayItems = preview.canvasRefs;
                                displayPageNumbers = preview.pages;
                              } else {
                                // 3页及以上：只显示首尾页，中间用...省略
                                displayItems = [
                                  preview.canvasRefs[0], 
                                  null, 
                                  preview.canvasRefs[preview.canvasRefs.length - 1]
                                ];
                                displayPageNumbers = [
                                  preview.pages[0], 
                                  null, 
                                  preview.pages[preview.pages.length - 1]
                                ];
                              }
                              
                              // 根据PDF宽高比计算容器高度
                              const containerHeight = isHorizontalLayout ? 'auto' : '200px';
                              
                              return (
                                <div
                                  key={preview.rangeId}
                                  onClick={() => handlePreviewClick(preview.rangeId)}
                                  className={clsx(
                                    "border-2 rounded-lg p-4 bg-white cursor-pointer transition-all duration-200 hover:shadow-md",
                                    isSelected 
                                      ? "border-primary-500 ring-2 ring-primary-200" 
                                      : "border-blue-400 hover:border-primary-400"
                                  )}
                                >
                                  <div className="mb-3">
                                    <span className="text-sm font-semibold text-gray-700">
                                      范围 {preview.rangeIndex + 1}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                      (第 {preview.pages[0]}-{preview.pages[preview.pages.length - 1]} 页，共 {preview.pages.length} 页)
                                    </span>
                                  </div>
                                  
                                  {/* 页面预览区域 - 根据PDF比例动态调整 */}
                                  <div 
                                    className={clsx(
                                      "flex items-center justify-center",
                                      isHorizontalLayout ? 'flex-row gap-3' : 'flex-row gap-4'
                                    )}
                                    style={{ minHeight: containerHeight }}
                                  >
                                    {displayItems.map((canvas, idx) => (
                                      canvas ? (
                                        <div 
                                          key={idx} 
                                          className={clsx(
                                            "border border-gray-200 rounded overflow-hidden flex-shrink-0",
                                            isHorizontalLayout ? 'flex-1' : ''
                                          )}
                                          style={{
                                            width: isHorizontalLayout ? '48%' : '40%',
                                            aspectRatio: `${preview.aspectRatio}`,
                                            maxHeight: '250px'
                                          }}
                                        >
                                          <canvas
                                            ref={(el) => {
                                              if (el && canvas) {
                                                const ctx = el.getContext('2d');
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
                                      ) : (
                                        <div 
                                          key={`ellipsis-${idx}`} 
                                          className="flex-shrink-0 flex items-center justify-center"
                                        >
                                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                            <span className="text-gray-400 text-xl font-bold">...</span>
                                          </div>
                                        </div>
                                      )
                                    ))}
                                  </div>
                                  
                                  {/* 页面标签 */}
                                  <div className={clsx(
                                    "flex mt-2 text-xs text-gray-500",
                                    isHorizontalLayout ? 'justify-around' : 'justify-center gap-16'
                                  )}>
                                    {displayPageNumbers.map((pageNum, idx) => (
                                      pageNum !== null && (
                                        <span key={idx} className="text-center w-16">
                                          第 {pageNum} 页
                                        </span>
                                      )
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        
                        {previewPDFs.length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>暂无预览</p>
                            <p className="text-sm mt-2">请在右侧设置拆分范围</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 右侧：设置面板 - 占据更少空间 */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* 范围模式选择 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          范围模式
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setMode('custom')}
                            className={clsx(
                              "flex-1 px-4 py-2 rounded-lg font-medium transition-colors border-2",
                              mode === 'custom'
                                ? "border-red-500 bg-red-50 text-red-600"
                                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                            )}
                          >
                            自定义
                          </button>
                          <button
                            onClick={() => setMode('fixed')}
                            className={clsx(
                              "flex-1 px-4 py-2 rounded-lg font-medium transition-colors border-2",
                              mode === 'fixed'
                                ? "border-red-500 bg-red-50 text-red-600"
                                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                            )}
                          >
                            固定
                          </button>
                        </div>
                      </div>

                      {/* 范围设置 */}
                      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                        {currentRanges.map((range, index) => (
                          <div
                            key={range.id}
                            ref={(el) => {
                              if (el) rangeRefs.current.set(range.id, el);
                            }}
                            className={clsx(
                              "p-3 rounded-lg border-2 transition-all duration-200",
                              selectedRangeId === range.id
                                ? "border-primary-500 bg-primary-50 ring-2 ring-primary-200"
                                : index === currentRanges.length - 1
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-200 bg-gray-50"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                              </svg>
                              <span className="text-sm font-medium text-gray-700">
                                范围 {index + 1}
                              </span>
                              {mode === 'custom' && ranges.length > 1 && (
                                <button
                                  onClick={() => removeRange(range.id)}
                                  className="ml-auto text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-600 whitespace-nowrap">从页面</label>
                              <input
                                type="number"
                                min={1}
                                max={pageCount}
                                value={range.start}
                                onChange={(e) => updateRange(range.id, 'start', parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                disabled={mode === 'fixed'}
                              />
                              <label className="text-xs text-gray-600 whitespace-nowrap">至</label>
                              <input
                                type="number"
                                min={1}
                                max={pageCount}
                                value={range.end}
                                onChange={(e) => updateRange(range.id, 'end', parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                disabled={mode === 'fixed'}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 添加范围按钮 */}
                      {mode === 'custom' && (
                        <button
                          onClick={addRange}
                          className="flex items-center justify-center gap-2 w-full py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-medium transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          添加范围
                        </button>
                      )}

                      {/* 合并选项 */}
                      <div className="flex items-center gap-2 pt-4 border-t">
                        <input
                          type="checkbox"
                          id="mergeAll"
                          checked={mergeAll}
                          onChange={(e) => setMergeAll(e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="mergeAll" className="text-sm text-gray-700">
                          合并所有范围到一个 PDF 文件
                        </label>
                      </div>

                      {/* 拆分按钮 */}
                      <button
                        onClick={handleSplit}
                        disabled={isProcessing}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span>拆分 PDF</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </button>
                    </div>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">拆分完成！</h3>
                  <p className="text-gray-600 mb-4">您的 PDF 文件已成功拆分</p>
                  
                  <a
                    href={downloadUrl}
                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    下载拆分文件
                  </a>
                </div>

                <button
                  onClick={handleReset}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  拆分另一个文件
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

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            如何拆分 PDF 页面
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
