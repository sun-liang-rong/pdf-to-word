import { Metadata } from "next";
import CompressPdfClient from "./client-page";
import { siteUrl, generateMetadata } from "@/lib/seo-config";

const title = "PDF压缩 - 免费在线压缩PDF文件";
const description = "免费在线压缩PDF文件，支持多种压缩选项，包括优化等级、线性化、灰度化、高对比度线稿转换等功能。";
const keywords = "PDF压缩,压缩PDF,PDF压缩工具,在线PDF压缩,免费PDF压缩";
const path = "/compress-pdf";

export const metadata: Metadata = generateMetadata(title, description, keywords, path);

// JSON-LD 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF压缩工具",
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

export default function CompressPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompressPdfClient />
    </>
  );
}
