"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Droplets, Loader2, XCircle } from "lucide-react";
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

export default function ImageWatermarkClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#FFFFFF");
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState("bottom-right");
  const [rotation, setRotation] = useState(0);
  const [tile, setTile] = useState(false);
  const [tileSpacing, setTileSpacing] = useState(100);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const selectFile = (nextFile: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setResult(null);
    setError(null);
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
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

  const downloadUrl = result?.downloadUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}${result.downloadUrl}`
    : "";
  const downloadName = file ? `watermarked-${file.name}` : "watermarked-image.jpg";

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
            <div className="detail-workbench-head px-6 py-5 md:px-8">
              <h2 className="text-xl font-black tracking-[-0.03em] text-theme">添加文字水印</h2>
              <p className="text-sm text-theme-muted">支持 JPG、PNG、WebP，最大 10MB</p>
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
                <div className="space-y-5 rounded-2xl border border-theme bg-theme-secondary p-5">
                  {previewUrl && (
                    <img src={previewUrl} alt="图片预览" className="max-h-72 w-full rounded-xl object-contain bg-black/10" />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-theme truncate">{file.name}</p>
                      <p className="text-sm text-theme-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={reset} className="p-2 text-theme-muted hover:text-red-500" aria-label="删除图片">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <label className="block text-sm font-medium text-theme">
                    <span className="block mb-2">水印文字</span>
                    <input value={text} maxLength={100} onChange={(event) => setText(event.target.value)} placeholder="请输入水印内容" className="w-full rounded-xl border border-theme bg-theme-card px-4 py-3 text-theme" />
                  </label>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block text-sm font-medium text-theme">
                      <span className="flex justify-between mb-2"><span>字体大小</span><span>{fontSize}px</span></span>
                      <input type="range" min="10" max="200" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} className="w-full accent-sky-500" />
                    </label>
                    <label className="block text-sm font-medium text-theme">
                      <span className="flex justify-between mb-2"><span>透明度</span><span>{Math.round(opacity * 100)}%</span></span>
                      <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} className="w-full accent-sky-500" />
                    </label>
                    <label className="block text-sm font-medium text-theme">
                      <span className="block mb-2">水印颜色</span>
                      <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-12 w-full rounded-xl border border-theme bg-theme-card p-1" />
                    </label>
                    <label className="block text-sm font-medium text-theme">
                      <span className="block mb-2">水印位置</span>
                      <select value={position} onChange={(event) => setPosition(event.target.value)} disabled={tile} className="w-full rounded-xl border border-theme bg-theme-card px-4 py-3 text-theme disabled:opacity-50">
                        {positions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <label className="block text-sm font-medium text-theme">
                      <span className="flex justify-between mb-2"><span>旋转角度</span><span>{rotation}°</span></span>
                      <input type="range" min="-180" max="180" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} className="w-full accent-sky-500" />
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-theme bg-theme-card px-4 py-3 text-sm font-medium text-theme">
                      <input type="checkbox" checked={tile} onChange={(event) => setTile(event.target.checked)} className="h-4 w-4 accent-sky-500" />
                      平铺水印
                    </label>
                  </div>

                  {tile && (
                    <label className="block text-sm font-medium text-theme">
                      <span className="flex justify-between mb-2"><span>平铺间距</span><span>{tileSpacing}px</span></span>
                      <input type="range" min="50" max="500" value={tileSpacing} onChange={(event) => setTileSpacing(Number(event.target.value))} className="w-full accent-sky-500" />
                    </label>
                  )}

                  <button onClick={submit} disabled={processing || !text.trim()} className="detail-primary-action w-full flex items-center justify-center gap-2 px-5 py-3 disabled:opacity-50">
                    {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Droplets className="w-5 h-5" />}
                    {processing ? "正在添加水印..." : "添加水印"}
                  </button>
                </div>
              )}

              {result && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[["原始大小", result.originalSize], ["处理后", result.size], ["宽度", `${result.width}px`], ["高度", `${result.height}px`]].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-theme-secondary p-4 text-center border border-theme">
                        <p className="text-xs text-theme-muted mb-1">{label}</p><p className="font-bold text-theme">{value}</p>
                      </div>
                    ))}
                  </div>
                  <DownloadButton downloadUrl={downloadUrl} fileName={downloadName} onReset={reset} />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5" /><p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
