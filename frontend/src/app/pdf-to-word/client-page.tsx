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
  },
  {
    step: 2,
    title: "开始转换",
    description: "系统自动识别并开始转换，无需额外操作",
  },
  {
    step: 3,
    title: "下载Word文件",
    description: "转换完成后点击下载按钮获取Word文档",
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
      console.log(file, 'file')
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
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            PDF转Word在线转换器
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            免费将PDF文件转换为可编辑的Word文档(.docx)，保留原有格式和排版
          </p>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
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
                fileName={selectedFile?.name.replace(".pdf", ".docx") || "converted.docx"}
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
            如何将PDF转换为Word
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
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
