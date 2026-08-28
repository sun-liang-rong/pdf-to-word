"use client";

interface MergeOptionsProps {
  sortType: string;
  removeCertSign: boolean;
  generateToc: boolean;
  onSortTypeChange: (value: string) => void;
  onRemoveCertSignChange: (value: boolean) => void;
  onGenerateTocChange: (value: boolean) => void;
}

const sortOptions = [
  { value: "order", label: "按上传顺序" },
  { value: "reverseOrder", label: "按上传顺序（倒序）" },
  { value: "byName", label: "按文件名排序" },
  { value: "byNameReverse", label: "按文件名排序（倒序）" },
  { value: "byDate", label: "按修改时间排序" },
  { value: "byDateReverse", label: "按修改时间排序（倒序）" },
];

export default function MergeOptions({
  sortType,
  removeCertSign,
  generateToc,
  onSortTypeChange,
  onRemoveCertSignChange,
  onGenerateTocChange,
}: MergeOptionsProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-theme bg-theme-secondary p-5 md:p-6">
      <div>
        <h3 className="text-base font-bold text-theme">合并选项</h3>
        <p className="mt-1 text-xs text-theme-muted">文件顺序和目录设置只影响合并后的文档。</p>
      </div>

      <label className="block text-sm font-semibold text-theme">
        <span className="mb-2 block">排序方式</span>
        <select
          value={sortType}
          onChange={(event) => onSortTypeChange(event.target.value)}
          className="w-full rounded-xl border border-theme bg-theme-card px-4 py-3 text-theme outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        >
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-theme bg-theme-card p-4 text-sm text-theme transition-colors hover:border-indigo-300">
          <input type="checkbox" checked={removeCertSign} onChange={(event) => onRemoveCertSignChange(event.target.checked)} className="mt-0.5 h-4 w-4 flex-shrink-0 accent-indigo-500" />
          <span><span className="block font-semibold">去除证书签名</span><span className="mt-1 block text-xs text-theme-muted">移除可能阻止编辑的证书签名。</span></span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-theme bg-theme-card p-4 text-sm text-theme transition-colors hover:border-indigo-300">
          <input type="checkbox" checked={generateToc} onChange={(event) => onGenerateTocChange(event.target.checked)} className="mt-0.5 h-4 w-4 flex-shrink-0 accent-indigo-500" />
          <span><span className="block font-semibold">生成目录</span><span className="mt-1 block text-xs text-theme-muted">使用文件名作为章节标题。</span></span>
        </label>
      </div>
    </div>
  );
}
