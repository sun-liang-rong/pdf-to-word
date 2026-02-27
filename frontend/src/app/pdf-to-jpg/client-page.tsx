"use client";

import { useState } from "react";
import FileUploader from "@/components/upload/FileUploader";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

const faqItems = [
  {
    question: "PDF转JPG后图片清晰吗？",
    answer: "我们提供高质量的图片输出，默认分辨率为150DPI，可以满足大多数使用场景。如需更高清晰度，可以选择高分辨率输出选项。",
  },
  {
    question: "多页PDF怎么处理？",
    answer: "系统会将PDF的每一页转换为单独的JPG图片，并打包成ZIP文件供您下载。",
  },
  {
    question: "支持哪些图片格式？",
    answer: "目前支持JPG和PNG两种输出格式，默认输出JPG格式以获得更小的文件体积。",
  },
  {
    question: "转换后的图片可以商用吗？",
    answer: "转换后的图片版权归原PDF文件所有者所有，请确保您有权使用原PDF文件。",
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
    description: "系统自动将PDF每页转换为JPG图片",
  },
  {
    step: 3,
    title: "下载图片",
    description: "转换完成后下载ZIP压缩包，包含所有图片",
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
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-purple-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            PDF转JPG在线转换器
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            免费将PDF文件的每一页转换为JPG图片，高清输出，支持批量下载
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
                fileName={selectedFile?.name.replace(".pdf", ".zip") || "images.zip"}
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
            如何将PDF转换为JPG图片
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
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
