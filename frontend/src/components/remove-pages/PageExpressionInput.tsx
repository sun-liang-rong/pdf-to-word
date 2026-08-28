"use client";

import { useState } from "react";

interface PageExpressionInputProps {
  pageCount: number;
  onExpressionChange: (expression: string, pages: number[]) => void;
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
    if (trimmed.toLowerCase() === "all") {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const functionMatch = trimmed.match(/^(\d*)n([+-]\d+)?$/);
    if (functionMatch) {
      const multiplier = parseInt(functionMatch[1] || "1", 10);
      const offset = parseInt(functionMatch[2] || "0", 10);
      const pages: number[] = [];
      for (let n = 1; ; n += 1) {
        const page = multiplier * n + offset;
        if (page < 1) continue;
        if (page > pageCount) break;
        pages.push(page);
      }
      return pages;
    }

    const pages: number[] = [];
    for (const part of trimmed.split(",")) {
      const value = part.trim();
      const rangeMatch = value.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const end = parseInt(rangeMatch[2], 10);
        if (start > end) throw new Error(`范围错误: ${value}，起始页不能大于结束页`);
        for (let page = start; page <= end; page += 1) {
          if (page < 1 || page > pageCount) throw new Error(`页码 ${page} 超出范围 (1-${pageCount})`);
          if (!pages.includes(page)) pages.push(page);
        }
        continue;
      }
      if (!/^\d+$/.test(value)) throw new Error(`无效的页码: ${value}`);
      const page = parseInt(value, 10);
      if (page < 1 || page > pageCount) throw new Error(`页码 ${page} 超出范围 (1-${pageCount})`);
      if (!pages.includes(page)) pages.push(page);
    }
    return pages.sort((a, b) => a - b);
  };

  const handleChange = (value: string) => {
    setExpression(value);
    try {
      const pages = parseExpression(value);
      onExpressionChange(value.trim(), pages || []);
      onError(null);
    } catch (error) {
      onExpressionChange(value.trim(), []);
      onError(error instanceof Error ? error.message : "页码表达式无效");
    }
  };

  const insertExample = (example: string) => handleChange(example);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="page-expression" className="mb-2 block text-sm font-semibold text-theme">页面表达式</label>
        <input id="page-expression" type="text" value={expression} onChange={(e) => handleChange(e.target.value)} placeholder="例如：1,3,5 或 2-6 或 all" className="w-full rounded-xl border border-theme bg-theme-secondary px-4 py-3 text-theme outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-theme-muted">快速输入：</span>
        {["1,3,5", "2-6", "2n", "2n+1", "all"].map((example) => <button key={example} type="button" onClick={() => insertExample(example)} className="rounded-lg border border-theme bg-theme-card px-2.5 py-1 text-indigo-600 transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-950/30">{example}</button>)}
      </div>
      <p className="text-xs text-theme-muted">支持单页、范围、组合、all 和 n 函数表达式。</p>
    </div>
  );
}
