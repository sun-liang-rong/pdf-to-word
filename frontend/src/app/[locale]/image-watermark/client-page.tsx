"use client";

import { useState, useRef } from "react";
import FAQ from "@/components/seo/FAQ";
import axios from "axios";

interface WatermarkResult {
  url: string;
  width: number;
  height: number;
  size: string;
  originalSize: string;
  downloadUrl: string;
}

const faqItems = [
  {
    question: "支持哪些图片格式？",
    answer: "支持 JPG、JPEG、PNG、WebP 格式的图片添加水印。",
  },
  {
    question: "水印文字有什么限制？",
    answer: "水印文字最多支持 100 个字符，支持中文、英文、数字和常见符号。",
  },
  {
    question: "可以调整水印样式吗？",
    answer: "可以调整字体大小、颜色、透明度、位置和旋转角度，满足不同的水印需求。",
  },
  {
    question: "什么是平铺水印？",
    answer: "平铺水印会将文字重复铺满整个图片，适用于防盗图和防截图场景。",
  },
];

const steps = [
  {
    step: 1,
    title: "上传图片",
    description: "点击或拖拽上传需要添加水印的图片",
    icon: "📤",
  },
  {
    step: 2,
    title: "设置水印",
    description: "输入水印文字并调整样式参数",
    icon: "⚙️",
  },
  {
    step: 3,
    title: "下载图片",
    description: "生成并下载带水印的图片",
    icon: "📥",
  },
];

const positions = [
  { value: "top-left", label: "左上" },
  { value: "top-center", label: "上中" },
  { value: "top-right", label: "右上" },
  { value: "center-left", label: "左中" },
  { value: "center", label: "居中" },
  { value: "center-right", label: "右中" },
  { value: "bottom-left", label: "左下" },
  { value: "bottom-center", label: "下中" },
  { value: "bottom-right", label: "右下" },
];

export default function ImageWatermarkClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#FFFFFF");
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState("bottom-right");
  const [rotation, setRotation] = useState(0);
  const [margin, setMargin] = useState(20);
  const [tile, setTile] = useState(false);
  const [tileSpacing, setTileSpacing] = useState(100);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("仅支持 JPG、PNG、WEBP 格式的图片");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("图片大小不能超过 10MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setText("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleAddWatermark = async () => {
    if (!file) {
      setError("请先上传图片");
      return;
    }

    if (!text.trim()) {
      setError("请输入水印文字");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("text", text.trim());
      formData.append("fontSize", fontSize.toString());
      formData.append("color", color);
      formData.append("opacity", opacity.toString());
      formData.append("position", position);
      formData.append("rotation", rotation.toString());
      formData.append("margin", margin.toString());
      formData.append("tile", tile.toString());
      formData.append("tileSpacing", tileSpacing.toString());

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/image-watermark/text`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setResult(response.data);
      } else {
        setError(response.data || "添加水印失败");
      }
    } catch (err: any) {
      setError(err.response?.data || "添加水印失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.url) {
      const link = document.createElement("a");
      link.href = `${process.env.NEXT_PUBLIC_API_URL}${result.url}`;
      link.download = `watermarked-${file?.name || "image.jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
            <span className="text-white font-medium">图片加水印</span>
          </nav>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-4">
                <span className="mr-2">🖼️</span>
                <span className="text-primary-300">图片工具</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                图片加水印工具
              </h1>
              <p className="text-lg text-foreground-muted">
                免费为图片添加文字水印，支持自定义样式、位置、透明度和旋转角度
              </p>
            </div>

            <div className="card-dark rounded-3xl overflow-hidden border border-primary/20">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    💧
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">添加水印</h2>
                    <p className="text-primary-200 text-sm">支持 JPG、PNG、WebP 格式</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {!result && (
                  <div className="space-y-6">
                    {/* 文件上传区域 */}
                    {!file ? (
                      <div
                        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                          isDragging
                            ? "border-primary-400 bg-primary/10"
                            : "border-primary/30 hover:border-primary/50 bg-white/5"
                        }`}
                        onClick={() => imageInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const droppedFile = e.dataTransfer.files[0];
                          if (droppedFile) handleFileSelect(droppedFile);
                        }}
                      >
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (selectedFile) handleFileSelect(selectedFile);
                          }}
                          className="hidden"
                        />
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 border border-primary/20">
                          📷
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          点击或拖拽上传图片
                        </h3>
                        <p className="text-foreground-muted text-sm">
                          支持 JPG、PNG、WEBP 格式，最大 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* 图片预览 */}
                        <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-black/20">
                          <img
                            src={previewUrl || ""}
                            alt="预览"
                            className="w-full h-auto max-h-[300px] object-contain mx-auto"
                          />
                        </div>
                        
                        {/* 文件信息 */}
                        <div className="p-4 bg-white/5 rounded-xl border border-primary/20 flex items-center space-x-3 animate-fade-in">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-foreground-muted">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            onClick={handleRemoveFile}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 水印设置 */}
                    {file && (
                      <div className="space-y-6 pt-4 border-t border-primary/20">
                        {/* 水印文字 */}
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            水印文字 <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="请输入水印内容"
                            maxLength={100}
                            className="w-full px-4 py-3 bg-white/5 border border-primary/30 rounded-xl text-white placeholder-foreground-muted focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                          <p className="mt-1 text-xs text-foreground-muted">
                            {text.length}/100 字符
                          </p>
                        </div>

                        {/* 字体大小 */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-white">字体大小</label>
                            <span className="text-sm text-primary-300">{fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={200}
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-thumb"
                          />
                        </div>

                        {/* 颜色和透明度 */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              字体颜色
                            </label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-12 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                              />
                              <span className="text-sm text-foreground-muted">{color}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium text-white">透明度</label>
                              <span className="text-sm text-primary-300">{Math.round(opacity * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min={0.1}
                              max={1}
                              step={0.1}
                              value={opacity}
                              onChange={(e) => setOpacity(Number(e.target.value))}
                              className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                          </div>
                        </div>

                        {/* 位置 */}
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            水印位置
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {positions.map((pos) => (
                              <button
                                key={pos.value}
                                onClick={() => setPosition(pos.value)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  position === pos.value
                                    ? "bg-primary-500 text-white"
                                    : "bg-white/5 text-foreground-muted hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {pos.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 旋转和边距 */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium text-white">旋转角度</label>
                              <span className="text-sm text-primary-300">{rotation}°</span>
                            </div>
                            <input
                              type="range"
                              min={-180}
                              max={180}
                              value={rotation}
                              onChange={(e) => setRotation(Number(e.target.value))}
                              className="w-full h-2 bg-gray-200 dark:bg-primary/30 rounded-lg appearance-none cursor-pointer accent-primary-500 slider-thumb"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium text-white">边距</label>
                              <span className="text-sm text-primary-300">{margin}px</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={200}
                              value={margin}
                              onChange={(e) => setMargin(Number(e.target.value))}
                              className="w-full h-2 bg-gray-200 dark:bg-primary/30 rounded-lg appearance-none cursor-pointer accent-primary-500 slider-thumb"
                            />
                          </div>
                        </div>

                        {/* 平铺模式 */}
                        <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-primary/20">
                          <input
                            type="checkbox"
                            id="tile"
                            checked={tile}
                            onChange={(e) => setTile(e.target.checked)}
                            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 bg-white/10 border-primary/30"
                          />
                          <label htmlFor="tile" className="text-sm font-medium text-white">
                            平铺水印（重复铺满整个图片）
                          </label>
                        </div>

                        {/* 平铺间距 */}
                        {tile && (
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium text-white">平铺间距</label>
                              <span className="text-sm text-primary-300">{tileSpacing}px</span>
                            </div>
                            <input
                              type="range"
                              min={50}
                              max={500}
                              value={tileSpacing}
                              onChange={(e) => setTileSpacing(Number(e.target.value))}
                              className="w-full h-2 bg-gray-200 dark:bg-primary/30 rounded-lg appearance-none cursor-pointer accent-primary-500 slider-thumb"
                            />
                          </div>
                        )}

                        {/* 添加水印按钮 */}
                        <button
                          onClick={handleAddWatermark}
                          disabled={isProcessing || !text.trim()}
                          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-primary hover:shadow-primary-lg"
                        >
                          {isProcessing ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              处理中...
                            </span>
                          ) : (
                            "添加水印"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 结果展示 */}
                {result && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="p-6 bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-2xl border border-primary/30">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-2xl shadow-glow">
                          ✨
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">水印添加成功！</h3>
                          <p className="text-sm text-foreground-muted">您的图片已添加水印</p>
                        </div>
                      </div>

                      {/* 结果图片预览 */}
                      <div className="mb-6">
                        <p className="text-sm text-foreground-muted mb-3">预览效果：</p>
                        <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-black/20">
                          <img
                            src={`${process.env.NEXT_PUBLIC_STATIC_URL}${result.url}`}
                            alt="水印预览"
                            className="w-full h-auto max-h-[400px] object-contain mx-auto"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-primary/20">
                          <p className="text-xs text-foreground-muted mb-1">宽度</p>
                          <p className="text-lg font-bold text-white">{result.width}px</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-primary/20">
                          <p className="text-xs text-foreground-muted mb-1">高度</p>
                          <p className="text-lg font-bold text-white">{result.height}px</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-primary/20">
                          <p className="text-xs text-foreground-muted mb-1">原始大小</p>
                          <p className="text-lg font-bold text-white">{result.originalSize}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-primary/20">
                          <p className="text-xs text-foreground-muted mb-1">输出大小</p>
                          <p className="text-lg font-bold text-primary-300">{result.size}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={handleDownload}
                          className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-primary hover:shadow-primary-lg flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>下载带水印图片</span>
                        </button>
                        <button
                          onClick={handleRemoveFile}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 border border-primary/30 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>处理新图片</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 错误提示 */}
                {error && (
                  <div className="error-container flex items-start space-x-3 animate-slide-down">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-400 font-medium">处理失败</p>
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

            {/* 特性展示 */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: "⚡", label: "极速处理", desc: "3秒内完成" },
                { icon: "🔒", label: "安全保障", desc: "30分钟删除" },
                { icon: "🎨", label: "自定义样式", desc: "多种参数可调" },
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

      {/* 步骤说明 */}
      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              如何为图片添加水印
            </h2>
            <p className="text-foreground-muted">简单三步，轻松保护您的图片版权</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border border-primary/20 relative z-10">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 shadow-glow">
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
