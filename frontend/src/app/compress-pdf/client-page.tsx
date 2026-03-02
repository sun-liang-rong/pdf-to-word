"use client";

import { useState } from "react";
import FileUploader from "@/components/upload/FileUploader";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

const faqItems = [
  {
    question: "PDF 压缩后会损失质量吗？",
    answer: "压缩程度取决于您选择的优化等级。级别 1-2 几乎不损失质量，级别 3-4 可能会有轻微质量损失，但文件大小会显著减小。",
  },
  {
    question: "什么是线性化 PDF？",
    answer: "线性化（Fast Web View）是一种 PDF 优化技术，使 PDF 文件可以在网页中边下载边显示，无需等待整个文件下载完成，适合网页快速预览。",
  },
  {
    question: "高对比度线稿转换有什么用途？",
    answer: "线稿转换可以将 PDF 中的图像转换为高对比度的线条图，适合用于打印、复印或需要清晰线条的场景，如建筑图纸、工程图等。",
  },
  {
    question: "期望输出大小一定能达到吗？",
    answer: "系统会尽量将文件压缩到您指定的大小，但实际结果取决于原始文件的内容。如果原始文件已经很小，可能无法进一步压缩到目标大小。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传 PDF 文件",
    description: "拖拽或点击上传需要压缩的 PDF 文件",
    icon: "📤",
  },
  {
    step: 2,
    title: "配置压缩选项",
    description: "选择优化等级和其他压缩参数",
    icon: "⚙️",
  },
  {
    step: 3,
    title: "下载压缩文件",
    description: "点击压缩按钮，下载压缩后的 PDF",
    icon: "📥",
  },
];

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [optimizeLevel, setOptimizeLevel] = useState(2);
  const [expectedOutputSize, setExpectedOutputSize] = useState("");
  const [linearize, setLinearize] = useState(false);
  const [normalize, setNormalize] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [lineArt, setLineArt] = useState(false);
  const [lineArtThreshold, setLineArtThreshold] = useState(50);
  const [lineArtEdgeLevel, setLineArtEdgeLevel] = useState(2);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setTaskId(null);
    setDownloadUrl(null);
  };

  const handleCompress = async () => {
    if (!file) {
      setError("请先上传 PDF 文件");
      return;
    }

    setIsUploading(true);
    setError(null);
    setTaskId(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("optimizeLevel", String(optimizeLevel));
      if (expectedOutputSize) {
        formData.append("expectedOutputSize", expectedOutputSize);
      }
      formData.append("linearize", String(linearize));
      formData.append("normalize", String(normalize));
      formData.append("grayscale", String(grayscale));
      formData.append("lineArt", String(lineArt));
      formData.append("lineArtThreshold", String(lineArtThreshold));
      formData.append("lineArtEdgeLevel", String(lineArtEdgeLevel));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/convert/compress`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTaskId(response.data.taskId);
      setDownloadUrl(`/api/download/${response.data.taskId}`);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError(err.response?.data?.message || "今日转换次数已用完，请明日再来");
      } else {
        setError(
          err.response?.data?.message || "压缩失败，请检查文件后重试"
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTaskId(null);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 tech-grid opacity-20" />
        
        <div className="relative container mx-auto px-4 py-16">
          <nav className="flex items-center space-x-2 text-sm text-foreground-muted mb-8">
            <a href="/" className="hover:text-primary-400 transition-colors">首页</a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">PDF 压缩</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">📦</span>
                <span className="text-primary-300">PDF 工具</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                PDF 压缩在线工具
              </h1>
              <p className="text-lg text-foreground-muted">
                免费压缩 PDF 文件，支持多种压缩选项，减小文件大小便于分享和存储
              </p>
            </div>

            <div className="card-dark rounded-3xl overflow-hidden border border-primary/20">
              <div className="bg-gradient-to-r from-teal-500 to-accent-cyan px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">开始压缩</h2>
                    <p className="text-teal-100 text-sm">多种压缩级别可选</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!downloadUrl ? (
                  <>
                    {!file ? (
                      <FileUploader
                        accept={{ "application/pdf": [".pdf"] }}
                        maxSize={20 * 1024 * 1024}
                        onFileSelect={handleFileSelect}
                        isUploading={isUploading}
                      />
                    ) : (
                      <div className="mb-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-primary/20">
                          <div className="flex items-center space-x-3">
                            <svg
                              className="w-8 h-8 text-teal-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="font-medium text-white">{file.name}</p>
                              <p className="text-sm text-foreground-muted">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setFile(null)}
                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
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
                      </div>
                    )}

                    {file && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-primary/20">
                          <h3 className="text-sm font-semibold text-white mb-3">压缩选项</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-foreground-muted mb-2 block">优化等级：{optimizeLevel}</label>
                              <input
                                type="range"
                                min="1"
                                max="4"
                                value={optimizeLevel}
                                onChange={(e) => setOptimizeLevel(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                              <div className="flex justify-between text-xs text-foreground-muted mt-1">
                                <span>低压缩</span>
                                <span>高压缩</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={linearize}
                                  onChange={(e) => setLinearize(e.target.checked)}
                                  className="w-4 h-4 rounded border-primary/30 bg-white/10 text-primary focus:ring-primary/50"
                                />
                                <span className="text-sm text-foreground-muted">线性化</span>
                              </label>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={normalize}
                                  onChange={(e) => setNormalize(e.target.checked)}
                                  className="w-4 h-4 rounded border-primary/30 bg-white/10 text-primary focus:ring-primary/50"
                                />
                                <span className="text-sm text-foreground-muted">标准化</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleCompress}
                          disabled={isUploading}
                          className="w-full bg-gradient-to-r from-teal-500 to-accent-cyan hover:from-teal-400 hover:to-accent-cyan/80 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                              <span>正在压缩...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              <span>压缩 PDF 文件</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <DownloadButton
                    downloadUrl={downloadUrl}
                    fileName={file?.name?.replace(/\.pdf$/i, "_compressed.pdf") || "compressed.pdf"}
                    onReset={handleReset}
                  />
                )}

                {error && (
                  <div className="mt-4 error-container flex items-start space-x-3 animate-slide-down">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-400 font-medium">压缩失败</p>
                      <p className="text-red-400/70 text-sm mt-1">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: "📦", label: "智能压缩", desc: "多种级别" },
                { icon: "⚡", label: "快速处理", desc: "本地优化" },
                { icon: "🔒", label: "安全保障", desc: "30 分钟删除" },
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 card-dark rounded-xl border border-primary/10">
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
              如何压缩 PDF 文件
            </h2>
            <p className="text-foreground-muted">简单三步，轻松完成压缩</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-500/20 to-accent-cyan/20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border border-teal-500/20 relative z-10">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-accent-cyan text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-lg">
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
