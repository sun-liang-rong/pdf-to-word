import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服务条款 - PDF转换器",
  description: "PDF转换器服务条款，使用我们的服务前请阅读并理解这些条款。",
  keywords: "服务条款,使用协议,PDF转换器条款,用户协议",
  alternates: {
    canonical: "https://sunsunblog.top/terms",
  },
  openGraph: {
    title: "服务条款 - PDF转换器",
    description: "PDF转换器服务条款，使用我们的服务前请阅读并理解这些条款",
    type: "website",
    url: "https://sunsunblog.top/terms",
  },
};

export const dynamic = "force-dynamic";


import { FileText, AlertTriangle, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const services = [
    "PDF 转 Word 文档",
    "Word 转 PDF",
    "PDF 转 JPG 图片",
    "JPG/PNG 转 PDF",
    "PDF 合并",
    "PDF 压缩",
    "PDF 页面删除",
    "PDF 页面排序",
    "PDF 拆分",
    "图片压缩",
    "图片加水印"
  ];

  const usageRules = [
    "仅上传您有权处理的文件",
    "不上传包含非法、有害或侵权内容的文件",
    "不尝试破坏、干扰或滥用本服务",
    "不使用自动化工具大规模调用本服务",
    "遵守所在地区的法律法规"
  ];

  const sections = [
    {
      title: "接受条款",
      content: "使用 PDF转换器（以下简称\"我们\"或\"本服务\"）即表示您同意遵守本服务条款。如果您不同意这些条款，请勿使用本服务。我们保留随时修改这些条款的权利，修改后的条款在本页面公布后立即生效。"
    },
    {
      title: "服务描述",
      content: "PDF转换器提供以下在线文档处理服务：",
      serviceList: services
    },
    {
      title: "使用规则",
      content: "使用本服务时，您同意：",
      ruleList: usageRules,
      warning: "⚠️ 注意：单个文件大小限制为 20MB。超过此限制的文件无法处理。"
    },
    {
      title: "知识产权",
      content: "您上传的文件和转换结果中包含的内容的知识产权归原所有者所有。本服务不获取、不主张、不转移任何知识产权。我们仅提供技术转换服务，对文件内容不拥有任何权利。",
      extra: "本网站的设计、代码、商标等归我们所有，未经授权不得复制或使用。"
    },
    {
      title: "隐私保护",
      content: "我们重视您的隐私。请参阅我们的隐私政策了解详细信息。",
      list: [
        "所有上传的文件在 30 分钟后自动删除",
        "采用 SSL 加密传输",
        "不存储用户个人信息"
      ]
    },
    {
      title: "免责声明",
      content: "本服务按\"现状\"提供，不提供任何明示或暗示的保证，包括但不限于：",
      list: [
        "转换结果的准确性和完整性",
        "服务的持续可用性",
        "转换结果的格式保持程度",
        "特定用途的适用性"
      ],
      extra: "对于扫描版 PDF，转换效果取决于原始文档的清晰度，可能无法完美还原。我们不对转换结果的使用后果承担任何责任。"
    },
    {
      title: "责任限制",
      content: "在适用法律允许的最大范围内，我们不对以下情况承担责任：",
      list: [
        "服务中断或不可用",
        "数据丢失或损坏",
        "因使用本服务导致的任何直接或间接损失",
        "第三方行为造成的损害"
      ]
    },
    {
      title: "服务终止",
      content: "我们保留在以下情况下终止或限制您使用本服务的权利：",
      list: [
        "您违反本服务条款",
        "您的行为损害其他用户或本服务",
        "法律法规要求"
      ]
    },
    {
      title: "条款变更",
      content: "我们可能随时修改本服务条款。修改后的条款将在本页面公布。继续使用本服务即表示您接受修改后的条款。建议您定期查看本页面以了解最新条款。"
    },
    {
      title: "适用法律",
      content: "本服务条款受中华人民共和国法律管辖。如有争议，双方应友好协商解决；协商不成的，可向有管辖权的人民法院提起诉讼。"
    },
    {
      title: "联系我们",
      content: "如有任何关于本服务条款的问题，请通过以下方式联系我们：",
      contact: true
    }
  ];

  return (
    <div className="min-h-screen bg-theme">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-theme-card border border-theme rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4 mr-2" />
              <span className="text-theme-muted">服务条款</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-theme mb-6">
              服务条款
            </h1>
            <p className="text-lg text-theme-muted">
              最后更新日期：2024年1月1日
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-theme mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <p className="text-theme-muted leading-relaxed mb-4">{section.content}</p>
                
                {section.serviceList && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {section.serviceList.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-theme-muted">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {section.ruleList && (
                  <ul className="space-y-3 ml-4 mb-4">
                    {section.ruleList.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-theme-muted">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {section.warning && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                    <p className="text-amber-500 font-medium">{section.warning}</p>
                  </div>
                )}
                
                {section.list && (
                  <ul className="space-y-3 ml-4 mb-4">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-theme-muted">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {section.extra && (
                  <p className="text-theme-muted leading-relaxed mt-4">{section.extra}</p>
                )}
                
                {section.contact && (
                  <div className="mt-6 space-y-3">
                    <p className="text-theme-muted">
                      <strong className="text-theme">电子邮件：</strong>
                      <a href="mailto:2531636478@qq.com" className="text-indigo-500 hover:text-indigo-400 transition-colors ml-2">
                        2531636478@qq.com
                      </a>
                    </p>
                    <p className="text-theme-muted">
                      <strong className="text-theme">GitHub：</strong>
                      <a href="https://github.com/sun-liang-rong" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-400 transition-colors ml-2">
                        github.com/sun-liang-rong
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}