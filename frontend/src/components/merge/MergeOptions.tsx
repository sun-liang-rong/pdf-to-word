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
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">合并选项</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            排序方式
          </label>
          <select
            value={sortType}
            onChange={(e) => onSortTypeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="removeCertSign"
            checked={removeCertSign}
            onChange={(e) => onRemoveCertSignChange(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="removeCertSign" className="ml-3 text-sm text-gray-700">
            去除证书签名
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="generateToc"
            checked={generateToc}
            onChange={(e) => onGenerateTocChange(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="generateToc" className="ml-3 text-sm text-gray-700">
            生成目录（使用文件名作为章节标题）
          </label>
        </div>
      </div>
    </div>
  );
}
