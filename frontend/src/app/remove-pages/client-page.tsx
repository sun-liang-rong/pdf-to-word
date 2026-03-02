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
  { step: 1, title: "上传PDF文件", description: "拖拽或点击上传需要处理的PDF文件", icon: "📤" },
  { step: 2, title: "选择要删除的页面", description: "点击页面编号或输入表达式选择", icon: "✂️" },
  { step: 3, title: "下载新文件", description: "点击删除按钮，下载处理后的PDF", icon: "📥" },
];

export default function RemovePagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expressionError, setExpressionError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setError(null);
        setDownloadUrl(null);
        setSelectedPages([]);
        
        try {
          const pages = await getPDFPageCount(selectedFile);
          setPageCount(pages);
        } catch {
          setError("无法读取 PDF 文件，请检查文件是否损坏");
          setPageCount(0);
        }
      }
    },
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
    disabled: isUploading,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") setError("文件大小超过限制 (最大 20MB)");
      else if (err?.code === "file-invalid-type") setError("只支持 PDF 文件");
      else setError("文件上传失败，请重试");
    },
  });

  const handleSelectionChange = (pages: number[]) => setSelectedPages(pages);
  const handleExpressionChange = (pages: number[]) => setSelectedPages(pages);
  const handleExpressionError = (err: string | null) => setExpressionError(err);

  const generatePageNumbers = (pages: number[]): string => {
    if (pages.length === 0) return "";
    const sorted = [...pages].sort((a, b) => a - b);
    const result: string[] = [];
    let start = sorted[0], end = sorted[0];
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) { end = sorted[i]; }
      else { result.push(start === end ? `${start}` : `${start}-${end}`); start = end = sorted[i]; }
    }
    result.push(start === end ? `${start}` : `${start}-${end}`);
    return result.join(",");
  };

  const handleRemovePages = async () => {
    if (!file) { setError("请先上传PDF文件"); return; }
    if (selectedPages.length === 0) { setError("请选择要删除的页面"); return; }
    if (selectedPages.length >= pageCount) { setError("不能删除所有页面，PDF至少需要保留一页"); return; }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageNumbers", generatePageNumbers(selectedPages));
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/convert/remove-pages`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setDownloadUrl(`/api/download/${response.data.taskId}`);
    } catch (err: any) {
      if (err.response?.status === 429) setError(err.response?.data?.message || "今日次数已用完");
      else setError(err.response?.data?.message || "删除页面失败");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => { setFile(null); setPageCount(0); setSelectedPages([]); setDownloadUrl(null); setError(null); setExpressionError(null); };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 tech-grid opacity-20" />
        
        <div className="relative container mx-auto px-4 py-16">
          <nav className="flex items-center space-x-2 text-sm text-foreground-muted mb-8">
            <a href="/" className="hover:text-primary-400 transition-colors">首页</a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-white font-medium">PDF 删除页面</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">✂️</span><span className="text-primary-300">PDF 工具</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">PDF 删除页面在线工具</h1>
              <p className="text-lg text-foreground-muted">免费在线删除PDF中的指定页面，支持可视化选择或表达式输入</p>
            </div>

            <div className="card-dark rounded-3xl overflow-hidden border border-primary/20">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">✂️</div>
                  <div>
                    <h2 className="text-white font-bold text-lg">删除页面</h2>
                    <p className="text-pink-100 text-sm">可视化选择或表达式输入</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!downloadUrl ? (
                  <>
                    {!file ? (
                      <div {...getRootProps()} className={clsx("border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all relative min-h-[200px] flex flex-col items-center justify-center upload-zone", isDragActive ? "border-primary-500 bg-primary-500/10" : "border-primary/30 hover:border-primary/50 hover:bg-white/5", isUploading && "opacity-60 cursor-not-allowed")}>
                        <input {...getInputProps()} disabled={isUploading} />
                        <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300", isDragActive ? "bg-primary/20 scale-110" : "bg-white/5 border border-primary/20")}>
                          <svg className="w-8 h-8 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        {isDragActive ? <p className="text-lg text-primary-300 font-medium">释放文件以上传</p> : <><p className="text-lg text-white font-medium mb-2">拖拽 PDF 文件到此处，或点击选择文件</p><p className="text-sm text-foreground-muted">最大文件大小：20MB</p></>}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-primary/20">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0"><svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                            <div><p className="font-medium text-white">{file.name}</p><p className="text-sm text-foreground-muted">{(file.size / 1024 / 1024).toFixed(2)} MB · {pageCount} 页</p></div>
                          </div>
                          <button onClick={handleReset} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>

                        <PageExpressionInput pageCount={pageCount} onExpressionChange={handleExpressionChange} onError={handleExpressionError} />

                        <div><h3 className="text-lg font-semibold text-white mb-3">选择要删除的页面</h3><PageSelector file={file} pageCount={pageCount} selectedPages={selectedPages} onSelectionChange={handleSelectionChange} /></div>

                        {selectedPages.length > 0 && selectedPages.length < pageCount && (
                          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"><p className="text-yellow-400">将删除 <span className="font-semibold">{selectedPages.length}</span> 页，生成包含 <span className="font-semibold">{pageCount - selectedPages.length}</span> 页的新文件</p></div>
                        )}

                        <button onClick={handleRemovePages} disabled={isUploading || selectedPages.length === 0 || selectedPages.length >= pageCount || !!expressionError} className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                          {isUploading ? <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /><span>正在处理...</span></> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span>删除 {selectedPages.length} 个页面</span></>}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <DownloadButton downloadUrl={downloadUrl} fileName={file?.name?.replace(/\.pdf$/i, "_removed.pdf") || "removed.pdf"} onReset={handleReset} />
                )}

                {(error || expressionError) && (
                  <div className="mt-4 error-container flex items-start space-x-3 animate-slide-down">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-red-400">{error || expressionError}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[{ icon: "✂️", label: "精准删除", desc: "可视化选择" }, { icon: "⚡", label: "快速处理", desc: "即时预览" }, { icon: "🔒", label: "安全保障", desc: "30 分钟删除" }].map((feature, index) => (
                <div key={index} className="text-center p-4 card-dark rounded-xl border border-primary/10">
                  <div className="text-2xl mb-2">{feature.icon}</div><div className="font-medium text-white text-sm">{feature.label}</div><div className="text-xs text-foreground-muted">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold text-white mb-4">如何删除 PDF 页面</h2><p className="text-foreground-muted">简单三步，轻松完成</p></div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />
              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border border-pink-500/20 relative z-10">{item.icon}</div>
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-lg">{item.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3><p className="text-foreground-muted text-sm">{item.description}</p>
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
