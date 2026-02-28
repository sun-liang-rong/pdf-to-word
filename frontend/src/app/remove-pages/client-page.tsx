"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import PageSelector from "@/components/remove-pages/PageSelector";
import PageExpressionInput from "@/components/remove-pages/PageExpressionInput";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";
import { getPDFPageCount } from "@/lib/pdf-utils";

const faqItems = [
  {
    question: "删除页面后原文件会改变吗？",
    answer: "不会。删除页面操作会生成一个新的PDF文件，原文件保持不变。您可以放心使用。",
  },
  {
    question: "可以删除所有页面吗？",
    answer: "不可以。PDF文件至少需要保留一页，如果您尝试删除所有页面，系统会提示错误。",
  },
  {
    question: "页面表达式怎么使用？",
    answer: "您可以使用表达式快速选择页面：'1,3,5'表示第1、3、5页；'2-6'表示第2到6页；'2n'表示所有偶数页；'2n+1'表示所有奇数页。",
  },
  {
    question: "删除页面后文件大小会变小吗？",
    answer: "通常会的。删除页面后，新文件的大小会相应减小，具体取决于删除页面中的内容。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传PDF文件",
    description: "拖拽或点击上传需要处理的PDF文件",
  },
  {
    step: 2,
    title: "选择要删除的页面",
    description: "点击页面编号或输入表达式选择",
  },
  {
    step: 3,
    title: "下载新文件",
    description: "点击删除按钮，下载处理后的PDF",
  },
];

export default function RemovePagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expressionError, setExpressionError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setError(null);
        setTaskId(null);
        setDownloadUrl(null);
        setSelectedPages([]);
        
        // 使用 PDF.js 获取 PDF 文件的真实页数
        try {
          const pages = await getPDFPageCount(selectedFile);
          setPageCount(pages);
        } catch (err: any) {
          setError("无法读取 PDF 文件，请检查文件是否损坏");
          setPageCount(0);
        }
      }
    },
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
    disabled: isUploading || isLoading,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        setError("文件大小超过限制 (最大 20MB)");
      } else if (err?.code === "file-invalid-type") {
        setError("只支持 PDF 文件");
      } else {
        setError("文件上传失败，请重试");
      }
    },
  });

  const handleSelectionChange = (pages: number[]) => {
    setSelectedPages(pages);
  };

  const handleExpressionChange = (pages: number[]) => {
    setSelectedPages(pages);
  };

  const handleExpressionError = (err: string | null) => {
    setExpressionError(err);
  };

  const generatePageNumbers = (pages: number[]): string => {
    if (pages.length === 0) return "";
    
    const sorted = [...pages].sort((a, b) => a - b);
    const result: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        result.push(start === end ? `${start}` : `${start}-${end}`);
        start = sorted[i];
        end = sorted[i];
      }
    }
    result.push(start === end ? `${start}` : `${start}-${end}`);

    return result.join(",");
  };

  const handleRemovePages = async () => {
    if (!file) {
      setError("请先上传PDF文件");
      return;
    }

    if (selectedPages.length === 0) {
      setError("请选择要删除的页面");
      return;
    }

    if (selectedPages.length >= pageCount) {
      setError("不能删除所有页面，PDF至少需要保留一页");
      return;
    }

    setIsUploading(true);
    setError(null);
    setTaskId(null);
    setDownloadUrl(null);

    try {
      const pageNumbers = generatePageNumbers(selectedPages);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageNumbers", pageNumbers);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/convert/remove-pages`,
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
          err.response?.data?.message || "删除页面失败，请检查文件后重试"
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setSelectedPages([]);
    setTaskId(null);
    setDownloadUrl(null);
    setError(null);
    setExpressionError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            PDF删除页面
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            免费在线删除PDF中的指定页面，支持可视化选择或表达式输入
          </p>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
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
                      (isUploading || isLoading) && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <input {...getInputProps()} disabled={isUploading || isLoading} />

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
                  <div className="space-y-6">
                    {/* 文件信息 */}
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
                            {(file.size / 1024 / 1024).toFixed(2)} MB · {pageCount} 页
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleReset}
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

                    {/* 页面表达式输入 */}
                    <PageExpressionInput
                      pageCount={pageCount}
                      onExpressionChange={handleExpressionChange}
                      onError={handleExpressionError}
                    />

                    {/* 页面选择器 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        选择要删除的页面
                      </h3>
                      <PageSelector
                        file={file}
                        pageCount={pageCount}
                        selectedPages={selectedPages}
                        onSelectionChange={handleSelectionChange}
                      />
                    </div>

                    {/* 删除确认 */}
                    {selectedPages.length > 0 && selectedPages.length < pageCount && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">
                          将删除 <span className="font-semibold">{selectedPages.length}</span> 页，
                          生成包含 <span className="font-semibold">{pageCount - selectedPages.length}</span> 页的新文件
                        </p>
                      </div>
                    )}

                    {/* 删除按钮 */}
                    <button
                      onClick={handleRemovePages}
                      disabled={
                        isUploading ||
                        selectedPages.length === 0 ||
                        selectedPages.length >= pageCount ||
                        !!expressionError
                      }
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? "正在处理..." : `删除 ${selectedPages.length} 个页面`}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 下载按钮 */}
            {downloadUrl && (
              <DownloadButton
                downloadUrl={downloadUrl}
                fileName={file?.name?.replace(/\.pdf$/i, "_removed.pdf") || "removed.pdf"}
                onReset={handleReset}
              />
            )}

            {/* 错误提示 */}
            {(error || expressionError) && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error || expressionError}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 使用步骤 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            如何删除PDF页面
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
