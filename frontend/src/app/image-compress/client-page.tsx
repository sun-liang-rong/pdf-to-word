"use client";

import { useState } from "react";
import axios from "axios";
import { CheckCircle, Image, Loader2, XCircle } from "lucide-react";
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

export default function ImageCompressClient() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<"jpg" | "png" | "webp">("jpg");
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
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

      const response = await axios.post<CompressResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/image/compress`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || t("conversion.retryOrCheck"));
    } finally {
      setIsCompressing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const downloadName = file
    ? `${file.name.replace(/\.[^/.]+$/, "")}_compressed.${result?.outputFormat || outputFormat}`
    : `compressed.${result?.outputFormat || outputFormat}`;

  return (
    <div className="detail-studio-page min-h-screen">
      <section className="relative py-10 lg:py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="detail-hero mb-12 max-w-4xl">
            <div className="detail-kicker mb-6 inline-flex items-center gap-2">
              <Image className="w-4 h-4" />
              {t("tools_detail.imageCompress.title")}
            </div>
            <h1 className="detail-title mb-5 text-5xl font-black leading-[0.9] tracking-[-0.06em] text-theme md:text-7xl">
              {t("tools_detail.imageCompress.title")}
            </h1>
            <p className="text-lg text-theme-muted">
              {t("tools_detail.imageCompress.description")}
            </p>
          </div>

          <div className="detail-workbench overflow-hidden">
            <div className="detail-workbench-head px-6 py-5 md:px-8">
              <h2 className="text-xl font-black tracking-[-0.03em] text-theme">{t("conversion.startConversion")}</h2>
              <p className="text-sm text-theme-muted">{t("conversion.uploadAndConvert")}</p>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {!result && (
                <FileUploader
                  accept={{
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                    "image/webp": [".webp"],
                  }}
                  maxSize={20 * 1024 * 1024}
                  onFileSelect={handleFileSelect}
                  isUploading={isCompressing}
                />
              )}

              {file && !result && (
                <div className="space-y-5 rounded-2xl border border-theme bg-theme-secondary p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-theme truncate">{file.name}</p>
                      <p className="text-sm text-theme-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={reset} className="p-2 text-theme-muted hover:text-red-500" aria-label="Remove file">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <label className="block">
                    <span className="flex justify-between text-sm font-medium text-theme mb-2">
                      <span>压缩质量</span><span>{quality}%</span>
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={quality}
                      onChange={(event) => setQuality(Number(event.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </label>

                  <label className="block text-sm font-medium text-theme">
                    <span className="block mb-2">输出格式</span>
                    <select
                      value={outputFormat}
                      onChange={(event) => setOutputFormat(event.target.value as "jpg" | "png" | "webp")}
                      className="w-full rounded-xl border border-theme bg-theme-card px-4 py-3 text-theme"
                    >
                      <option value="jpg">JPG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </label>

                  <button
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="detail-primary-action w-full flex items-center justify-center gap-2 px-5 py-3 disabled:opacity-60"
                  >
                    {isCompressing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Image className="w-5 h-5" />}
                    {isCompressing ? "正在压缩..." : "开始压缩"}
                  </button>
                </div>
              )}

              {result && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      ["原始大小", `${(result.originalSize / 1024).toFixed(1)} KB`],
                      ["压缩后", `${(result.compressedSize / 1024).toFixed(1)} KB`],
                      ["压缩率", result.compressionRate],
                      ["尺寸", `${result.width}x${result.height}`],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-theme-secondary p-4 text-center border border-theme">
                        <p className="text-xs text-theme-muted mb-1">{label}</p>
                        <p className="font-bold text-theme">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-500 font-medium">
                    <CheckCircle className="w-5 h-5" />图片压缩完成
                  </div>
                  <DownloadButton downloadUrl={result.downloadUrl} fileName={downloadName} onReset={reset} />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
