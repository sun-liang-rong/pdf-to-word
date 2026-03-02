"use client";

import { useState } from "react";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

const faqItems = [
  {
    question: "PDF 转 JPG 后图片清晰吗？",
    answer: "我们提供高质量的图片输出，默认分辨率为 150DPI，可以满足大多数使用场景。如需更高清晰度，可以选择高分辨率输出选项。",
  },
  {
    question: "多页 PDF 怎么处理？",
    answer: "系统会将 PDF 的每一页转换为单独的 JPG 图片，并打包成 ZIP 文件供您下载。",
  },
  {
    question: "支持哪些图片格式？",
    answer: "目前支持 JPG 和 PNG 两种输出格式，默认输出 JPG 格式以获得更小的文件体积。",
  },
  {
    question: "转换后的图片可以商用吗？",
    answer: "转换后的图片版权归原 PDF 文件所有者所有，请确保您有权使用原 PDF 文件。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传 PDF 文件",
    description: "点击或拖拽上传您的 PDF 文件，支持最大 20MB",
    icon: "📤",
  },
  {
    step: 2,
    title: "开始转换",
    description: "系统自动将 PDF 每页转换为 JPG 图片",
    icon: "⚙️",
  },
  {
    step: 3,
    title: "下载图片",
    description: "转换完成后下载 ZIP 压缩包，包含所有图片",
    icon: "📥",
  },
];

export default function PdfToJpgClient() {
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
      formData.append("type", "pdf-to-jpg");

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
            <span className="text-white font-medium">PDF 转 JPG</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">🖼️</span>
                <span className="text-primary-300">PDF 转图片</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                PDF 转 JPG 在线转换器
              </h1>
              <p className="text-lg text-foreground-muted">
                免费将 PDF 文件的每一页转换为 JPG 图片，高清输出，支持批量下载
              </p>
            </div>

            <div className="card-dark rounded-3xl overflow-hidden border border-primary/20">
              <div className="bg-gradient-to-r from-accent-pink to-accent-cyan px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    🖼️
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">开始转换</h2>
                    <p className="text-pink-100 text-sm">支持 PDF 转 JPG/PNG 图片</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!taskId && !downloadUrl && (
                  <>
                    <FileUploader
                      accept={{
                        "application/pdf": [".pdf"],
                      }}
                      maxSize={20 * 1024 * 1024}
                      onFileSelect={handleFileSelect}
                      isUploading={isUploading}
                    />

                    {selectedFile && !taskId && (
                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-primary/20 flex items-center space-x-3 animate-fade-in">
                        <div className="w-10 h-10 bg-accent-pink/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                    fileName={selectedFile?.name.replace(".pdf", ".zip") || "images.zip"}
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
                { icon: "🎨", label: "高清输出", desc: "150DPI" },
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
              如何将 PDF 转换为 JPG
            </h2>
            <p className="text-foreground-muted">简单三步，轻松完成转换</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent-pink/20 to-accent-cyan/20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border border-accent-pink/20 relative z-10">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-pink to-accent-cyan text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-lg">
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
