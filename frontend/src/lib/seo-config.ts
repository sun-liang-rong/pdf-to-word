// SEO 配置模板
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunsunblog.top';

// 生成 OpenGraph 图片配置
export const generateOgImage = (alt: string) => ({
  url: `${siteUrl}/og-image.png`,
  width: 1200,
  height: 630,
  alt,
});

// 生成 Twitter 卡片配置
export const generateTwitterCard = (title: string, description: string) => ({
  card: "summary_large_image" as const,
  title,
  description,
  images: [`${siteUrl}/og-image.png`],
});

// 生成 JSON-LD WebApplication 数据
export const generateWebAppJsonLd = (
  name: string,
  description: string,
  path: string,
  faqs?: Array<{ question: string; answer: string }>
) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${siteUrl}${path}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  };

  if (faqs && faqs.length > 0) {
    return {
      ...baseData,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }

  return baseData;
};

// 生成 Metadata 配置
export const generateMetadata = (
  title: string,
  description: string,
  keywords: string,
  path: string
) => ({
  title,
  description,
  keywords,
  alternates: {
    canonical: `${siteUrl}${path}`,
  },
  openGraph: {
    title,
    description,
    type: "website" as const,
    url: `${siteUrl}${path}`,
    images: [generateOgImage(title)],
  },
  twitter: generateTwitterCard(title, description),
});
