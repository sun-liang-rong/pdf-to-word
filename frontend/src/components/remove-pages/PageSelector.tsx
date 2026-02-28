"use client";

import { useState } from "react";
import PDFThumbnail from "./PDFThumbnail";

interface PageSelectorProps {
  file: File;
  pageCount: number;
  selectedPages: number[];
  onSelectionChange: (pages: number[]) => void;
}

export default function PageSelector({
  file,
  pageCount,
  selectedPages,
  onSelectionChange,
}: PageSelectorProps) {
  const togglePage = (pageNum: number) => {
    if (selectedPages.includes(pageNum)) {
      onSelectionChange(selectedPages.filter((p) => p !== pageNum));
    } else {
      onSelectionChange([...selectedPages, pageNum].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    onSelectionChange(Array.from({ length: pageCount }, (_, i) => i + 1));
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  const invertSelection = () => {
    const allPages = Array.from({ length: pageCount }, (_, i) => i + 1);
    onSelectionChange(allPages.filter((p) => !selectedPages.includes(p)));
  };

  const selectOdd = () => {
    const oddPages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
      (p) => p % 2 === 1
    );
    onSelectionChange(oddPages);
  };

  const selectEven = () => {
    const evenPages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
      (p) => p % 2 === 0
    );
    onSelectionChange(evenPages);
  };

  return (
    <div className="space-y-4">
      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={selectAll}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          全选
        </button>
        <button
          onClick={deselectAll}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          取消全选
        </button>
        <button
          onClick={invertSelection}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          反选
        </button>
        <button
          onClick={selectOdd}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          选择奇数页
        </button>
        <button
          onClick={selectEven}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          选择偶数页
        </button>
      </div>

      {/* 选择统计 */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          已选择 <span className="font-semibold text-primary-600">{selectedPages.length}</span> 页
        </span>
        <span className="text-gray-500">共 {pageCount} 页</span>
      </div>

      {/* 页面缩略图网格 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
          <PDFThumbnail
            key={pageNum}
            file={file}
            pageNum={pageNum}
            isSelected={selectedPages.includes(pageNum)}
            onClick={() => togglePage(pageNum)}
          />
        ))}
      </div>

      {/* 提示信息 */}
      <p className="text-sm text-gray-500 flex items-center">
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
        点击页面缩略图选择要删除的页面，红色边框表示将被删除
      </p>
    </div>
  );
}
