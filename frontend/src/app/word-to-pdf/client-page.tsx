"use client";

import { useState } from "react";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

const faqItems = [
  {
    question: "Word转PDF后格式会变化吗？",
    answer: "我们的转换引擎能够完美保留Word文档的格式、图片、表格和排版，转换后的PDF文件与原文档保持高度一致。",
  },
  {
    question: "支持哪些Word格式？",
    answer: "支持.doc和.docx两种Word格式，推荐使用.docx格式以获得最佳转换效果。",
  },
  {
    question: "Word中的图片会丢失吗？",
    answer: "不会。转换过程会完整保留Word文档中的所有图片、图表和图形元素。",
  },
  {
    question: "转换后的PDF可以编辑吗？",
    answer: "PDF格式本身不易编辑，这是其作为文档交换格式的优势。如需编辑，建议保留原始Word文件。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传Word文件",
    description: "点击或拖拽上传您的Word文件(.doc/.docx)，最大20MB",
  },
  {
    step: 2,
    title: "开始转换",
    description: "系统自动识别并开始转换为PDF格式",
  },
  {
    step: 3,
    title: "下载PDF文件",
    description: "转换完成后点击下载按钮获取PDF文档",
  },
];

export default function WordToPdfClient() {
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
      formData.append("type", "word-to-pdf");

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

  const getOutputFileName = () => {
    if (!selectedFile) return "converted.pdf";
    const name = selectedFile.name;
    return name.replace(/\.(doc|docx)$/i, ".pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-green-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Word转PDF在线转换器
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            免费将Word文档(.doc/.docx)转换为PDF格式，完美保留原有排版和格式
          </p>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            {!taskId && !downloadUrl && (
              <>
                <FileUploader
                  accept={{
                    "application/msword": [".doc"],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                  }}
                  maxSize={20 * 1024 * 1024}
                  onFileSelect={handleFileSelect}
                  isUploading={isUploading}
                />

                {selectedFile && !taskId && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      已选择: <span className="font-medium">{selectedFile.name}</span>
                    </p>
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
                fileName={getOutputFileName()}
                onReset={handleReset}
              />
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            如何将Word转换为PDF
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
