"use client";

interface CompressOptionsProps {
  optimizeLevel: number;
  expectedOutputSize: string;
  linearize: boolean;
  normalize: boolean;
  grayscale: boolean;
  lineArt: boolean;
  lineArtThreshold: number;
  lineArtEdgeLevel: number;
  onOptimizeLevelChange: (value: number) => void;
  onExpectedOutputSizeChange: (value: string) => void;
  onLinearizeChange: (value: boolean) => void;
  onNormalizeChange: (value: boolean) => void;
  onGrayscaleChange: (value: boolean) => void;
  onLineArtChange: (value: boolean) => void;
  onLineArtThresholdChange: (value: number) => void;
  onLineArtEdgeLevelChange: (value: number) => void;
}

const optimizeLevelOptions = [
  { value: 1, label: "级别 1 - 轻度压缩", description: "最小压缩，保持最佳质量" },
  { value: 2, label: "级别 2 - 标准压缩", description: "平衡压缩率和质量" },
  { value: 3, label: "级别 3 - 高度压缩", description: "较高压缩率，轻微质量损失" },
  { value: 4, label: "级别 4 - 极限压缩", description: "最大压缩率，可能影响质量" },
];

export default function CompressOptions({
  optimizeLevel,
  expectedOutputSize,
  linearize,
  normalize,
  grayscale,
  lineArt,
  lineArtThreshold,
  lineArtEdgeLevel,
  onOptimizeLevelChange,
  onExpectedOutputSizeChange,
  onLinearizeChange,
  onNormalizeChange,
  onGrayscaleChange,
  onLineArtChange,
  onLineArtThresholdChange,
  onLineArtEdgeLevelChange,
}: CompressOptionsProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">压缩选项</h3>

      {/* 优化等级 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          优化等级 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {optimizeLevelOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onOptimizeLevelChange(option.value)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                optimizeLevel === option.value
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 期望输出大小 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          期望输出大小（可选）
        </label>
        <input
          type="text"
          value={expectedOutputSize}
          onChange={(e) => onExpectedOutputSizeChange(e.target.value)}
          placeholder="例如: 100MB, 500KB"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          设置压缩后的目标文件大小，如 100MB、500KB
        </p>
      </div>

      {/* 基本选项 */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="linearize"
            checked={linearize}
            onChange={(e) => onLinearizeChange(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="linearize" className="ml-3 text-sm text-gray-700">
            <span className="font-medium">线性化</span>
            <span className="text-gray-500 ml-1">- 适合网页快速预览</span>
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="normalize"
            checked={normalize}
            onChange={(e) => onNormalizeChange(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="normalize" className="ml-3 text-sm text-gray-700">
            <span className="font-medium">标准化</span>
            <span className="text-gray-500 ml-1">- 提升 PDF 兼容性</span>
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="grayscale"
            checked={grayscale}
            onChange={(e) => onGrayscaleChange(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="grayscale" className="ml-3 text-sm text-gray-700">
            <span className="font-medium">灰度化</span>
            <span className="text-gray-500 ml-1">- 将 PDF 转为灰度图像</span>
          </label>
        </div>
      </div>

      {/* 高对比度线稿转换 */}
      <div className="border-t pt-4">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="lineArt"
            checked={lineArt}
            onChange={(e) => onLineArtChange(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="lineArt" className="ml-3 text-sm text-gray-700">
            <span className="font-medium">高对比度线稿转换</span>
            <span className="text-gray-500 ml-1">- 将图像转换为线稿</span>
          </label>
        </div>

        {lineArt && (
          <div className="ml-7 space-y-4 p-4 bg-white rounded-lg border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                线稿阈值: {lineArtThreshold}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={lineArtThreshold}
                onChange={(e) => onLineArtThresholdChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0（浅色）</span>
                <span>100（深色）</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                边缘检测强度
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onLineArtEdgeLevelChange(level)}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      lineArtEdgeLevel === level
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {level === 1 ? "弱" : level === 2 ? "中" : "强"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
