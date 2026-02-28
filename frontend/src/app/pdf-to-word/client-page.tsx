"use client";

import { useState } from "react";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

const faqItems = [
  {
    question: "PDF转Word后格式会乱吗？",
    answer: "我们的转换引擎采用先进的OCR技术和格式识别算法，能够最大程度保留原文档的排版、图片和表格。对于大多数标准PDF文档，转换后的Word文件格式保持良好。",
  },
  {
    question: "PDF转Word支持批量转换吗？",
    answer: "目前每次只能转换一个文件。如需批量转换，建议逐个上传转换，或者关注我们后续的批量转换功能更新。",
  },
  {
    question: "扫描版PDF能转换吗？",
    answer: "可以。我们的系统支持OCR识别，能够将扫描版PDF转换为可编辑的Word文档。但识别效果取决于扫描件的清晰度。",
  },
  {
    question: "转换需要多长时间？",
    answer: "通常10MB以内的PDF文件转换时间不超过15秒。文件越大、页数越多，转换时间会相应增加。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传PDF文件",
    description: "点击或拖拽上传您的PDF文件，支持最大20MB",
    icon: "📤",
  },
  {
    step: 2,
    title: "自动转换",
    description: "系统自动识别并开始转换，无需额外操作",
    icon: "⚙️",
  },
  {
    step: 3,
    title: "下载Word文件",
    description: "转换完成后点击下载按钮获取Word文档",
    icon: "📥",
  },
];

export default function PdfToWordClient() {
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
      formData.append("type", "pdf-to-word");
      
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
      if (err.response?.status === 429) {
        setError(err.response?.data?.message || "今日转换次数已用完，请明日再来");
      } else {
        setError(
          err.response?.data?.message || "上传失败，请检查文件格式后重试"
        );
      }
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        <div className="relative container mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-primary-600 transition-colors">首页</a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">PDF转Word</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">📄</span>
                格式转换
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                PDF转Word在线转换器
              </h1>
              <p className="text-lg text-gray-600">
                免费将PDF文件转换为可编辑的Word文档(.docx)，保留原有格式和排版
              </p>
            </div>

            {/* Converter Card */}
            <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    📝
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">开始转换</h2>
                    <p className="text-primary-100 text-sm">支持 PDF 转 Word (.docx)</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                {!taskId && !downloadUrl && (
                  <div className="space-y-6">
                    <FileUploader
                      accept={{
                        "application/pdf": [".pdf"],
                      }}
                      maxSize={20 * 1024 * 1024}
                      onFileSelect={handleFileSelect}
                      isUploading={isUploading}
                    />

                    {selectedFile && !taskId && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center space-x-3 animate-fade-in">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
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
                    fileName={selectedFile?.name.replace(".pdf", ".docx") || "converted.docx"}
                    onReset={handleReset}
                  />
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-slide-down">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-700 font-medium">转换失败</p>
                      <p className="text-red-600/70 text-sm mt-1">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: "⚡", label: "极速转换", desc: "15秒内完成" },
                { icon: "🔒", label: "安全保障", desc: "30分钟删除" },
                { icon: "🎯", label: "精准还原", desc: "保留原格式" },
              ].map((feature, index) => (
                <div key={index} className="text-center p-4">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="font-medium text-gray-900 text-sm">{feature.label}</div>
                  <div className="text-xs text-gray-500">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              如何将PDF转换为Word
            </h2>
            <p className="text-gray-600">简单三步，轻松完成转换</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200" />

              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm relative z-10">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ items={faqItems} />
    </div>
  );
}
