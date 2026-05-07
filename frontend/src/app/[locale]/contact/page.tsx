import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "联系我们 - PDF转换器",
  description: "联系PDF转换器团队，如有任何问题或建议，欢迎通过邮件或GitHub与我们联系。",
  keywords: "联系PDF转换器,客服支持,反馈建议,技术咨询",
  alternates: {
    canonical: "https://sunsunblog.top/contact",
  },
  openGraph: {
    title: "联系我们 - PDF转换器",
    description: "联系PDF转换器团队，如有问题或建议欢迎联系我们",
    type: "website",
    url: "https://sunsunblog.top/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-20">
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">📧</span>
              <span className="text-primary-300">联系我们</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              我们很高兴听到您的声音
            </h1>
            <p className="text-lg text-foreground-muted leading-relaxed">
              如果您有任何问题、建议或反馈，请随时与我们联系。我们会尽快回复您。
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">联系方式</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Email */}
              <div className="card-dark rounded-2xl p-8 border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-pink/20 to-accent-cyan/20 rounded-xl flex items-center justify-center mb-6 border border-accent-pink/20">
                  <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">电子邮件</h3>
                <p className="text-foreground-muted mb-4">
                  发送邮件至以下地址，我们会在 24 小时内回复：
                </p>
                <a
                  href="mailto:2531636478@qq.com"
                  className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  2531636478@qq.com
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
              
              {/* GitHub */}
              <div className="card-dark rounded-2xl p-8 border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-pink/20 to-accent-cyan/20 rounded-xl flex items-center justify-center mb-6 border border-accent-cyan/20">
                  <svg className="w-7 h-7 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">GitHub</h3>
                <p className="text-foreground-muted mb-4">
                  在 GitHub 上查看我们的项目，提交 Issue 或 Pull Request：
                </p>
                <a
                  href="https://github.com/sun-liang-rong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  github.com/sun-liang-rong
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">常见问题</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "如何反馈功能建议？",
                  a: "您可以通过电子邮件或 GitHub 发送您的功能建议。我们会认真考虑每一个建议，并尽可能将其纳入未来的开发计划。",
                },
                {
                  q: "发现 Bug 怎么报告？",
                  a: "请在 GitHub 上提交 Issue，描述问题的详细信息，包括您使用的浏览器、文件类型和错误信息。我们会尽快修复。",
                },
                {
                  q: "回复时间需要多久？",
                  a: "我们通常会在 24 小时内回复您的邮件。紧急问题会优先处理。",
                },
                {
                  q: "可以申请 API 接入吗？",
                  a: "目前我们暂不提供公开 API。如有商业合作需求，请通过邮件联系我们讨论具体方案。",
                },
              ].map((faq, index) => (
                <div key={index} className="card-dark rounded-xl p-6 border border-primary/20">
                  <h3 className="text-lg font-bold text-white mb-3">{faq.q}</h3>
                  <p className="text-foreground-muted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500/10 to-primary-700/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">立即开始使用</h2>
          <p className="text-foreground-muted mb-6">体验免费、快速、安全的 PDF 转换服务</p>
          <Link
            href="/pdf-to-word"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
          >
            开始转换
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}