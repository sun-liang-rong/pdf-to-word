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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-16">
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">📜</span>
              <span className="text-primary-300">服务条款</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              服务条款
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
                <h2 className="text-2xl font-bold text-white mb-4">接受条款</h2>
                <p className="text-foreground-muted leading-relaxed">
                  使用 PDF转换器（以下简称"我们"或"本服务"）即表示您同意遵守本服务条款。如果您不同意这些条款，请勿使用本服务。我们保留随时修改这些条款的权利，修改后的条款在本页面公布后立即生效。
                </p>
              </div>

              {/* Service Description */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">服务描述</h2>
                <p className="text-foreground-muted leading-relaxed mb-4">
                  PDF转换器提供以下在线文档处理服务：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
                  <li>PDF 转 Word 文档</li>
                  <li>Word 转 PDF</li>
                  <li>PDF 转 JPG 图片</li>
                  <li>JPG/PNG 转 PDF</li>
                  <li>PDF 合并</li>
                  <li>PDF 压缩</li>
                  <li>PDF 页面删除</li>
                  <li>PDF 页面排序</li>
                  <li>PDF 拆分</li>
                  <li>图片压缩</li>
                  <li>图片加水印</li>
                </ul>
                <p className="text-foreground-muted leading-relaxed mt-4">
                  所有服务均免费提供，无需注册账户。
                </p>
              </div>

              {/* Usage Rules */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">使用规则</h2>
                <p className="text-foreground-muted leading-relaxed mb-4">
                  使用本服务时，您同意：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
                  <li>仅上传您有权处理的文件</li>
                  <li>不上传包含非法、有害或侵权内容的文件</li>
                  <li>不尝试破坏、干扰或滥用本服务</li>
                  <li>不使用自动化工具大规模调用本服务</li>
                  <li>遵守所在地区的法律法规</li>
                </ul>
                <div className="mt-4 p-4 bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl">
                  <p className="text-accent-yellow font-medium">
                    ⚠️ 注意：单个文件大小限制为 20MB。超过此限制的文件无法处理。
                  </p>
                </div>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">知识产权</h2>
                <p className="text-foreground-muted leading-relaxed">
                  您上传的文件和转换结果中包含的内容的知识产权归原所有者所有。本服务不获取、不主张、不转移任何知识产权。我们仅提供技术转换服务，对文件内容不拥有任何权利。
                </p>
                <p className="text-foreground-muted leading-relaxed mt-4">
                  本网站的设计、代码、商标等归我们所有，未经授权不得复制或使用。
                </p>
              </div>

              {/* Privacy */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">隐私保护</h2>
                <p className="text-foreground-muted leading-relaxed">
                  我们重视您的隐私。请参阅我们的<a href="/privacy" className="text-primary-400 hover:text-primary-300 transition-colors">隐私政策</a>了解详细信息。
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4 mt-4">
                  <li>所有上传的文件在 30 分钟后自动删除</li>
                  <li>采用 SSL 加密传输</li>
                  <li>不存储用户个人信息</li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">免责声明</h2>
                <p className="text-foreground-muted leading-relaxed mb-4">
                  本服务按"现状"提供，不提供任何明示或暗示的保证，包括但不限于：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4">
                  <li>转换结果的准确性和完整性</li>
                  <li>服务的持续可用性</li>
                  <li>转换结果的格式保持程度</li>
                  <li>特定用途的适用性</li>
                </ul>
                <p className="text-foreground-muted leading-relaxed mt-4">
                  对于扫描版 PDF，转换效果取决于原始文档的清晰度，可能无法完美还原。我们不对转换结果的使用后果承担任何责任。
                </p>
              </div>

              {/* Limitation */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">责任限制</h2>
                <p className="text-foreground-muted leading-relaxed">
                  在适用法律允许的最大范围内，我们不对以下情况承担责任：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4 mt-4">
                  <li>服务中断或不可用</li>
                  <li>数据丢失或损坏</li>
                  <li>因使用本服务导致的任何直接或间接损失</li>
                  <li>第三方行为造成的损害</li>
                </ul>
              </div>

              {/* Termination */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">服务终止</h2>
                <p className="text-foreground-muted leading-relaxed">
                  我们保留在以下情况下终止或限制您使用本服务的权利：
                </p>
                <ul className="list-disc list-inside text-foreground-muted space-y-2 ml-4 mt-4">
                  <li>您违反本服务条款</li>
                  <li>您的行为损害其他用户或本服务</li>
                  <li>法律法规要求</li>
                </ul>
              </div>

              {/* Changes */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">条款变更</h2>
                <p className="text-foreground-muted leading-relaxed">
                  我们可能随时修改本服务条款。修改后的条款将在本页面公布。继续使用本服务即表示您接受修改后的条款。建议您定期查看本页面以了解最新条款。
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">适用法律</h2>
                <p className="text-foreground-muted leading-relaxed">
                  本服务条款受中华人民共和国法律管辖。如有争议，双方应友好协商解决；协商不成的，可向有管辖权的人民法院提起诉讼。
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">联系我们</h2>
                <p className="text-foreground-muted leading-relaxed">
                  如有任何关于本服务条款的问题，请通过以下方式联系我们：
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