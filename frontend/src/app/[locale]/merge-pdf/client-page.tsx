"use client";

import { useState } from "react";
import MultiFileUploader from "@/components/upload/MultiFileUploader";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

interface FileItem {
  id: string;
  file: File;
}

const faqItems = [
  {
    question: "PDF 合并后文件会变大吗？",
    answer: "合并后的 PDF 文件大小通常接近所有原始文件大小的总和。我们的系统会尽量优化文件大小，但不会损失文件质量。",
  },
  {
    question: "最多可以合并多少个 PDF 文件？",
    answer: "目前支持最多 20 个 PDF 文件同时合并，每个文件最大 20MB。如有更大需求，建议分批合并。",
  },
  {
    question: "合并后的 PDF 文件顺序是怎样的？",
    answer: "默认按照您上传的顺序进行合并。您也可以在选项中选择按文件名或修改时间排序，或直接拖拽调整顺序。",
  },
  {
    question: "什么是生成目录功能？",
    answer: "启用此选项后，系统会在合并后的 PDF 开头自动生成一个目录页，使用每个原始 PDF 的文件名作为章节标题，方便导航。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传 PDF 文件",
    description: "拖拽或点击上传多个 PDF 文件",
    icon: "📤",
  },
  {
    step: 2,
    title: "调整顺序",
    description: "拖拽文件调整合并顺序，配置选项",
    icon: "🔀",
  },
  {
    step: 3,
    title: "下载合并文件",
    description: "点击合并按钮，下载合并后的 PDF",
    icon: "📥",
  },
];

export default function MergePdfClient() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [sortType, setSortType] = useState("order");
  const [removeCertSign, setRemoveCertSign] = useState(false);
  const [generateToc, setGenerateToc] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesChange = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    setError(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("至少需要上传 2 个 PDF 文件");
      return;
    }

    setIsUploading(true);
    setError(null);
    setTaskId(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      files.forEach((fileItem) => {
        formData.append("files", fileItem.file);
      });
      formData.append("sortType", sortType);
      formData.append("removeCertSign", String(removeCertSign));
      formData.append("generateToc", String(generateToc));
      formData.append("clientFileIds", files.map(f => f.id).join(","));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/convert/merge`,
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
          err.response?.data?.message || "合并失败，请检查文件后重试"
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
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
            <span className="text-white font-medium">PDF 合并</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">📑</span>
                <span className="text-primary-300">PDF 工具</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                PDF 合并在线工具
              </h1>
              <p className="text-lg text-foreground-muted">
                免费将多个 PDF 文件合并为一个 PDF 文件，支持拖拽排序、生成目录
              </p>
            </div>

            <div className="card-dark rounded-3xl overflow-hidden border border-primary/20">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    📑
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">开始合并</h2>
                    <p className="text-red-100 text-sm">支持拖拽调整 PDF 顺序</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!downloadUrl ? (
                  <>
                    <MultiFileUploader
                      maxSize={20 * 1024 * 1024}
                      onFilesChange={handleFilesChange}
                      isUploading={isUploading}
                    />

                    {files.length >= 2 && (
                      <div className="mt-6 space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-primary/20">
                          <h3 className="text-sm font-semibold text-white mb-3">合并选项</h3>
                          <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={generateToc}
                                onChange={(e) => setGenerateToc(e.target.checked)}
                                className="w-4 h-4 rounded border-primary/30 bg-white/10 text-primary focus:ring-primary/50"
                              />
                              <span className="text-sm text-foreground-muted">生成目录页</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={removeCertSign}
                                onChange={(e) => setRemoveCertSign(e.target.checked)}
                                className="w-4 h-4 rounded border-primary/30 bg-white/10 text-primary focus:ring-primary/50"
                              />
                              <span className="text-sm text-foreground-muted">移除证书签名</span>
                            </label>
                          </div>
                        </div>

                        <button
                          onClick={handleMerge}
                          disabled={isUploading || files.length < 2}
                          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                              <span>正在合并...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              <span>合并 PDF 文件</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <DownloadButton
                    downloadUrl={downloadUrl}
                    fileName="merged.pdf"
                    onReset={handleReset}
                  />
                )}

                {error && (
                  <div className="mt-4 error-container flex items-start space-x-3 animate-slide-down">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-400 font-medium">合并失败</p>
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
                { icon: "📑", label: "多文件合并", desc: "最多 20 个" },
                { icon: "🔀", label: "拖拽排序", desc: "灵活调整" },
                { icon: "📖", label: "自动目录", desc: "可选生成" },
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
              如何合并 PDF 文件
            </h2>
            <p className="text-foreground-muted">简单三步，轻松完成合并</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border border-red-500/20 relative z-10">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-lg">
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
