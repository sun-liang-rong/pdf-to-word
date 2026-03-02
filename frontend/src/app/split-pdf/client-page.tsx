"use client";

import { useState, useEffect, useRef } from "react";
import FileUploader from "@/components/upload/FileUploader";
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
  { step: 1, title: "上传 PDF 文件", description: "拖拽或点击上传需要处理的 PDF 文件", icon: "📤" },
  { step: 2, title: "设置拆分范围", description: "选择自定义或固定模式，设置拆分范围", icon: "📑" },
  { step: 3, title: "下载拆分文件", description: "点击拆分按钮，下载生成的独立 PDF 文件", icon: "📥" },
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
  aspectRatio: number;
}

export default function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState<Range[]>([{ id: 'range-1', start: 1, end: 1 }]);
  const [mode, setMode] = useState<'custom' | 'fixed'>('custom');
  const [mergeAll, setMergeAll] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageThumbnails, setPageThumbnails] = useState<HTMLCanvasElement[]>([]);
  const [previewPDFs, setPreviewPDFs] = useState<PreviewPDF[]>([]);
  const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);
  const rangeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (mode === 'fixed' && pageCount > 0) {
      const fixedRanges: Range[] = [];
      for (let i = 1; i <= pageCount; i++) {
        fixedRanges.push({ id: `fixed-${i}`, start: i, end: i });
      }
      setRanges(fixedRanges);
      updatePreviewPDFs(pageThumbnails, fixedRanges);
    } else if (mode === 'custom') {
      setRanges([{ id: 'range-1', start: 1, end: 1 }]);
      updatePreviewPDFs(pageThumbnails, [{ id: 'range-1', start: 1, end: 1 }]);
    }
  }, [mode, pageCount]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setDownloadUrl(null);
    setRanges([{ id: 'range-1', start: 1, end: 1 }]);
    setMergeAll(false);
    setSelectedRangeId(null);
    
    try {
      const pages = await getPDFPageCount(selectedFile);
      setPageCount(pages);
      await renderThumbnails(selectedFile, pages);
    } catch {
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
      const scale = 0.2;
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const context = canvas.getContext('2d');
      if (context) {
        await page.render({ canvasContext: context, viewport }).promise;
      }
      canvases.push(canvas);
    }
    
    setPageThumbnails(canvases);
    updatePreviewPDFs(canvases, [{ id: 'range-1', start: 1, end: 1 }]);
  };

  const updatePreviewPDFs = (canvases: HTMLCanvasElement[], currentRanges: Range[]) => {
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
      
      return { rangeId: range.id, rangeIndex: index, pages, canvasRefs: rangeCanvases, aspectRatio };
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
    if (selectedRangeId === id) setSelectedRangeId(null);
  };

  const updateRange = (id: string, field: 'start' | 'end', value: number) => {
    const updatedRanges = ranges.map((r) => {
      if (r.id === id) {
        const updated = { ...r, [field]: Math.max(1, Math.min(value, pageCount)) };
        if (field === 'start' && updated.start > updated.end) updated.end = updated.start;
        if (field === 'end' && updated.end < updated.start) updated.start = updated.end;
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
        fixedRanges.push({ id: `fixed-${i}`, start: i, end: i });
      }
      return fixedRanges;
    }
    return ranges;
  };

  const generatePageNumbers = (): string => {
    const rangesToUse = getPageRanges();
    const parts = rangesToUse.map((range) => range.start === range.end ? `${range.start}` : `${range.start}-${range.end}`);
    return parts.join(",");
  };

  const handleSplit = async () => {
    if (!file) { setError("请先上传 PDF 文件"); return; }
    const pageNumbers = generatePageNumbers();
    if (!pageNumbers) { setError("请设置拆分范围"); return; }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageNumbers", pageNumbers);
      formData.append("mergeAll", String(mergeAll));
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/convert/split-pages`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setDownloadUrl(`/api/download/${response.data.taskId}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setError(err.response?.data?.message || "今日次数已用完");
      } else if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "拆分页面失败");
      } else {
        setError("拆分页面失败");
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
    setDownloadUrl(null);
    setError(null);
    setPageThumbnails([]);
    setPreviewPDFs([]);
    setSelectedRangeId(null);
  };

  const handlePreviewClick = (rangeId: string) => {
    setSelectedRangeId(rangeId);
    scrollToRange(rangeId);
  };

  const scrollToRange = (rangeId: string) => {
    const element = rangeRefs.current.get(rangeId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2');
      setTimeout(() => element.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2'), 1500);
    }
  };

  const currentRanges = getPageRanges();

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 tech-grid opacity-20" />
        
        <div className="relative container mx-auto px-4 py-16">
          <nav className="flex items-center space-x-2 text-sm text-foreground-muted mb-8">
            <a href="/" className="hover:text-primary-400 transition-colors">首页</a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-white font-medium">PDF 页面拆分</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">📂</span><span className="text-primary-300">PDF 工具</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">PDF 页面拆分在线工具</h1>
              <p className="text-lg text-foreground-muted">免费在线拆分 PDF 页面，将指定页面生成为独立的 PDF 文件</p>
            </div>

            <div className="card-dark rounded-3xl overflow-hidden border border-primary/20">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    📂
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">开始拆分</h2>
                    <p className="text-primary-200 text-sm">自定义拆分范围</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!downloadUrl ? (
                  <>
                    {!file ? (
                      <FileUploader
                        accept={{ "application/pdf": [".pdf"] }}
                        maxSize={20 * 1024 * 1024}
                        onFileSelect={handleFileSelect}
                        isUploading={isProcessing}
                      />
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

                        {pageThumbnails.length > 0 && (
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                            {previewPDFs.map((preview) => {
                              const pageCountInner = preview.pages.length;
                              const isHorizontalLayout = pageCountInner <= 2;
                              const isSelected = selectedRangeId === preview.rangeId;
                              let displayItems: (HTMLCanvasElement | null)[] = [];
                              if (isHorizontalLayout) { displayItems = preview.canvasRefs; }
                              else { displayItems = [preview.canvasRefs[0], null, preview.canvasRefs[preview.canvasRefs.length - 1]]; }
                              return (
                                <div key={preview.rangeId} onClick={() => handlePreviewClick(preview.rangeId)} className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${isSelected ? "border-primary-500 ring-2 ring-primary-500/50 bg-primary/10" : "border-primary/20 hover:border-primary/50 bg-white/5"}`}>
                                  <div className="mb-3"><span className="text-sm font-semibold text-white">范围 {preview.rangeIndex + 1}</span><span className="text-xs text-foreground-muted ml-2">(第 {preview.pages[0]}-{preview.pages[preview.pages.length - 1]} 页，共 {preview.pages.length} 页)</span></div>
                                  <div className={`flex items-center justify-center ${isHorizontalLayout ? 'flex-row gap-3' : 'flex-row gap-4'}`}>
                                    {displayItems.map((canvas, idx) => canvas ? (
                                      <div key={idx} className={`border border-primary/20 rounded overflow-hidden flex-shrink-0 ${isHorizontalLayout ? 'flex-1' : ''}`} style={{ width: isHorizontalLayout ? '48%' : '40%', aspectRatio: `${preview.aspectRatio}`, maxHeight: '150px' }}>
                                        <canvas ref={(el) => { if (el && canvas) { const ctx = el.getContext('2d'); if (ctx) { el.width = canvas.width; el.height = canvas.height; ctx.drawImage(canvas, 0, 0); } } }} className="w-full h-full object-contain" />
                                      </div>
                                    ) : (
                                      <div key={`ellipsis-${idx}`} className="flex-shrink-0 flex items-center justify-center"><div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-primary-400 text-lg font-bold">...</span></div></div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="space-y-4 pt-4 border-t border-primary/20">
                          <div><label className="block text-sm font-medium text-white mb-2">范围模式</label>
                            <div className="flex gap-2">
                              <button onClick={() => setMode('custom')} className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors border-2 ${mode === 'custom' ? "border-primary-500 bg-primary-500/20 text-primary-400" : "border-primary/20 bg-white/5 text-foreground-muted hover:border-primary/40"}`}>自定义</button>
                              <button onClick={() => setMode('fixed')} className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors border-2 ${mode === 'fixed' ? "border-primary-500 bg-primary-500/20 text-primary-400" : "border-primary/20 bg-white/5 text-foreground-muted hover:border-primary/40"}`}>固定</button>
                            </div>
                          </div>
                          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                            {currentRanges.map((range, index) => (
                              <div key={range.id} ref={(el) => { if (el) rangeRefs.current.set(range.id, el); }} className={`p-3 rounded-xl border-2 transition-all duration-200 ${selectedRangeId === range.id ? "border-primary-500 bg-primary/10 ring-2 ring-primary-500/50" : index === currentRanges.length - 1 ? "border-primary-500/50 bg-primary-500/10" : "border-primary/20 bg-white/5"}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                  <span className="text-sm font-medium text-white">范围 {index + 1}</span>
                                  {mode === 'custom' && ranges.length > 1 && <button onClick={() => removeRange(range.id)} className="ml-auto text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs text-foreground-muted whitespace-nowrap">从页面</label>
                                  <input type="number" min={1} max={pageCount} value={range.start} onChange={(e) => updateRange(range.id, 'start', parseInt(e.target.value) || 1)} className="w-16 px-2 py-1 bg-white/5 border border-primary/20 rounded text-center text-sm text-white focus:border-primary" disabled={mode === 'fixed'} />
                                  <label className="text-xs text-foreground-muted whitespace-nowrap">至</label>
                                  <input type="number" min={1} max={pageCount} value={range.end} onChange={(e) => updateRange(range.id, 'end', parseInt(e.target.value) || 1)} className="w-16 px-2 py-1 bg-white/5 border border-primary/20 rounded text-center text-sm text-white focus:border-primary" disabled={mode === 'fixed'} />
                                </div>
                              </div>
                            ))}
                          </div>
                          {mode === 'custom' && <button onClick={addRange} className="flex items-center justify-center gap-2 w-full py-2 border-2 border-primary-500/50 text-primary-400 rounded-lg hover:bg-primary-500/10 font-medium transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>添加范围</button>}
                          <div className="flex items-center gap-2 pt-4 border-t border-primary/20">
                            <input type="checkbox" id="mergeAll" checked={mergeAll} onChange={(e) => setMergeAll(e.target.checked)} className="w-4 h-4 rounded border-primary/30 bg-white/10 text-primary focus:ring-primary/50" />
                            <label htmlFor="mergeAll" className="text-sm text-foreground-muted">合并所有范围到一个 PDF 文件</label>
                          </div>
                          <button onClick={handleSplit} disabled={isProcessing} className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                            {isProcessing ? <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /><span>正在处理...</span></> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg><span>拆分 PDF</span></>}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="p-6 bg-accent-emerald/10 border border-accent-emerald/30 rounded-xl">
                      <svg className="w-16 h-16 text-accent-emerald mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xl font-bold text-white mb-2">拆分完成！</h3>
                      <p className="text-foreground-muted mb-4">您的 PDF 文件已成功拆分</p>
                      <a href={downloadUrl} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        下载拆分文件
                      </a>
                    </div>
                    <button onClick={handleReset} className="text-primary-400 hover:text-primary-300 font-medium">拆分另一个文件</button>
                  </div>
                )}

                {error && (
                  <div className="error-container flex items-start space-x-3 animate-slide-down mt-6">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-400 font-medium">拆分失败</p>
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
              {[{ icon: "📂", label: "灵活拆分", desc: "自定义范围" }, { icon: "⚡", label: "快速处理", desc: "即时预览" }, { icon: "🔒", label: "安全保障", desc: "30 分钟删除" }].map((feature, index) => (
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
          <div className="text-center mb-16"><h2 className="text-3xl font-bold text-white mb-4">如何拆分 PDF 页面</h2><p className="text-foreground-muted">简单三步，轻松完成</p></div>
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
