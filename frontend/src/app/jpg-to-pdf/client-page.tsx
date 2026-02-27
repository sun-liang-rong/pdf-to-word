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
    answer: "支持JPG、JPEG、PNG等常见图片格式，您可以同时上传多张图片合并为一个PDF文件。",
  },
  {
    question: "图片顺序可以调整吗？",
    answer: "图片会按照您上传的顺序排列在PDF中。建议按所需顺序依次上传图片。",
  },
  {
    question: "多张图片会合并成一个PDF吗？",
    answer: "是的，所有上传的图片会按照顺序合并成一个PDF文件，每张图片占一页。",
  },
  {
    question: "图片质量会降低吗？",
    answer: "我们尽量保持原图质量，PDF中的图片会以高质量方式嵌入，不会明显降低画质。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传图片",
    description: "点击或拖拽上传JPG/PNG图片，支持多张图片",
  },
  {
    step: 2,
    title: "开始转换",
    description: "系统自动将图片合并转换为PDF",
  },
  {
    step: 3,
    title: "下载PDF",
    description: "转换完成后下载合并后的PDF文件",
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
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-orange-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            JPG转PDF在线转换器
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            免费将JPG/PNG图片转换为PDF文件，支持多图合并，保持高清画质
          </p>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
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
                fileName={selectedFile?.name.replace(/\.(jpg|jpeg|png)$/i, ".pdf") || "converted.pdf"}
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
            如何将JPG图片转换为PDF
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
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
