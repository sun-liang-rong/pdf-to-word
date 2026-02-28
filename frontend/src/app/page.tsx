import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF转换器 - 免费在线PDF转Word、Word转PDF工具",
  description: "免费在线PDF转换工具，支持PDF转Word、Word转PDF、PDF转JPG、JPG转PDF等多种格式转换，快速、安全、无需注册。",
};

const tools = [
  {
    title: "PDF转Word",
    description: "将PDF文件转换为可编辑的Word文档，保留原有格式和排版",
    href: "/pdf-to-word",
    icon: "📄",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    popular: true,
  },
  {
    title: "Word转PDF",
    description: "将Word文档转换为PDF格式，确保文档格式不被篡改",
    href: "/word-to-pdf",
    icon: "📝",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    popular: true,
  },
  {
    title: "PDF转JPG",
    description: "将PDF文件的每一页转换为高清JPG图片",
    href: "/pdf-to-jpg",
    icon: "🖼️",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    popular: false,
  },
  {
    title: "JPG转PDF",
    description: "将多张JPG/PNG图片合并转换为单个PDF文件",
    href: "/jpg-to-pdf",
    icon: "📷",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    popular: false,
  },
  {
    title: "PDF合并",
    description: "将多个PDF文件合并为一个，支持拖拽排序",
    href: "/merge-pdf",
    icon: "📑",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    popular: false,
  },
  {
    title: "PDF压缩",
    description: "智能压缩PDF文件大小，保持清晰度便于分享",
    href: "/compress-pdf",
    icon: "📦",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    popular: true,
  },
  {
    title: "PDF删除页面",
    description: "可视化删除PDF中的指定页面，操作简单直观",
    href: "/remove-pages",
    icon: "✂️",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    popular: false,
  },
  {
    title: "PDF排序",
    description: "拖拽调整PDF页面顺序，实时预览调整结果",
    href: "/rearrange-pdf",
    icon: "🔀",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    popular: false,
  },
];

const features = [
  {
    title: "完全免费",
    description: "所有转换功能完全免费使用，无需注册账号，无隐藏费用",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "极速转换",
    description: "采用高性能转换引擎，10MB文件15秒内完成转换",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "安全可靠",
    description: "文件30分钟后自动删除，采用SSL加密传输，不存储任何数据",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "简单易用",
    description: "无需下载安装软件，拖拽上传即可转换，支持所有主流浏览器",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "PDF转换器支持哪些格式转换？",
    answer: "目前支持PDF转Word、Word转PDF、PDF转JPG、JPG转PDF等常用格式转换，以及PDF合并、压缩、删除页面等编辑功能。",
  },
  {
    question: "转换后的文件质量如何？",
    answer: "我们使用专业的转换引擎，最大程度保留原文档的格式、图片和排版。对于扫描版PDF，还支持OCR文字识别。",
  },
  {
    question: "上传的文件安全吗？",
    answer: "您的文件安全是我们的首要任务。所有上传的文件会在30分钟后自动删除，采用SSL加密传输，我们不会存储或分享您的任何文件。",
  },
  {
    question: "文件大小有限制吗？",
    answer: "单个文件大小限制为20MB，足以满足大多数日常文档转换需求。如需处理更大文件，建议先进行PDF压缩。",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm text-gray-600">免费使用，无需注册</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
              免费在线
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"> PDF转换工具 </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              快速、安全、免费的PDF转换服务。支持PDF与Word、图片等多种格式互转，
              以及合并、压缩、编辑等多种功能。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/pdf-to-word"
                className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-glow-lg hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>立即开始转换</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#tools"
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
              >
                <span>查看所有工具</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-500 mt-1">免费使用</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">20MB</div>
                <div className="text-sm text-gray-500 mt-1">单文件上限</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">8+</div>
                <div className="text-sm text-gray-500 mt-1">转换工具</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              选择转换工具
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们提供多种PDF处理工具，满足您的各种需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-soft hover:border-primary-200 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Popular Badge */}
                {tool.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      热门
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {tool.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {tool.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>开始使用</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们致力于提供最优质的PDF转换体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              简单三步，快速转换
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              无需复杂操作，轻松完成PDF转换
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200" />

              {[
                { step: 1, title: "上传文件", desc: "拖拽或点击上传您的PDF文件，支持最大20MB" },
                { step: 2, title: "自动转换", desc: "系统自动识别并开始转换，无需额外操作" },
                { step: 3, title: "下载文件", desc: "转换完成后，点击下载按钮获取转换后的文件" },
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              常见问题
            </h2>
            <p className="text-lg text-gray-600">
              找不到答案？欢迎联系我们
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-soft transition-shadow"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              准备好开始转换了吗？
            </h2>
            <p className="text-xl text-primary-100 mb-10">
              立即体验免费、快速、安全的PDF转换服务
            </p>
            <Link
              href="/pdf-to-word"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>免费开始使用</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
