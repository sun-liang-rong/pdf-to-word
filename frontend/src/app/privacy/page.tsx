import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 - PDF转换器",
  description: "PDF转换器隐私政策，了解我们如何保护您的数据和隐私安全。",
  keywords: "隐私政策,数据保护,用户隐私,PDF转换器安全",
  alternates: {
    canonical: "https://sunsunblog.top/privacy",
  },
  openGraph: {
    title: "隐私政策 - PDF转换器",
    description: "PDF转换器隐私政策，了解我们如何保护您的数据和隐私安全",
    type: "website",
    url: "https://sunsunblog.top/privacy",
  },
};

export const dynamic = "force-dynamic";


import { Shield, Lock, Trash2, CheckCircle, Clock, EyeOff } from "lucide-react";

export default function PrivacyPage() {
  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "SSL 加密传输",
      description: "所有数据传输均采用 SSL/TLS 加密，确保数据安全。"
    },
    {
      icon: <Trash2 className="w-6 h-6" />,
      title: "30 分钟自动删除",
      description: "所有上传的文件在处理完成后 30 分钟内自动从服务器删除。"
    },
    {
      icon: <EyeOff className="w-6 h-6" />,
      title: "不存储敏感信息",
      description: "我们不会存储您的账户信息、密码或其他敏感个人数据。"
    }
  ];

  const sections = [
    {
      title: "引言",
      content: "PDF转换器（以下简称\"我们\"）致力于保护用户的隐私和数据安全。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本隐私政策的条款。"
    },
    {
      title: "数据收集",
      content: "我们收集的信息仅用于提供和改进服务。具体包括：",
      list: [
        "上传的文件：您上传的 PDF、Word 或图片文件仅用于转换处理，不用于其他目的。",
        "技术信息：浏览器类型、设备类型等用于优化服务体验。",
        "使用数据：访问时间、使用的功能等用于改进服务质量。"
      ]
    },
    {
      title: "数据使用",
      content: "我们收集的数据仅用于以下目的：",
      list: [
        "提供 PDF 转换服务",
        "改进和优化服务性能",
        "保障服务安全，防止滥用",
        "提供技术支持（仅在您主动联系我们时）"
      ]
    },
    {
      title: "第三方服务",
      content: "我们不与任何第三方分享您的文件数据。我们可能使用以下第三方服务来运营网站，但这些服务不会访问您的文件内容：",
      list: [
        "网站分析工具（用于了解网站使用情况）",
        "CDN 服务（用于加速内容分发）"
      ]
    },
    {
      title: "Cookie 使用",
      content: "我们使用 Cookie 来：",
      list: [
        "记住您的主题偏好（亮色/暗色模式）",
        "分析网站使用情况以改进服务"
      ],
      extra: "您可以通过浏览器设置管理 Cookie。禁用 Cookie 可能会影响部分功能的使用体验。"
    },
    {
      title: "您的权利",
      content: "您有权：",
      list: [
        "了解我们收集了哪些数据",
        "要求删除您的数据（文件会在 30 分钟内自动删除）",
        "停止使用我们的服务",
        "联系我们询问隐私相关问题"
      ]
    },
    {
      title: "儿童隐私",
      content: "我们的服务不面向 13 岁以下的儿童。如果您是家长并发现您的孩子使用了我们的服务，请联系我们，我们会采取相应措施。"
    },
    {
      title: "政策变更",
      content: "我们可能会不时更新本隐私政策。重大变更会在本页面公布。建议您定期查看本政策以了解最新信息。"
    },
    {
      title: "联系我们",
      content: "如有任何隐私相关问题，请通过以下方式联系我们：",
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
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-theme-muted">隐私政策</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-theme mb-6">
              隐私政策
            </h1>
            <p className="text-lg text-theme-muted">
              最后更新日期：2024年1月1日
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="glass-card rounded-3xl p-6 hover-lift">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-4 text-emerald-500">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-theme mb-2">{feature.title}</h3>
                <p className="text-sm text-theme-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
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
                  <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <p className="text-theme-muted leading-relaxed mb-4">{section.content}</p>
                
                {section.list && (
                  <ul className="space-y-3 ml-4">
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