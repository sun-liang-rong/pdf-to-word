import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF转换器 - 免费在线PDF转Word、Word转PDF工具",
  description: "免费在线PDF转换工具，支持PDF转Word、Word转PDF、PDF转JPG、JPG转PDF等多种格式转换，快速、安全、无需注册。",
};

const tools = [
  {
    title: "PDF转Word",
    description: "将PDF文件转换为可编辑的Word文档(.docx)",
    href: "/pdf-to-word",
    icon: "📄",
    color: "bg-blue-500",
  },
  {
    title: "Word转PDF",
    description: "将Word文档(.doc/.docx)转换为PDF格式",
    href: "/word-to-pdf",
    icon: "📝",
    color: "bg-green-500",
  },
  {
    title: "PDF转JPG",
    description: "将PDF文件的每一页转换为JPG图片",
    href: "/pdf-to-jpg",
    icon: "🖼️",
    color: "bg-purple-500",
  },
  {
    title: "JPG转PDF",
    description: "将JPG/PNG图片合并转换为PDF文件",
    href: "/jpg-to-pdf",
    icon: "📷",
    color: "bg-orange-500",
  },
];

const features = [
  {
    title: "完全免费",
    description: "所有转换功能完全免费使用，无需注册账号",
    icon: "🆓",
  },
  {
    title: "快速转换",
    description: "采用高性能转换引擎，10MB文件15秒内完成",
    icon: "⚡",
  },
  {
    title: "安全可靠",
    description: "文件30分钟后自动删除，不存储任何用户数据",
    icon: "🔒",
  },
  {
    title: "无需安装",
    description: "在线转换，无需下载安装任何软件",
    icon: "🌐",
  },
];

const faqs = [
  {
    question: "PDF转换器支持哪些格式转换？",
    answer: "目前支持PDF转Word、Word转PDF、PDF转JPG、JPG转PDF等常用格式转换，后续将支持更多格式。",
  },
  {
    question: "转换后的文件质量如何？",
    answer: "我们使用专业的转换引擎，最大程度保留原文档的格式、图片和排版，转换质量业界领先。",
  },
  {
    question: "上传的文件安全吗？",
    answer: "您的文件安全是我们的首要任务。所有上传的文件会在30分钟后自动删除，我们不会存储或分享您的任何文件。",
  },
  {
    question: "文件大小有限制吗？",
    answer: "单个文件大小限制为20MB，足以满足大多数日常文档转换需求。",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            免费在线PDF转换工具
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            快速、安全、免费转换您的PDF文件。支持PDF与Word、图片等多种格式互转。
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/pdf-to-word"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              立即开始转换
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            选择转换工具
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 transition-all"
              >
                <div
                  className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center text-2xl mb-4`}
                >
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            为什么选择我们
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            常见问题
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
