"use client";

import { useState } from "react";
import MultiFileUploader from "@/components/upload/MultiFileUploader";
import MergeOptions from "@/components/merge/MergeOptions";
import DownloadButton from "@/components/conversion/DownloadButton";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

interface FileItem {
  id: string;
  file: File;
}

const faqItems = [
  {
    question: "PDF合并后文件会变大吗？",
    answer: "合并后的PDF文件大小通常接近所有原始文件大小的总和。我们的系统会尽量优化文件大小，但不会损失文件质量。",
  },
  {
    question: "最多可以合并多少个PDF文件？",
    answer: "目前支持最多20个PDF文件同时合并，每个文件最大20MB。如有更大需求，建议分批合并。",
  },
  {
    question: "合并后的PDF文件顺序是怎样的？",
    answer: "默认按照您上传的顺序进行合并。您也可以在选项中选择按文件名或修改时间排序，或直接拖拽调整顺序。",
  },
  {
    question: "什么是生成目录功能？",
    answer: "启用此选项后，系统会在合并后的PDF开头自动生成一个目录页，使用每个原始PDF的文件名作为章节标题，方便导航。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传PDF文件",
    description: "拖拽或点击上传多个PDF文件",
  },
  {
    step: 2,
    title: "调整顺序",
    description: "拖拽文件调整合并顺序，配置选项",
  },
  {
    step: 3,
    title: "下载合并文件",
    description: "点击合并按钮，下载合并后的PDF",
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
      setError("至少需要上传2个PDF文件");
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
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            PDF合并在线工具
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            免费将多个PDF文件合并为一个PDF文件，支持拖拽排序、生成目录
          </p>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            {!taskId && !downloadUrl && (
              <>
                <MultiFileUploader
                  maxSize={20 * 1024 * 1024}
                  onFilesChange={handleFilesChange}
                  isUploading={isUploading}
                />

                {files.length >= 2 && (
                  <div className="mt-6">
                    <MergeOptions
                      sortType={sortType}
                      removeCertSign={removeCertSign}
                      generateToc={generateToc}
                      onSortTypeChange={setSortType}
                      onRemoveCertSignChange={setRemoveCertSign}
                      onGenerateTocChange={setGenerateToc}
                    />
                  </div>
                )}

                {files.length >= 2 && (
                  <button
                    onClick={handleMerge}
                    disabled={isUploading}
                    className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "正在合并..." : "合并PDF文件"}
                  </button>
                )}
              </>
            )}

            {downloadUrl && (
              <DownloadButton
                downloadUrl={downloadUrl}
                fileName="merged.pdf"
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
            如何合并PDF文件
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
