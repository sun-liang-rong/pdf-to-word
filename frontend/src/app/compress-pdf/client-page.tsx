"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import CompressOptions from "@/components/compress/CompressOptions";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

const faqItems = [
  {
    question: "PDF压缩后会损失质量吗？",
    answer: "压缩程度取决于您选择的优化等级。级别1-2几乎不损失质量，级别3-4可能会有轻微质量损失，但文件大小会显著减小。",
  },
  {
    question: "什么是线性化PDF？",
    answer: "线性化（Fast Web View）是一种PDF优化技术，使PDF文件可以在网页中边下载边显示，无需等待整个文件下载完成，适合网页快速预览。",
  },
  {
    question: "高对比度线稿转换有什么用途？",
    answer: "线稿转换可以将PDF中的图像转换为高对比度的线条图，适合用于打印、复印或需要清晰线条的场景，如建筑图纸、工程图等。",
  },
  {
    question: "期望输出大小一定能达到吗？",
    answer: "系统会尽量将文件压缩到您指定的大小，但实际结果取决于原始文件的内容。如果原始文件已经很小，可能无法进一步压缩到目标大小。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传PDF文件",
    description: "拖拽或点击上传需要压缩的PDF文件",
  },
  {
    step: 2,
    title: "配置压缩选项",
    description: "选择优化等级和其他压缩参数",
  },
  {
    step: 3,
    title: "下载压缩文件",
    description: "点击压缩按钮，下载压缩后的PDF",
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError(null);
        setTaskId(null);
        setDownloadUrl(null);
      }
    },
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
    disabled: isUploading,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        setError("文件大小超过限制 (最大 20MB)");
      } else if (err?.code === "file-invalid-type") {
        setError("只支持PDF文件");
      } else {
        setError("文件上传失败，请重试");
      }
    },
  });

  const handleCompress = async () => {
    if (!file) {
      setError("请先上传PDF文件");
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
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            PDF压缩在线工具
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            免费压缩PDF文件，支持多种压缩选项，减小文件大小便于分享和存储
          </p>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            {!taskId && !downloadUrl && (
              <>
                {/* 文件上传区域 */}
                {!file ? (
                  <div
                    {...getRootProps()}
                    className={clsx(
                      "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all relative min-h-[200px] flex flex-col items-center justify-center",
                      isDragActive
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:border-primary-400 hover:bg-gray-50",
                      isUploading && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <input {...getInputProps()} disabled={isUploading} />

                    {isUploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                        <p className="text-primary-600 font-medium">正在压缩PDF文件...</p>
                      </div>
                    )}

                    <svg
                      className="w-16 h-16 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {isDragActive ? (
                      <p className="text-lg text-primary-600 font-medium">
                        释放文件以上传
                      </p>
                    ) : (
                      <>
                        <p className="text-lg text-gray-700 font-medium mb-2">
                          拖拽PDF文件到此处，或点击选择文件
                        </p>
                        <p className="text-sm text-gray-500">
                          最大文件大小: 20MB
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-8 h-8 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9v6h2v-4h1a2 2 0 000-4h-3zm2 2v-1h1v1h-1z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-red-500 hover:text-red-700 p-2"
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

                {/* 压缩选项 */}
                {file && (
                  <CompressOptions
                    optimizeLevel={optimizeLevel}
                    expectedOutputSize={expectedOutputSize}
                    linearize={linearize}
                    normalize={normalize}
                    grayscale={grayscale}
                    lineArt={lineArt}
                    lineArtThreshold={lineArtThreshold}
                    lineArtEdgeLevel={lineArtEdgeLevel}
                    onOptimizeLevelChange={setOptimizeLevel}
                    onExpectedOutputSizeChange={setExpectedOutputSize}
                    onLinearizeChange={setLinearize}
                    onNormalizeChange={setNormalize}
                    onGrayscaleChange={setGrayscale}
                    onLineArtChange={setLineArt}
                    onLineArtThresholdChange={setLineArtThreshold}
                    onLineArtEdgeLevelChange={setLineArtEdgeLevel}
                  />
                )}

                {/* 压缩按钮 */}
                {file && (
                  <button
                    onClick={handleCompress}
                    disabled={isUploading}
                    className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "正在压缩..." : "压缩PDF文件"}
                  </button>
                )}
              </>
            )}

            {/* 下载按钮 */}
            {downloadUrl && (
              <DownloadButton
                downloadUrl={downloadUrl}
                fileName={file?.name?.replace(/\.pdf$/i, "_compressed.pdf") || "compressed.pdf"}
                onReset={handleReset}
              />
            )}

            {/* 错误提示 */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 使用步骤 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            如何压缩PDF文件
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
