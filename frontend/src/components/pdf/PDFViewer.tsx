"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
import clsx from "clsx";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// ============ 类型定义 ============
export type PDFSource = 
  | { type: "file"; file: File }
  | { type: "url"; url: string }
  | { type: "base64"; data: string };

export interface PDFViewerProps {
  /** PDF 源（文件/URL/Base64） */
  source: PDFSource;
  /** 默认缩放比例（1 = 100%） */
  defaultScale?: number;
  /** 初始页码（从 1 开始） */
  initialPage?: number;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否显示页面导航 */
  showNavigation?: boolean;
  /** 是否显示缩放控制 */
  showZoom?: boolean;
  /** 是否显示下载按钮 */
  showDownload?: boolean;
  /** 是否显示打印按钮 */
  showPrint?: boolean;
  /** 是否显示全屏按钮 */
  showFullscreen?: boolean;
  /** 是否自动适应宽度 */
  autoFitWidth?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 加载成功回调 */
  onLoadSuccess?: (pageCount: number) => void;
  /** 加载失败回调 */
  onLoadError?: (error: Error) => void;
  /** 页面变化回调 */
  onPageChange?: (page: number) => void;
  /** 缩放变化回调 */
  onScaleChange?: (scale: number) => void;
}

interface RenderedPage {
  pageNum: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

// ============ 工具函数 ============
const readAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

// ============ PDF 预览组件 ============
export default function PDFViewer({
  source,
  defaultScale = 1,
  initialPage = 1,
  showToolbar = true,
  showNavigation = true,
  showZoom = true,
  showDownload = true,
  showPrint = true,
  showFullscreen = true,
  autoFitWidth = false,
  className,
  onLoadSuccess,
  onLoadError,
  onPageChange,
  onScaleChange,
}: PDFViewerProps) {
  // 状态管理
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [scale, setScale] = useState(defaultScale);
  const [rotation, setRotation] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderedPages, setRenderedPages] = useState<Map<number, RenderedPage>>(new Map());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 加载 PDF
  const loadPDF = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: string | ArrayBuffer;
      
      if (source.type === "file") {
        data = await source.file.arrayBuffer();
      } else if (source.type === "url") {
        const response = await fetch(source.url);
        data = await response.arrayBuffer();
      } else {
        // base64
        const base64Data = source.data.split(",")[1] || source.data;
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        data = bytes.buffer;
      }
      
      const loadingTask = pdfjs.getDocument(data);
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setPageCount(pdf.numPages);
      setCurrentPage(Math.min(initialPage, pdf.numPages));
      onLoadSuccess?.(pdf.numPages);
    } catch (err: any) {
      const errorMsg = err.message || "PDF 加载失败";
      setError(errorMsg);
      onLoadError?.(err as Error);
    } finally {
      setLoading(false);
    }
  }, [source, initialPage, onLoadSuccess, onLoadError]);

  useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  // 渲染页面
  const renderPage = useCallback(async (pageNum: number, renderScale: number, rotate: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: renderScale, rotation: rotate });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
      
      // 缓存渲染结果
      setRenderedPages(prev => {
        const newMap = new Map(prev);
        newMap.set(pageNum, {
          pageNum,
          canvas: canvas.cloneNode() as HTMLCanvasElement,
          width: viewport.width,
          height: viewport.height,
        });
        return newMap;
      });
    } catch (err: any) {
      console.error("页面渲染失败:", err);
    }
  }, [pdfDoc]);

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(currentPage, scale, rotation);
    }
  }, [pdfDoc, currentPage, scale, rotation, renderPage]);

  // 适应宽度
  useEffect(() => {
    if (autoFitWidth && pdfDoc && containerRef.current) {
      const page = pdfDoc.getPage(currentPage).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = containerRef.current!.clientWidth - 32; // 减去 padding
        const newScale = containerWidth / viewport.width;
        setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale)));
      });
    }
  }, [autoFitWidth, pdfDoc, currentPage]);

  // 工具栏操作
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
      onPageChange?.(page);
    }
  };

  const zoomIn = () => {
    const newScale = Math.min(MAX_SCALE, scale + SCALE_STEP);
    setScale(newScale);
    onScaleChange?.(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(MIN_SCALE, scale - SCALE_STEP);
    setScale(newScale);
    onScaleChange?.(newScale);
  };

  const resetZoom = () => {
    setScale(1);
    onScaleChange?.(1);
  };

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("全屏切换失败:", err);
    }
  };

  const download = async () => {
    if (source.type === "file") {
      const url = URL.createObjectURL(source.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = source.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (source.type === "url") {
      const a = document.createElement("a");
      a.href = source.url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // base64
      const linkSource = source.data;
      const a = document.createElement("a");
      a.href = linkSource;
      a.download = "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const print = () => {
    window.print();
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPage(currentPage - 1);
      } else if (e.key === "ArrowRight") {
        goToPage(currentPage + 1);
      } else if (e.key === "+" || e.key === "=") {
        zoomIn();
      } else if (e.key === "-") {
        zoomOut();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, scale]);

  // 渲染加载状态
  if (loading) {
    return (
      <div className={clsx("flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载 PDF...</p>
        </div>
      </div>
    );
  }

  // 渲染错误状态
  if (error || !pdfDoc) {
    return (
      <div className={clsx("flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg", className)}>
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-medium mb-2">PDF 加载失败</p>
          <p className="text-gray-500 text-sm">{error || "未知错误"}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={clsx("bg-white rounded-lg shadow-lg overflow-hidden", className, isFullscreen && "fixed inset-0 z-50")}
    >
      {/* 工具栏 */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          {/* 左侧：导航和缩放 */}
          <div className="flex items-center gap-2">
            {/* 页面导航 */}
            {showNavigation && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="第一页"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="上一页"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded">
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={currentPage}
                    onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                    className="w-12 text-center text-sm border-none focus:ring-0"
                  />
                  <span className="text-sm text-gray-600">/ {pageCount}</span>
                </div>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pageCount}
                  className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="下一页"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => goToPage(pageCount)}
                  disabled={currentPage === pageCount}
                  className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="最后一页"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* 缩放控制 */}
            {showZoom && (
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={zoomOut}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="缩小"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <button
                  onClick={resetZoom}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  {Math.round(scale * 100)}%
                </button>
                
                <button
                  onClick={zoomIn}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="放大"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* 右侧：旋转、全屏、下载、打印 */}
          <div className="flex items-center gap-1">
            <button
              onClick={rotateCounterClockwise}
              className="p-2 hover:bg-gray-200 rounded"
              title="逆时针旋转"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={rotateClockwise}
              className="p-2 hover:bg-gray-200 rounded"
              title="顺时针旋转"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {showFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-200 rounded"
                title={isFullscreen ? "退出全屏" : "全屏"}
              >
                {isFullscreen ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            )}
            
            {showDownload && (
              <button
                onClick={download}
                className="p-2 hover:bg-gray-200 rounded"
                title="下载"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            
            {showPrint && (
              <button
                onClick={print}
                className="p-2 hover:bg-gray-200 rounded"
                title="打印"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PDF 内容区域 */}
      <div className="p-4 overflow-auto bg-gray-100" style={{ maxHeight: "calc(100vh - 200px)" }}>
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="shadow-lg"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 0.3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
