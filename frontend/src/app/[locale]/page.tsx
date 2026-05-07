import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { AccordionGroup } from '@/components/ui/Accordion';
import { locales } from '@/i18n';

interface ToolItem {
  key: string;
  href: string;
  icon: string;
  gradient: string;
}

interface FeatureItem {
  key: string;
  icon: string;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  const pdfTools: ToolItem[] = [
    { key: "pdfToWord", href: "/pdf-to-word", icon: "📄", gradient: "from-primary-500 to-primary-600" },
    { key: "wordToPdf", href: "/word-to-pdf", icon: "📝", gradient: "from-accent-emerald to-teal-500" },
    { key: "pdfToJpg", href: "/pdf-to-jpg", icon: "🖼️", gradient: "from-accent-pink to-accent-cyan" },
    { key: "jpgToPdf", href: "/jpg-to-pdf", icon: "📷", gradient: "from-orange-500 to-amber-500" },
    { key: "mergePdf", href: "/merge-pdf", icon: "📑", gradient: "from-red-500 to-pink-500" },
    { key: "compressPdf", href: "/compress-pdf", icon: "📦", gradient: "from-teal-500 to-accent-cyan" },
    { key: "removePages", href: "/remove-pages", icon: "✂️", gradient: "from-pink-500 to-rose-500" },
    { key: "rearrangePdf", href: "/rearrange-pdf", icon: "🔀", gradient: "from-indigo-500 to-primary-500" },
  ];

  const imageTools: ToolItem[] = [
    { key: "imageCompress", href: "/image-compress", icon: "🖼️", gradient: "from-emerald-500 to-teal-600" },
    { key: "imageWatermark", href: "/image-watermark", icon: "💧", gradient: "from-blue-500 to-indigo-600" },
  ];

  const features: FeatureItem[] = [
    { key: "free", icon: "🆓" },
    { key: "security", icon: "🔒" },
    { key: "fast", icon: "⚡" },
    { key: "easy", icon: "👆" },
  ];

  const getLocalizedHref = (href: string) => `/${locale}${href}`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-primary-300">{t("hero.subtitle")}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
            </h1>
            
            <p className="text-xl text-foreground-muted mb-10 max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={getLocalizedHref("/pdf-to-word")}
                className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-primary hover:shadow-primary-lg hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>{t("hero.cta")}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("tools.title")}</h2>
            <p className="text-foreground-muted text-lg">{t("tools.subtitle")}</p>
          </div>

          {/* PDF Tools */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="mr-2">{t("tools.categories.pdf")}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pdfTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={getLocalizedHref(tool.href)}
                  className="group relative bg-surface rounded-2xl p-6 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-primary-300 transition-colors">
                    {t(`tools.items.${tool.key}.title`)}
                  </h4>
                  <p className="text-sm text-foreground-muted">
                    {t(`tools.items.${tool.key}.description`)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Image Tools */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="mr-2">{t("tools.categories.image")}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {imageTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={getLocalizedHref(tool.href)}
                  className="group relative bg-surface rounded-2xl p-6 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-primary-300 transition-colors">
                    {t(`tools.items.${tool.key}.title`)}
                  </h4>
                  <p className="text-sm text-foreground-muted">
                    {t(`tools.items.${tool.key}.description`)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("features.title")}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.key} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{t(`features.items.${feature.key}.title`)}</h3>
                <p className="text-foreground-muted text-sm">{t(`features.items.${feature.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{locale === 'zh' ? '常见问题' : 'FAQ'}</h2>
          </div>
          <AccordionGroup />
        </div>
      </section>
    </div>
  );
}
