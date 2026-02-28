"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";

// 设置 PDF.js worker 使用本地文件
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

interface PDFThumbnailProps {
  file: File;
  pageNum: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function PDFThumbnail({
  file,
  pageNum,
  isSelected,
  onClick,
}: PDFThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const renderPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // 读取文件为 ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // 加载 PDF 文档
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        
        // 获取指定页面
        const page = await pdf.getPage(pageNum);
        
        // 设置缩放比例（缩略图使用较小的比例）
        const scale = 0.3;
        const viewport = page.getViewport({ scale });

        // 准备 canvas
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // 渲染页面
        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "渲染失败");
          setLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;
    };
  }, [file, pageNum]);

  return (
    <button
      onClick={onClick}
      className={`relative aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all overflow-hidden ${
        isSelected
          ? "border-red-500 bg-red-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-500 p-1 text-center">
          {error}
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain"
        style={{ display: loading || error ? "none" : "block" }}
      />

      <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
        {pageNum}
      </span>

      {isSelected && (
        <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
