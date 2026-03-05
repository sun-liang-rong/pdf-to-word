"use client";

import { useState, useRef } from "react";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

interface CompressResult {
  originalSize: number;
  compressedSize: number;
  compressionRate: string;
  downloadUrl: string;
  outputFormat: string;
  width: number;
  height: number;
}

const faqItems = [
  {
    question: "支持哪些图片格式？",
    answer: "支持 JPG、JPEG、PNG、WebP 格式的图片压缩。您可以在压缩时选择输出格式。",
  },
  {
    question: "压缩会影响图片质量吗？",
    answer: "压缩质量可调节 (1-100)，数值越高质量越好。建议设置 70-80 可以获得较好的压缩比同时保持较好画质。",
  },
  {
    question: "可以批量压缩多张图片吗？",
    answer: "当前版本支持单张图片压缩。如需批量处理，可以多次上传。",
  },
  {
    question: "支持哪些输出格式？",
    answer: "支持输出为 JPG、PNG、WebP 三种格式。您可以根据需要选择不同的输出格式。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传图片",
    description: "点击或拖拽上传需要压缩的图片",
    icon: "📤",
  },
  {
    step: 2,
    title: "设置参数",
    description: "选择压缩质量和输出格式",
    icon: "⚙️",
  },
  {
    step: 3,
    title: "下载压缩图片",
    description: "压缩完成后下载压缩后的图片",
    icon: "📥",
  },
];

export default function ImageCompressClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<"jpg" | "png" | "webp">("jpg");
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setResult(null);
    
    // 创建预览 URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };
  console.log(process.env.NEXT_PUBLIC_STATIC_URL, 'process.env.NEXT_PUBLIC_STATIC_URL')
  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError("请先上传图片");
      return;
    }

    setIsCompressing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", String(quality));
      formData.append("format", outputFormat);
      if (maxWidth && parseInt(maxWidth) > 0) {
        formData.append("maxWidth", maxWidth);
      }
      formData.append("keepAspectRatio", String(keepAspectRatio));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/image/compress`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "压缩失败，请检查文件后重试"
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.downloadUrl) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}${result.downloadUrl}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const ext = result.outputFormat === "jpg" ? "jpg" : result.outputFormat;
      const fileName = file?.name.replace(/\.[^/.]+$/, "") || "compressed";
      link.setAttribute("download", `${fileName}_compressed.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("下载失败，请重试");
    }
  };

  const handleReset = () => {
    handleRemoveFile();
    setQuality(80);
    setMaxWidth("");
    setOutputFormat("jpg");
    setKeepAspectRatio(true);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 tech-grid opacity-20" />

        <div className="relative container mx-auto px-4 py-16">
          <nav className="flex items-center space-x-2 text-sm text-foreground-muted mb-8">
            <a href="/" className="hover:text-primary-400 transition-colors">
              首页
            </a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">图片压缩</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">🖼️</span>
                <span className="text-primary-300">图片工具</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                图片压缩在线工具
              </h1>
              <p className="text-lg text-foreground-muted">
                免费在线压缩图片，支持 JPG、PNG、WebP 格式，保持最佳画质
              </p>
            </div>

            <div className="card-dark rounded-3xl overflow-hidden border border-primary/20">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">图片压缩</h2>
                    <p className="text-emerald-100 text-sm">支持多种格式压缩</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!result ? (
                  <>
                    {/* 文件上传区域 */}
                    {!file ? (
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileSelect(f);
                          }}
                          className="hidden"
                        />
                        <svg
                          className="w-12 h-12 mx-auto mb-4 text-primary/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-white font-medium mb-2">
                          点击上传图片或拖拽到此处
                        </p>
                        <p className="text-foreground-muted text-sm">
                          支持 JPG、PNG、WebP 格式，最大 20MB
                        </p>
                      </div>
                    ) : (
                      <div className="mb-6">
                        {/* 图片预览 */}
                        {previewUrl && (
                          <div className="relative mb-4">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="max-h-64 mx-auto rounded-lg"
                            />
                            <button
                              onClick={handleRemoveFile}
                              className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* 文件信息 */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-primary/20 mb-4">
                          <div className="flex items-center space-x-3">
                            <svg
                              className="w-8 h-8 text-emerald-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <p className="font-medium text-white">{file.name}</p>
                              <p className="text-sm text-foreground-muted">
                                {formatBytes(file.size)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 压缩参数设置 */}
                        <div className="space-y-4">
                          {/* 压缩质量 */}
                          <div>
                            <label className="text-sm text-foreground-muted mb-2 block">
                              压缩质量：{quality}%
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="100"
                              value={quality}
                              onChange={(e) => setQuality(Number(e.target.value))}
                              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-xs text-foreground-muted mt-1">
                              <span>低压缩率</span>
                              <span>高压缩率</span>
                            </div>
                          </div>

                          {/* 最大宽度 */}
                          <div>
                            <label className="text-sm text-foreground-muted mb-2 block">
                              最大宽度（可选）
                            </label>
                            <input
                              type="number"
                              placeholder="不限制"
                              value={maxWidth}
                              onChange={(e) => setMaxWidth(e.target.value)}
                              className="w-full px-4 py-2 bg-white/10 border border-primary/20 rounded-lg text-white placeholder-foreground-muted focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          {/* 输出格式 */}
                          <div>
                            <label className="text-sm text-foreground-muted mb-2 block">
                              输出格式
                            </label>
                            <div className="flex space-x-4">
                              {(["jpg", "png", "webp"] as const).map((fmt) => (
                                <label
                                  key={fmt}
                                  className="flex items-center space-x-2 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name="outputFormat"
                                    value={fmt}
                                    checked={outputFormat === fmt}
                                    onChange={() => setOutputFormat(fmt)}
                                    className="w-4 h-4 border-primary/30 bg-white/10 text-emerald-500 focus:ring-emerald-500/50"
                                  />
                                  <span className="text-sm text-foreground-muted">
                                    {fmt.toUpperCase()}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* 保持宽高比 */}
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={keepAspectRatio}
                              onChange={(e) => setKeepAspectRatio(e.target.checked)}
                              className="w-4 h-4 rounded border-primary/30 bg-white/10 text-emerald-500 focus:ring-emerald-500/50"
                            />
                            <span className="text-sm text-foreground-muted">
                              保持宽高比例
                            </span>
                          </label>
                        </div>

                        {/* 压缩按钮 */}
                        <button
                          onClick={handleCompress}
                          disabled={isCompressing}
                          className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {isCompressing ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                              <span>正在压缩...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              <span>开始压缩</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* 压缩结果 */
                  <div className="text-center py-8">
                    {/* 压缩后预览 */}
                    <div className="relative mb-6">
                      <img
                        src={`${process.env.NEXT_PUBLIC_STATIC_URL}${result.downloadUrl}`}
                        alt="Compressed"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                    </div>

                    {/* 对比信息 */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-white/5 rounded-xl border border-primary/20">
                        <p className="text-sm text-foreground-muted mb-1">原始大小</p>
                        <p className="text-lg font-bold text-white">{formatBytes(result.originalSize)}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-primary/20">
                        <p className="text-sm text-foreground-muted mb-1">压缩后</p>
                        <p className="text-lg font-bold text-emerald-400">{formatBytes(result.compressedSize)}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-primary/20">
                        <p className="text-sm text-foreground-muted mb-1">压缩率</p>
                        <p className="text-lg font-bold text-teal-400">{result.compressionRate}</p>
                      </div>
                    </div>

                    {/* 下载按钮 */}
                    <button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mb-4"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>下载压缩后的图片</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-primary/20 rounded-lg text-white transition-colors"
                    >
                      继续压缩其他图片
                    </button>
                  </div>
                )}

                {error && (
                  <div className="mt-4 error-container flex items-start space-x-3 animate-slide-down">
                    <svg
                      className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-400 font-medium">处理失败</p>
                      <p className="text-red-400/70 text-sm mt-1">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: "⚡", label: "极速压缩", desc: "秒级处理" },
                { icon: "🔒", label: "安全保障", desc: "30 分钟删除" },
                { icon: "🎨", label: "多格式支持", desc: "JPG/PNG/WebP" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-4 card-dark rounded-xl border border-primary/10"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="font-medium text-white text-sm">{feature.label}</div>
                  <div className="text-xs text-foreground-muted">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              如何压缩图片
            </h2>
            <p className="text-foreground-muted">简单三步，轻松压缩图片</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border border-emerald-500/20 relative z-10">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-foreground-muted text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
