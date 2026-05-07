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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-16">
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">🔒</span>
              <span className="text-primary-300">隐私政策</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              隐私政策
            </h1>
            <p className="text-foreground-muted">
              最后更新日期：2024年1月1日
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="card-dark rounded-2xl p-8 border border-primary/20 space-y-8">
              {/* Introduction */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">引言</h2>
                <p className="text-foreground-muted leading-relaxed">
                  PDF转换器（以下简称"我们"）致力于保护用户的隐私和数据安全。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本隐私政策的条款。
                </p>
              </div>

              {/* Data Collection */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">数据收集</h2>
                <p className="text-foreground-muted leading-relaxed mb-4">
                  我们收集的信息仅用于提供和改进服务。具体包括：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
                  <li><strong className="text-white">上传的文件：</strong>您上传的 PDF、Word 或图片文件仅用于转换处理，不用于其他目的。</li>
                  <li><strong className="text-white">技术信息：</strong>浏览器类型、设备类型等用于优化服务体验。</li>
                  <li><strong className="text-white">使用数据：</strong>访问时间、使用的功能等用于改进服务质量。</li>
                </ul>
              </div>

              {/* Data Storage */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">数据存储与安全</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-accent-emerald/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2">SSL 加密传输</h3>
                      <p className="text-foreground-muted">所有数据传输均采用 SSL/TLS 加密，确保数据安全。</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-accent-emerald/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2">30 分钟自动删除</h3>
                      <p className="text-foreground-muted">所有上传的文件在处理完成后 30 分钟内自动从服务器删除。我们不会长期存储您的文件。</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-accent-emerald/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2">不存储敏感信息</h3>
                      <p className="text-foreground-muted">我们不会存储您的账户信息、密码或其他敏感个人数据。</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Usage */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">数据使用</h2>
                <p className="text-foreground-muted leading-relaxed mb-4">
                  我们收集的数据仅用于以下目的：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
                  <li>提供 PDF 转换服务</li>
                  <li>改进和优化服务性能</li>
                  <li>保障服务安全，防止滥用</li>
                  <li>提供技术支持（仅在您主动联系我们时）</li>
                </ul>
              </div>

              {/* Third Party */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">第三方服务</h2>
                <p className="text-foreground-muted leading-relaxed">
                  我们不与任何第三方分享您的文件数据。我们可能使用以下第三方服务来运营网站，但这些服务不会访问您的文件内容：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4 mt-4">
                  <li>网站分析工具（用于了解网站使用情况）</li>
                  <li>CDN 服务（用于加速内容分发）</li>
                </ul>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Cookie 使用</h2>
                <p className="text-foreground-muted leading-relaxed">
                  我们使用 Cookie 来：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4 mt-4">
                  <li>记住您的主题偏好（亮色/暗色模式）</li>
                  <li>分析网站使用情况以改进服务</li>
                </ul>
                <p className="text-foreground-muted leading-relaxed mt-4">
                  您可以通过浏览器设置管理 Cookie。禁用 Cookie 可能会影响部分功能的使用体验。
                </p>
              </div>

              {/* User Rights */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">您的权利</h2>
                <p className="text-foreground-muted leading-relaxed mb-4">
                  您有权：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
                  <li>了解我们收集了哪些数据</li>
                  <li>要求删除您的数据（文件会在 30 分钟内自动删除）</li>
                  <li>停止使用我们的服务</li>
                  <li>联系我们询问隐私相关问题</li>
                </ul>
              </div>

              {/* Children */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">儿童隐私</h2>
                <p className="text-foreground-muted leading-relaxed">
                  我们的服务不面向 13 岁以下的儿童。如果您是家长并发现您的孩子使用了我们的服务，请联系我们，我们会采取相应措施。
                </p>
              </div>

              {/* Changes */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">政策变更</h2>
                <p className="text-foreground-muted leading-relaxed">
                  我们可能会不时更新本隐私政策。重大变更会在本页面公布。建议您定期查看本政策以了解最新信息。
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">联系我们</h2>
                <p className="text-foreground-muted leading-relaxed">
                  如有任何隐私相关问题，请通过以下方式联系我们：
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-foreground-muted">
                    <strong className="text-white">电子邮件：</strong>
                    <a href="mailto:2531636478@qq.com" className="text-primary-400 hover:text-primary-300 transition-colors ml-2">
                      2531636478@qq.com
                    </a>
                  </p>
                  <p className="text-foreground-muted">
                    <strong className="text-white">GitHub：</strong>
                    <a href="https://github.com/sun-liang-rong" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors ml-2">
                      github.com/sun-liang-rong
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}