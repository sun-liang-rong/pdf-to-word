"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle, Image, Loader2, RefreshCw, RotateCcw, SlidersHorizontal, XCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import FileUploader from "@/components/upload/FileUploader";
import DownloadButton from "@/components/conversion/DownloadButton";

interface CompressResult {
  originalSize: number;
  compressedSize: number;
  compressionRate: string;
  downloadUrl: string;
  outputFormat: "jpg" | "png" | "webp";
  width: number;
  height: number;
}
type OutputFormat = "jpg" | "png" | "webp";
type PresetId = "small" | "balanced" | "quality" | null;

const presets: Array<{ id: Exclude<PresetId, null>; label: string; quality: number; maxWidth: string; hint: string }> = [
  { id: "small", label: "体积优先", quality: 55, maxWidth: "1280", hint: "适合网页和社交平台" },
  { id: "balanced", label: "均衡推荐", quality: 75, maxWidth: "1920", hint: "清晰度与体积平衡" },
  { id: "quality", label: "画质优先", quality: 90, maxWidth: "original", hint: "尽量保留原图细节" },
];

const formatOptions: Array<{ value: OutputFormat; label: string; description: string }> = [
  { value: "jpg", label: "JPG", description: "照片体积更小" },
  { value: "webp", label: "WebP", description: "现代网页格式" },
  { value: "png", label: "PNG", description: "保留透明背景" },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageCompressClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [quality, setQuality] = useState(75);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpg");
  const [maxWidth, setMaxWidth] = useState("1920");
  const [preset, setPreset] = useState<PresetId>("balanced");
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFileSelect = (selectedFile: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setImageSize({ width: 0, height: 0 });
    setResult(null);
    setError(null);
  };

  const applyPreset = (nextPreset: Exclude<PresetId, null>) => {
    const selected = presets.find((item) => item.id === nextPreset);
    if (!selected) return;
    setPreset(nextPreset);
    setQuality(selected.quality);
    setMaxWidth(selected.maxWidth);
  };

  const updateQuality = (value: number) => {
    setQuality(value);
    setPreset(null);
  };

  const updateMaxWidth = (value: string) => {
    setMaxWidth(value);
    setPreset(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", String(quality));
      formData.append("format", outputFormat);
      formData.append("keepAspectRatio", "true");
      if (maxWidth !== "original") formData.append("maxWidth", maxWidth);

      const response = await axios.post<CompressResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/image/compress`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setResult(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data;
      setError(typeof message === "string" ? message : t("conversion.retryOrCheck"));
    } finally {
      setIsCompressing(false);
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setImageSize({ width: 0, height: 0 });
    setResult(null);
    setError(null);
  };

  const downloadName = file
    ? `${file.name.replace(/\.[^/.]+$/, "")}_compressed.${result?.outputFormat || outputFormat}`
    : `compressed.${result?.outputFormat || outputFormat}`;
  const savings = result ? result.originalSize - result.compressedSize : 0;
  const savingsRate = result ? Number.parseFloat(result.compressionRate) : 0;

  return (
    <div className="detail-studio-page min-h-screen">
      <section className="relative py-10 lg:py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="detail-hero mb-12 max-w-4xl">
            <div className="detail-kicker mb-6 inline-flex items-center gap-2"><Image className="h-4 w-4" />{t("tools_detail.imageCompress.title")}</div>
            <h1 className="detail-title mb-5 text-5xl font-black leading-[0.9] tracking-[-0.06em] text-theme md:text-7xl">{t("tools_detail.imageCompress.title")}</h1>
            <p className="text-lg text-theme-muted">{t("tools_detail.imageCompress.description")}</p>
          </div>

          <div className="detail-workbench overflow-hidden">
            <div className="detail-workbench-head flex items-center gap-4 px-6 py-5 md:px-8">
              <div className="detail-tool-icon flex h-12 w-12 items-center justify-center"><SlidersHorizontal className="h-5 w-5" /></div>
              <div><h2 className="text-xl font-black tracking-[-0.03em] text-theme">图片压缩工作台</h2><p className="text-sm text-theme-muted">先选择方案，再根据预览调整参数</p></div>
            </div>

            <div className="space-y-6 p-6 md:p-8">
              {!file && !result && (
                <FileUploader
                  accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] }}
                  maxSize={20 * 1024 * 1024}
                  onFileSelect={handleFileSelect}
                  isUploading={isCompressing}
                />
              )}

              {file && !result && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                  <div className="space-y-4 rounded-2xl border border-theme bg-theme-secondary p-4 md:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div><p className="flex items-center gap-2 text-sm font-bold text-theme"><Image className="h-4 w-4 text-emerald-500" />原图预览</p><p className="mt-1 text-xs text-theme-muted">{imageSize.width ? `${imageSize.width} × ${imageSize.height}px` : "正在读取图片尺寸"}</p></div>
                      <button type="button" onClick={reset} disabled={isCompressing} className="rounded-lg p-2 text-theme-muted hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40" aria-label="移除图片" title="移除图片"><XCircle className="h-5 w-5" /></button>
                    </div>
                    <div className="grid min-h-[260px] place-items-center overflow-hidden rounded-xl bg-slate-950/90 p-3">
                      {previewUrl && <img src={previewUrl} alt="待压缩图片预览" className="max-h-[430px] w-full object-contain" onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} />}
                    </div>
                    <div className="flex items-center justify-between border-t border-theme pt-4 text-sm"><span className="max-w-[70%] truncate font-medium text-theme">{file.name}</span><span className="text-theme-muted">{formatBytes(file.size)}</span></div>
                  </div>

                  <fieldset disabled={isCompressing} className="space-y-5 rounded-2xl border border-theme bg-theme-secondary p-5">
                    <div><div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm font-bold text-theme">压缩方案</span><span className="text-xs text-theme-muted">点击即可应用</span></div>
                      <div className="grid gap-2">{presets.map((item) => (
                        <button key={item.id} type="button" onClick={() => applyPreset(item.id)} className={`flex items-center justify-between border px-3 py-3 text-left transition-colors ${preset === item.id ? "border-emerald-500 bg-emerald-500/10" : "border-theme bg-theme-card hover:border-emerald-400"}`}>
                          <span><span className="block text-sm font-bold text-theme">{item.label}</span><span className="block text-xs text-theme-muted">{item.hint}</span></span><span className="text-xs font-semibold text-theme-muted">{item.quality}%</span>
                        </button>
                      ))}</div>
                    </div>

                    <label className="block text-sm font-medium text-theme"><span className="mb-2 flex justify-between"><span>压缩质量</span><span className="font-bold text-emerald-600">{quality}%</span></span><input type="range" min="1" max="100" value={quality} onChange={(event) => updateQuality(Number(event.target.value))} className="w-full accent-emerald-500" /><span className="mt-1 flex justify-between text-[11px] text-theme-muted"><span>体积更小</span><span>画质更高</span></span></label>

                    <label className="block text-sm font-medium text-theme"><span className="mb-2 block">最大宽度</span><select value={maxWidth} onChange={(event) => updateMaxWidth(event.target.value)} className="w-full rounded-xl border border-theme bg-theme-card px-4 py-3 text-theme"><option value="original">保持原尺寸</option><option value="2560">最多 2560 px</option><option value="1920">最多 1920 px</option><option value="1280">最多 1280 px</option><option value="800">最多 800 px</option></select></label>

                    <div><span className="mb-2 block text-sm font-medium text-theme">输出格式</span><div className="grid grid-cols-3 gap-2">{formatOptions.map((option) => (
                      <button key={option.value} type="button" onClick={() => setOutputFormat(option.value)} className={`border px-2 py-3 text-center transition-colors ${outputFormat === option.value ? "border-emerald-500 bg-emerald-500/10" : "border-theme bg-theme-card hover:border-emerald-400"}`}><span className="block text-sm font-bold text-theme">{option.label}</span><span className="mt-1 block text-[10px] leading-tight text-theme-muted">{option.description}</span></button>
                    ))}</div></div>

                    <button type="button" onClick={handleCompress} disabled={isCompressing} className="detail-primary-action flex w-full items-center justify-center gap-2 px-5 py-3 disabled:opacity-60">{isCompressing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Image className="h-5 w-5" />}{isCompressing ? "正在压缩图片..." : "开始压缩"}</button>
                    {isCompressing && <p className="text-center text-xs text-theme-muted">正在处理图片，请稍候，页面不要关闭</p>}
                  </fieldset>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme pb-4"><div><p className="flex items-center gap-2 text-lg font-black text-theme"><CheckCircle className="h-5 w-5 text-emerald-500" />压缩完成</p><p className="mt-1 text-sm text-theme-muted">输出为 {result.outputFormat.toUpperCase()}，可以下载保存</p></div><button onClick={reset} className="inline-flex items-center gap-2 border border-theme bg-theme-card px-3 py-2 text-sm font-semibold text-theme hover:border-emerald-400"><RotateCcw className="h-4 w-4" />压缩另一张</button></div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="overflow-hidden rounded-2xl border border-theme bg-theme-secondary"><div className="border-b border-theme px-4 py-3"><p className="text-sm font-bold text-theme">压缩前</p><p className="text-xs text-theme-muted">{formatBytes(result.originalSize)}</p></div><div className="grid min-h-[220px] place-items-center bg-slate-950/90 p-3">{previewUrl && <img src={previewUrl} alt="压缩前图片" className="max-h-[340px] w-full object-contain" />}</div></div>
                    <div className="overflow-hidden rounded-2xl border border-emerald-500/50 bg-theme-secondary"><div className="border-b border-emerald-500/30 px-4 py-3"><p className="text-sm font-bold text-theme">压缩后</p><p className="text-xs text-emerald-600">{formatBytes(result.compressedSize)} · {result.width} × {result.height}px</p></div><div className="grid min-h-[220px] place-items-center bg-slate-950/90 p-3"><img src={result.downloadUrl} alt="压缩后图片" className="max-h-[340px] w-full object-contain" /></div></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-xl border border-theme bg-theme-secondary p-4"><p className="text-xs text-theme-muted">原始大小</p><p className="mt-1 font-bold text-theme">{formatBytes(result.originalSize)}</p></div>
                    <div className="rounded-xl border border-theme bg-theme-secondary p-4"><p className="text-xs text-theme-muted">压缩后</p><p className="mt-1 font-bold text-theme">{formatBytes(result.compressedSize)}</p></div>
                    <div className="rounded-xl border border-theme bg-theme-secondary p-4"><p className="text-xs text-theme-muted">节省空间</p><p className={`mt-1 font-bold ${savings >= 0 ? "text-emerald-600" : "text-amber-600"}`}>{savings >= 0 ? formatBytes(savings) : "文件变大"}</p></div>
                    <div className="rounded-xl border border-theme bg-theme-secondary p-4"><p className="text-xs text-theme-muted">压缩比例</p><p className="mt-1 font-bold text-theme">{savingsRate >= 0 ? result.compressionRate : "-"}</p></div>
                  </div>

                  <DownloadButton downloadUrl={result.downloadUrl} fileName={downloadName} onReset={reset} />
                </div>
              )}

              {error && <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400" role="alert"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><div className="min-w-0 flex-1"><p className="text-sm break-words">{error}</p></div>{file && !result && <button type="button" onClick={handleCompress} disabled={isCompressing} className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold hover:bg-red-100 disabled:opacity-50 dark:hover:bg-red-900/30"><RefreshCw className="h-4 w-4" />重试</button>}<button type="button" onClick={() => setError(null)} className="flex-shrink-0 rounded-lg p-1 opacity-60 hover:bg-red-100 hover:opacity-100 dark:hover:bg-red-900/30" aria-label="关闭错误提示" title="关闭错误提示"><XCircle className="h-4 w-4" /></button></div>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
