"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle, Droplets, Eye, Grid3X3, Loader2, Palette, RefreshCw, RotateCcw, XCircle } from "lucide-react";
import FileUploader from "@/components/upload/FileUploader";
import DownloadButton from "@/components/conversion/DownloadButton";
import { useI18n } from "@/lib/i18n";

interface WatermarkResult {
  url: string;
  width: number;
  height: number;
  size: string;
  originalSize: string;
  downloadUrl: string;
}

const positions = [
  ["top-left", "左上"], ["top-center", "上中"], ["top-right", "右上"],
  ["center-left", "左中"], ["center", "居中"], ["center-right", "右中"],
  ["bottom-left", "左下"], ["bottom-center", "下中"], ["bottom-right", "右下"],
] as const;

type WatermarkPosition = typeof positions[number][0];

const watermarkPresets: Array<{
  label: string;
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: WatermarkPosition;
  rotation: number;
  tile: boolean;
}> = [
  { label: "版权角标", text: "版权所有", fontSize: 36, color: "#FFFFFF", opacity: 0.7, position: "bottom-right", rotation: 0, tile: false },
  { label: "居中标记", text: "仅供预览", fontSize: 52, color: "#FFFFFF", opacity: 0.45, position: "center", rotation: -25, tile: false },
  { label: "平铺保护", text: "CONFIDENTIAL", fontSize: 38, color: "#FFFFFF", opacity: 0.3, position: "center", rotation: -30, tile: true },
];

const colorSwatches = ["#FFFFFF", "#111827", "#EF4444", "#2563EB", "#059669", "#F59E0B"];

export default function ImageWatermarkClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#FFFFFF");
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [rotation, setRotation] = useState(0);
  const [tile, setTile] = useState(false);
  const [tileSpacing, setTileSpacing] = useState(100);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [previewWidth, setPreviewWidth] = useState(0);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (!previewRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setPreviewWidth(entry.contentRect.width);
    });
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [file]);

  const selectFile = (nextFile: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setImageSize({ width: 0, height: 0 });
    setResult(null);
    setError(null);
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setImageSize({ width: 0, height: 0 });
    setResult(null);
    setError(null);
  };

  const submit = async () => {
    if (!file || !text.trim()) {
      setError(!file ? "请先上传图片" : "请输入水印文字");
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("text", text.trim());
      formData.append("fontSize", String(fontSize));
      formData.append("color", color);
      formData.append("opacity", String(opacity));
      formData.append("position", position);
      formData.append("rotation", String(rotation));
      formData.append("margin", "20");
      formData.append("tile", String(tile));
      formData.append("tileSpacing", String(tileSpacing));

      const response = await axios.post<WatermarkResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/image-watermark/text`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setResult(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data;
      setError(typeof message === "string" ? message : "添加水印失败，请重试");
    } finally {
      setProcessing(false);
    }
  };

  const applyPreset = (preset: typeof watermarkPresets[number]) => {
    setText(preset.text);
    setFontSize(preset.fontSize);
    setColor(preset.color);
    setOpacity(preset.opacity);
    setPosition(preset.position);
    setRotation(preset.rotation);
    setTile(preset.tile);
    setError(null);
  };

  const downloadUrl = result?.downloadUrl
    ? result.downloadUrl
    : "";
  const downloadName = file ? `watermarked-${file.name}` : "watermarked-image.jpg";
  const previewScale = imageSize.width && previewWidth ? previewWidth / imageSize.width : 1;
  const previewFontSize = Math.max(12, Math.min(72, Math.round(fontSize * previewScale)));
  const previewMargin = Math.max(8, Math.round(20 * previewScale));
  const previewGap = Math.max(12, Math.round(tileSpacing * previewScale));
  const rotatedTextStyle: CSSProperties = {
    color,
    opacity,
    fontSize: `${previewFontSize}px`,
    lineHeight: 1.2,
    textShadow: "0 1px 3px rgba(0,0,0,.5)",
    WebkitTextStroke: "0.35px rgba(0,0,0,.25)",
    transform: `rotate(${rotation}deg)`,
  };
  const positionStyle: Record<WatermarkPosition, CSSProperties> = {
    "top-left": { top: previewMargin, left: previewMargin },
    "top-center": { top: previewMargin, left: "50%", transform: `translateX(-50%) rotate(${rotation}deg)` },
    "top-right": { top: previewMargin, right: previewMargin },
    "center-left": { top: "50%", left: previewMargin, transform: `translateY(-50%) rotate(${rotation}deg)` },
    center: { top: "50%", left: "50%", transform: `translate(-50%, -50%) rotate(${rotation}deg)` },
    "center-right": { top: "50%", right: previewMargin, transform: `translateY(-50%) rotate(${rotation}deg)` },
    "bottom-left": { bottom: previewMargin, left: previewMargin },
    "bottom-center": { bottom: previewMargin, left: "50%", transform: `translateX(-50%) rotate(${rotation}deg)` },
    "bottom-right": { bottom: previewMargin, right: previewMargin },
  };

  return (
    <div className="detail-studio-page min-h-screen">
      <section className="relative py-10 lg:py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="detail-hero mb-12 max-w-4xl">
            <div className="detail-kicker mb-6 inline-flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              {t("tools_detail.imageWatermark.title")}
            </div>
            <h1 className="detail-title mb-5 text-5xl font-black leading-[0.9] tracking-[-0.06em] text-theme md:text-7xl">
              {t("tools_detail.imageWatermark.title")}
            </h1>
            <p className="text-lg text-theme-muted">
              {t("tools_detail.imageWatermark.description")}
            </p>
          </div>

          <div className="detail-workbench overflow-hidden">
            <div className="detail-workbench-head flex items-center gap-4 px-6 py-5 md:px-8">
              <div className="detail-tool-icon flex h-12 w-12 items-center justify-center"><Droplets className="h-5 w-5" /></div>
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-theme">图片水印工作台</h2>
                <p className="text-sm text-theme-muted">选择预设或自定义编辑，预览会即时同步</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {!result && (
                <FileUploader
                  accept={{
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                    "image/webp": [".webp"],
                  }}
                  maxSize={10 * 1024 * 1024}
                  onFileSelect={selectFile}
                  isUploading={processing}
                />
              )}

              {file && !result && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                  <div className="space-y-4 rounded-2xl border border-theme bg-theme-secondary p-4 md:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-bold text-theme"><Eye className="h-4 w-4 text-sky-500" />实时预览</div>
                        <p className="mt-1 text-xs text-theme-muted">调整右侧参数，水印会立即同步</p>
                      </div>
                      <span className="rounded-full border border-theme bg-theme-card px-3 py-1 text-xs text-theme-muted">实时编辑</span>
                    </div>

                    <div
                      ref={previewRef}
                      className="relative w-full overflow-hidden rounded-xl bg-slate-950 shadow-inner"
                      style={{ aspectRatio: imageSize.width && imageSize.height ? `${imageSize.width} / ${imageSize.height}` : "16 / 9" }}
                    >
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="图片水印预览"
                          className="absolute inset-0 h-full w-full object-contain"
                          onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
                        />
                      )}
                      {text.trim() ? (
                        tile ? (
                          <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-5 overflow-hidden p-4" style={{ gap: previewGap, transform: `rotate(${rotation}deg)` }}>
                            {Array.from({ length: 12 }, (_, index) => <span key={index} className="whitespace-nowrap font-semibold" style={{ ...rotatedTextStyle, transform: undefined }}>{text.trim()}</span>)}
                          </div>
                        ) : (
                          <span className="absolute whitespace-nowrap font-semibold" style={{ ...rotatedTextStyle, ...positionStyle[position] }}>{text.trim()}</span>
                        )
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-black/10 px-6 text-center text-sm text-white/80">输入水印文字后将在这里预览</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-theme pt-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-theme">{file.name}</p>
                        <p className="text-sm text-theme-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button type="button" onClick={reset} disabled={processing} className="rounded-lg p-2 text-theme-muted hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40" aria-label="删除图片" title="删除图片">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <fieldset disabled={processing} className="space-y-5 rounded-2xl border border-theme bg-theme-secondary p-5">
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-theme">快速预设</span>
                        <span className="text-xs text-theme-muted">一键填充参数</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {watermarkPresets.map((preset) => (
                          <button key={preset.label} type="button" onClick={() => applyPreset(preset)} className="border border-theme bg-theme-card px-2 py-3 text-center text-xs font-semibold text-theme transition-colors hover:border-sky-500 hover:bg-sky-500/10">
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="block text-sm font-medium text-theme">
                      <span className="mb-2 block">水印文字</span>
                      <div className="relative">
                        <input value={text} maxLength={100} onChange={(event) => setText(event.target.value)} placeholder="请输入水印内容" className="w-full rounded-xl border border-theme bg-theme-card px-4 py-3 pr-12 text-theme" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-theme-muted">{text.length}/100</span>
                      </div>
                    </label>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
                      <label className="block text-sm font-medium text-theme">
                        <span className="mb-2 flex justify-between"><span>字体大小</span><span>{fontSize}px</span></span>
                        <input type="range" min="10" max="200" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} className="w-full accent-sky-500" />
                      </label>
                      <label className="block text-sm font-medium text-theme">
                        <span className="mb-2 flex justify-between"><span>透明度</span><span>{Math.round(opacity * 100)}%</span></span>
                        <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} className="w-full accent-sky-500" />
                      </label>
                      <label className="block text-sm font-medium text-theme">
                        <span className="mb-2 flex items-center gap-2"><Palette className="h-4 w-4" />水印颜色</span>
                        <div className="flex items-center gap-2 rounded-xl border border-theme bg-theme-card p-2">
                          {colorSwatches.map((swatch) => <button key={swatch} type="button" onClick={() => setColor(swatch)} title={swatch} aria-label={`选择颜色 ${swatch}`} className={`h-6 w-6 rounded-full border-2 ${color === swatch ? "border-sky-500 ring-2 ring-sky-500/30" : "border-white/40"}`} style={{ backgroundColor: swatch }} />)}
                          <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="ml-auto h-8 w-8 cursor-pointer rounded border border-theme bg-theme-card p-0.5" aria-label="自定义水印颜色" />
                        </div>
                      </label>
                      <label className="block text-sm font-medium text-theme">
                        <span className="mb-2 flex justify-between"><span>旋转角度</span><span>{rotation}°</span></span>
                        <input type="range" min="-180" max="180" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} className="w-full accent-sky-500" />
                      </label>
                      <label className="flex items-center gap-3 rounded-xl border border-theme bg-theme-card px-4 py-3 text-sm font-medium text-theme">
                        <input type="checkbox" checked={tile} onChange={(event) => setTile(event.target.checked)} className="h-4 w-4 accent-sky-500" />
                        平铺水印
                      </label>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-medium text-theme"><Grid3X3 className="h-4 w-4" />水印位置</span>{tile && <span className="text-xs text-theme-muted">平铺模式下不适用</span>}</div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {positions.map(([value, label]) => (
                          <button key={value} type="button" onClick={() => setPosition(value)} disabled={tile} title={label} aria-label={`水印位置：${label}`} className={`h-10 border text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${position === value && !tile ? "border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300" : "border-theme bg-theme-card text-theme hover:border-sky-400"}`}>
                            <span className={`mx-auto block h-2 w-2 rounded-full ${position === value && !tile ? "bg-sky-500" : "bg-theme-muted"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {tile && (
                      <label className="block text-sm font-medium text-theme">
                        <span className="mb-2 flex justify-between"><span>平铺间距</span><span>{tileSpacing}px</span></span>
                        <input type="range" min="50" max="500" value={tileSpacing} onChange={(event) => setTileSpacing(Number(event.target.value))} className="w-full accent-sky-500" />
                      </label>
                    )}

                    <button type="button" onClick={submit} disabled={processing || !text.trim()} className="detail-primary-action flex w-full items-center justify-center gap-2 px-5 py-3 disabled:opacity-50">
                      {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Droplets className="h-5 w-5" />}
                      {processing ? "正在添加水印..." : "添加水印"}
                    </button>
                    {processing && <p className="text-center text-xs text-theme-muted">正在生成图片，请稍候，页面不要关闭</p>}
                  </fieldset>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme pb-4">
                    <div>
                      <p className="flex items-center gap-2 text-lg font-black text-theme"><CheckCircle className="h-5 w-5 text-emerald-500" />水印已生成</p>
                      <p className="mt-1 text-sm text-theme-muted">确认成品效果后即可下载，文件将在 30 分钟后自动删除</p>
                    </div>
                    <button onClick={() => setResult(null)} className="inline-flex items-center gap-2 border border-theme bg-theme-card px-3 py-2 text-sm font-semibold text-theme hover:border-sky-500"><RotateCcw className="h-4 w-4" />继续编辑</button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="overflow-hidden rounded-2xl border border-theme bg-theme-secondary">
                      <div className="border-b border-theme px-4 py-3"><p className="text-sm font-bold text-theme">原图</p><p className="text-xs text-theme-muted">{result.originalSize}</p></div>
                      <div className="grid min-h-[220px] place-items-center bg-slate-950/90 p-3">{previewUrl && <img src={previewUrl} alt="添加水印前的图片" className="max-h-[340px] w-full object-contain" />}</div>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-sky-500/50 bg-theme-secondary">
                      <div className="border-b border-sky-500/30 px-4 py-3"><p className="text-sm font-bold text-theme">水印成品</p><p className="text-xs text-sky-600">{result.size} · {result.width} × {result.height}px</p></div>
                      <div className="grid min-h-[220px] place-items-center bg-slate-950/90 p-3"><img src={result.url} alt="添加水印后的图片" className="max-h-[340px] w-full object-contain" /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[["原始大小", result.originalSize], ["处理后", result.size], ["宽度", `${result.width}px`], ["高度", `${result.height}px`]].map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-theme bg-theme-secondary p-4"><p className="text-xs text-theme-muted">{label}</p><p className="mt-1 font-bold text-theme">{value}</p></div>
                    ))}
                  </div>
                  <DownloadButton downloadUrl={downloadUrl} fileName={downloadName} onReset={reset} />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400" role="alert">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><p className="min-w-0 flex-1 break-words text-sm">{error}</p>
                  {file && !result && <button type="button" onClick={submit} disabled={processing || !text.trim()} className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold hover:bg-red-100 disabled:opacity-50 dark:hover:bg-red-900/30"><RefreshCw className="h-4 w-4" />重试</button>}
                  <button type="button" onClick={() => setError(null)} className="flex-shrink-0 rounded-lg p-1 opacity-60 hover:bg-red-100 hover:opacity-100 dark:hover:bg-red-900/30" aria-label="关闭错误提示" title="关闭错误提示"><XCircle className="h-4 w-4" /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
