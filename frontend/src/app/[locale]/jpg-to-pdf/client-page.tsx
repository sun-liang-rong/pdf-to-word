"use client";

import { useState } from "react";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

const faqItems = [
  {
    question: "支持哪些图片格式？",
    answer: "支持 JPG、JPEG、PNG 等常见图片格式，您可以同时上传多张图片合并为一个 PDF 文件。",
  },
  {
    question: "图片顺序可以调整吗？",
    answer: "图片会按照您上传的顺序排列在 PDF 中。建议按所需顺序依次上传图片。",
  },
  {
    question: "多张图片会合并成一个 PDF 吗？",
    answer: "是的，所有上传的图片会按照顺序合并成一个 PDF 文件，每张图片占一页。",
  },
  {
    question: "图片质量会降低吗？",
    answer: "我们尽量保持原图质量，PDF 中的图片会以高质量方式嵌入，不会明显降低画质。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传图片",
    description: "点击或拖拽上传 JPG/PNG 图片，支持多张图片",
    icon: "📤",
  },
  {
    step: 2,
    title: "开始转换",
    description: "系统自动将图片合并转换为 PDF",
    icon: "⚙️",
  },
  {
    step: 3,
    title: "下载 PDF",
    description: "转换完成后下载合并后的 PDF 文件",
    icon: "📥",
  },
];

export default function JpgToPdfClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setTaskId(null);
    setDownloadUrl(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "jpg-to-pdf");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/convert`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTaskId(response.data.taskId);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "上传失败，请检查文件格式后重试"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleComplete = (url: string) => {
    setDownloadUrl(url);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleReset = () => {
    setSelectedFile(null);
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
            <span className="text-white font-medium">JPG 转 PDF</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">🖼️</span>
                <span className="text-primary-300">图片转 PDF</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                JPG 转 PDF 在线转换器
              </h1>
              <p className="text-lg text-foreground-muted">
                免费将 JPG/PNG 图片转换为 PDF 文件，支持多图合并，保持高清画质
              </p>
            </div>

            <div className="card-dark rounded-3xl overflow-hidden border border-primary/20">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    📷
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">开始转换</h2>
                    <p className="text-orange-100 text-sm">支持 JPG/PNG 转 PDF</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!taskId && !downloadUrl && (
                  <>
                    <FileUploader
                      accept={{
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                      }}
                      maxSize={20 * 1024 * 1024}
                      onFileSelect={handleFileSelect}
                      isUploading={isUploading}
                    />

                    {selectedFile && !taskId && (
                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-primary/20 flex items-center space-x-3 animate-fade-in">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-foreground-muted">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}

                {taskId && !downloadUrl && (
                  <ConversionProgress
                    taskId={taskId}
                    onComplete={handleComplete}
                    onError={handleError}
                  />
                )}

                {downloadUrl && (
                  <DownloadButton
                    downloadUrl={downloadUrl}
                    fileName={selectedFile?.name.replace(/\.(jpg|jpeg|png)$/i, ".pdf") || "converted.pdf"}
                    onReset={handleReset}
                  />
                )}

                {error && (
                  <div className="error-container flex items-start space-x-3 animate-slide-down">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-400 font-medium">转换失败</p>
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
                { icon: "⚡", label: "极速转换", desc: "15 秒内完成" },
                { icon: "🔒", label: "安全保障", desc: "30 分钟删除" },
                { icon: "🎨", label: "高清输出", desc: "保持原画质" },
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
              如何将图片转换为 PDF
            </h2>
            <p className="text-foreground-muted">简单三步，轻松完成转换</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border border-orange-500/20 relative z-10">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-lg">
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
