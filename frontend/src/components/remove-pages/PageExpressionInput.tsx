"use client";

import { useState } from "react";

interface PageExpressionInputProps {
  pageCount: number;
  onExpressionChange: (pages: number[]) => void;
  onError: (error: string | null) => void;
}

export default function PageExpressionInput({
  pageCount,
  onExpressionChange,
  onError,
}: PageExpressionInputProps) {
  const [expression, setExpression] = useState("");

  const parseExpression = (expr: string): number[] | null => {
    const trimmed = expr.trim();
    if (!trimmed) return [];

    try {
      // 处理 "all"
      if (trimmed.toLowerCase() === "all") {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
      }

      // 处理函数表达式 (2n, 2n+1, 3n, 6n-5 等)
      const functionMatch = trimmed.match(/^(\d*)n([+-]\d+)?$/);
      if (functionMatch) {
        const multiplier = parseInt(functionMatch[1] || "1", 10);
        const offset = parseInt(functionMatch[2] || "0", 10);
        const pages: number[] = [];
        for (let n = 1; ; n++) {
          const page = multiplier * n + offset;
          if (page < 1) continue;
          if (page > pageCount) break;
          pages.push(page);
        }
        return pages;
      }

      // 处理普通表达式 (1,3,5 或 2-6 或 1,3-5,8)
      const pages: number[] = [];
      const parts = trimmed.split(",");

      for (const part of parts) {
        const trimmedPart = part.trim();
        const rangeMatch = trimmedPart.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
          const start = parseInt(rangeMatch[1], 10);
          const end = parseInt(rangeMatch[2], 10);
          if (start > end) {
            throw new Error(`范围错误: ${trimmedPart}，起始页不能大于结束页`);
          }
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= pageCount && !pages.includes(i)) {
              pages.push(i);
            }
          }
        } else {
          const pageNum = parseInt(trimmedPart, 10);
          if (isNaN(pageNum)) {
            throw new Error(`无效的页码: ${trimmedPart}`);
          }
          if (pageNum < 1 || pageNum > pageCount) {
            throw new Error(`页码 ${pageNum} 超出范围 (1-${pageCount})`);
          }
          if (!pages.includes(pageNum)) {
            pages.push(pageNum);
          }
        }
      }

      return pages.sort((a, b) => a - b);
    } catch (error: any) {
      throw error;
    }
  };

  const handleChange = (value: string) => {
    setExpression(value);

    if (!value.trim()) {
      onExpressionChange([]);
      onError(null);
      return;
    }

    try {
      const pages = parseExpression(value);
      if (pages) {
        onExpressionChange(pages);
        onError(null);
      }
    } catch (error: any) {
      onError(error.message);
    }
  };

  const insertExample = (example: string) => {
    setExpression(example);
    handleChange(example);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          页面表达式（可选）
        </label>
        <input
          type="text"
          value={expression}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="例如: 1,3,5 或 2-6 或 2n+1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">快速输入:</span>
        <button
          onClick={() => insertExample("1,3,5")}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          1,3,5
        </button>
        <button
          onClick={() => insertExample("2-6")}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          2-6
        </button>
        <button
          onClick={() => insertExample("2n")}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          2n (偶数页)
        </button>
        <button
          onClick={() => insertExample("2n+1")}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          2n+1 (奇数页)
        </button>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>支持的格式:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>单页: 1,3,5</li>
          <li>范围: 2-6</li>
          <li>组合: 1,3-5,8</li>
          <li>函数: 2n (偶数页), 2n+1 (奇数页), 3n, 6n-5</li>
        </ul>
      </div>
    </div>
  );
}
