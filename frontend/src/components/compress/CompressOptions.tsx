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
  { value: 1, label: "轻度压缩", description: "尽量保持原始质量" },
  { value: 2, label: "标准压缩", description: "压缩率和质量平衡" },
  { value: 3, label: "高度压缩", description: "更小体积，轻微损失" },
  { value: 4, label: "极限压缩", description: "优先缩小文件体积" },
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
    <div className="space-y-6 rounded-2xl border border-theme bg-theme-secondary p-5 md:p-6">
      <div>
        <h3 className="text-base font-bold text-theme">压缩选项</h3>
        <p className="mt-1 text-xs text-theme-muted">选择压缩强度，也可以打开针对特定场景的优化。</p>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-theme">优化等级</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup" aria-label="优化等级">
          {optimizeLevelOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={optimizeLevel === option.value}
              onClick={() => onOptimizeLevelChange(option.value)}
              className={`min-h-[88px] rounded-xl border p-3 text-left transition-colors ${optimizeLevel === option.value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" : "border-theme bg-theme-card hover:border-indigo-300"}`}
            >
              <span className="block text-sm font-bold text-theme">{option.label}</span>
              <span className="mt-1 block text-xs leading-5 text-theme-muted">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="block text-sm font-semibold text-theme">
        <span className="mb-2 block">期望输出大小 <span className="font-normal text-theme-muted">（可选）</span></span>
        <input
          type="text"
          inputMode="decimal"
          value={expectedOutputSize}
          onChange={(event) => onExpectedOutputSizeChange(event.target.value)}
          placeholder="例如：100MB 或 500KB"
          className="w-full rounded-xl border border-theme bg-theme-card px-4 py-3 text-theme outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        />
        <span className="mt-1 block text-xs font-normal text-theme-muted">设定目标体积后，系统会尽量接近该大小。</span>
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["linearize", "线性化", "适合网页快速预览", linearize, onLinearizeChange],
          ["normalize", "标准化", "提升 PDF 兼容性", normalize, onNormalizeChange],
          ["grayscale", "灰度化", "转换为灰度图像", grayscale, onGrayscaleChange],
        ].map(([id, label, hint, checked, setter]) => (
          <label key={String(id)} className="flex cursor-pointer items-start gap-3 rounded-xl border border-theme bg-theme-card p-4 text-sm text-theme transition-colors hover:border-indigo-300">
            <input id={String(id)} type="checkbox" checked={Boolean(checked)} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} className="mt-0.5 h-4 w-4 flex-shrink-0 accent-indigo-500" />
            <span><span className="block font-semibold">{String(label)}</span><span className="mt-1 block text-xs text-theme-muted">{String(hint)}</span></span>
          </label>
        ))}
      </div>

      <div className="border-t border-theme pt-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-theme">
          <input type="checkbox" checked={lineArt} onChange={(event) => onLineArtChange(event.target.checked)} className="mt-0.5 h-4 w-4 flex-shrink-0 accent-indigo-500" />
          <span><span className="block font-semibold">高对比度线稿转换</span><span className="mt-1 block text-xs text-theme-muted">适合黑白扫描件或线稿素材。</span></span>
        </label>

        {lineArt && (
          <div className="mt-4 space-y-5 rounded-xl border border-theme bg-theme-card p-4">
            <label className="block text-sm font-semibold text-theme">
              <span className="mb-2 flex justify-between"><span>线稿阈值</span><span className="text-indigo-500">{lineArtThreshold}</span></span>
              <input type="range" min="0" max="100" value={lineArtThreshold} onChange={(event) => onLineArtThresholdChange(Number(event.target.value))} className="w-full accent-indigo-500" />
              <span className="mt-1 flex justify-between text-xs font-normal text-theme-muted"><span>浅色</span><span>深色</span></span>
            </label>
            <div>
              <p className="mb-2 text-sm font-semibold text-theme">边缘检测强度</p>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="边缘检测强度">
                {[1, 2, 3].map((level) => (
                  <button key={level} type="button" role="radio" aria-checked={lineArtEdgeLevel === level} onClick={() => onLineArtEdgeLevelChange(level)} className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${lineArtEdgeLevel === level ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-300" : "border-theme text-theme-muted hover:border-indigo-300"}`}>{level === 1 ? "弱" : level === 2 ? "中" : "强"}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
